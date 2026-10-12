import { nextSequence } from "../models/Counter.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Order from "../models/Order.js";
import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import PromoCode from "../models/PromoCode.js";
import * as shiprocketService from "../services/shiprocketService.js";
import razorpay from "../config/razorpay.js";
const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_SHIPPING = 149;
const TAX_RATE = 0.05;

// Recomputes totals server-side from the DB — never trusts client-sent prices.
async function priceCart(items, promoCode) {
  if (!items?.length) throw new ApiError(400, "Cart is empty");

  const products = await Product.find({
    _id: { $in: items.map((i) => i.productId) },
  });
  const productMap = Object.fromEntries(
    products.map((p) => [String(p._id), p]),
  );

  const pricedItems = items.map((item) => {
    const product = productMap[item.productId];
    if (!product)
      throw new ApiError(400, `Product ${item.productId} not found`);
    if (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1)
      throw new ApiError(400, "Invalid quantity");
    const variant = product.variants?.length
      ? product.variants.find(
          (v) => v.size === item.size && v.color === item.color,
        )
      : null;
    if (product.variants?.length && !variant)
      throw new ApiError(
        400,
        `Select a valid size and color for ${product.name}`,
      );
    if (variant && variant.stock < item.quantity)
      throw new ApiError(400, `${product.name} variant is out of stock`);
    if (product.stockCount < item.quantity)
      throw new ApiError(400, `${product.name} is out of stock`);

    return {
      product: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: variant?.price ?? product.price,
      variantSku: variant?.sku,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    };
  });

  // Reject combined quantities that exceed the same SKU's available stock.
  const grouped = new Map();
  for (const line of pricedItems) {
    const key = `${line.product}:${line.variantSku || "legacy"}`;
    grouped.set(key, (grouped.get(key) || 0) + line.quantity);
  }
  for (const [key, quantity] of grouped) {
    const [id, sku] = key.split(":");
    const product = productMap[id];
    const available =
      sku === "legacy"
        ? product.stockCount
        : product.variants.find((v) => v.sku === sku)?.stock;
    if (quantity > available)
      throw new ApiError(409, "Cart quantity exceeds available stock");
  }
  const subtotal = pricedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  let discount = 0;
  let freeShipping = false;
  let appliedCode;
  if (promoCode) {
    const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });
    if (!promo || !["Active", "Expiring"].includes(promo.status))
      throw new ApiError(400, "Invalid or expired promo code");
    if (subtotal < promo.minOrderValue)
      throw new ApiError(400, `Minimum order value is ₹${promo.minOrderValue}`);
    if (promo.type === "Percent")
      discount = Math.round(subtotal * (promo.value / 100));
    if (promo.type === "Flat") discount = Math.min(promo.value, subtotal);
    if (promo.type === "Shipping") freeShipping = true;
    appliedCode = promo;
  }

  const discountedSubtotal = subtotal - discount;
  let shipping =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  if (freeShipping) shipping = 0;
  const tax = Math.round(discountedSubtotal * TAX_RATE);
  const total = discountedSubtotal + shipping + tax;

  return { pricedItems, subtotal, discount, shipping, tax, total, appliedCode };
}

// Conditional atomic updates prevent negative stock under concurrent checkouts.
async function decrementStockAndCount(items) {
  const completed = [];
  try {
    for (const item of items) {
      const filter = { _id: item.product, stockCount: { $gte: item.quantity } };
      const update = {
        $inc: { stockCount: -item.quantity, sold: item.quantity },
      };
      if (item.variantSku) {
        filter.variants = {
          $elemMatch: { sku: item.variantSku, stock: { $gte: item.quantity } },
        };
        update.$inc["variants.$.stock"] = -item.quantity;
      }
      const result = await Product.findOneAndUpdate(filter, update);
      if (!result)
        throw new ApiError(409, `Insufficient inventory for ${item.name}`);
      completed.push(item);
    }
  } catch (error) {
    await restockItems(completed);
    throw error;
  }
}

async function restockItems(items) {
  for (const item of items) {
    const update = {
      $inc: { stockCount: item.quantity, sold: -item.quantity },
    };
    const filter = { _id: item.product };
    if (item.variantSku) {
      filter["variants.sku"] = item.variantSku;
      update.$inc["variants.$.stock"] = item.quantity;
    }
    await Product.findOneAndUpdate(filter, update);
  }
}

async function createInvoice(order, status = "Paid") {
  const seq = await nextSequence("invoice");
  return Invoice.create({
    invoiceNumber: `INV-${seq}`,
    order: order._id,
    customer: order.shippingAddress.fullName,
    email: order.email,
    amount: order.total,
    status,
  });
}

// Best-effort Shiprocket push — logged, never blocks the order response.
async function fulfillShipment(order) {
  try {
    const shipment = await shiprocketService.createShipment(order);
    order.shiprocket = {
      shipmentId: String(shipment.shipment_id || ""),
      orderId: String(shipment.order_id || ""),
      awbCode: shipment.awb_code || "",
      courierName: shipment.courier_name || "",
      trackingStatus: "Assigned",
    };
    await order.save();
  } catch (err) {
    console.error(
      `Shiprocket fulfillment failed for order ${order.orderNumber}:`,
      err.response?.data || err.message,
    );
  }
}

// POST /api/orders/checkout
const checkout = asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    promoCode,
    paymentMethod = "Razorpay",
    email,
  } = req.body;
  if (!shippingAddress) throw new ApiError(400, "Shipping address is required");

  const { pricedItems, subtotal, discount, shipping, tax, total, appliedCode } =
    await priceCart(items, promoCode);

  const seq = await nextSequence("order");
  const order = await Order.create({
    orderNumber: `ORD-${seq}`,
    user: req.user?._id,
    email: email || req.user?.email,
    items: pricedItems,
    shippingAddress,
    promoCode: appliedCode?.code,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
  });

  if (appliedCode)
    await PromoCode.findByIdAndUpdate(appliedCode._id, {
      $inc: { usedCount: 1 },
    });

  if (paymentMethod === "COD") {
    try {
      await decrementStockAndCount(pricedItems);
    } catch (error) {
      await Order.findByIdAndDelete(order._id);
      if (appliedCode)
        await PromoCode.findByIdAndUpdate(appliedCode._id, {
          $inc: { usedCount: -1 },
        });
      throw error;
    }
    await createInvoice(order, "Unpaid"); // COD — cash is collected on delivery, not now
    fulfillShipment(order); // fire and forget
    return res.status(201).json({ success: true, order });
  }

  // Razorpay flow — order stays Pending until /verify-payment confirms it.
  // Required lazily: the SDK throws synchronously if RAZORPAY_KEY_ID is unset,
  // and importing it at module scope would crash the whole server on boot
  // whenever Razorpay isn't configured yet (e.g. COD-only local dev).
  const rzpOrder = await razorpay.orders.create({
    amount: Math.round(total * 100),
    currency: "INR",
    receipt: order.orderNumber,
  });
  order.razorpay = { orderId: rzpOrder.id };
  await order.save();

  res.status(201).json({
    success: true,
    order,
    razorpayOrder: {
      id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    },
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
});

// GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, orders });
});

// GET /api/orders (admin)
const getOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "items.product",
    "name slug images",
  );
  if (!order) throw new ApiError(404, "Order not found");

  const isOwner = order.user && String(order.user) === String(req.user?._id);
  const isStaff = ["admin", "staff"].includes(req.user?.role);
  if (!isOwner && !isStaff)
    throw new ApiError(403, "Not authorized to view this order");

  res.json({ success: true, order });
});

// PATCH /api/orders/:id/status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  const { status, cancelReason } = req.body;
  if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  if (status === "Cancelled" && order.status !== "Cancelled") {
    await restockItems(order.items);
    if (order.paymentStatus === "Paid") {
      order.paymentStatus = "Refunded";
      await Invoice.findOneAndUpdate(
        { order: order._id },
        { status: "Refunded" },
      );
    }
    order.cancelReason = cancelReason;
    if (order.shiprocket?.orderId) {
      shiprocketService
        .cancelShipment(order.shiprocket.orderId)
        .catch((err) =>
          console.error("Shiprocket cancel failed:", err.message),
        );
    }
  }

  // COD cash is collected at the door — mark it paid once delivery is confirmed.
  if (
    status === "Delivered" &&
    order.paymentMethod === "COD" &&
    order.paymentStatus === "Pending"
  ) {
    order.paymentStatus = "Paid";
    await Invoice.findOneAndUpdate({ order: order._id }, { status: "Paid" });
  }

  order.status = status;
  await order.save();
  res.json({ success: true, order });
});

export {
  checkout,
  getMyOrders,
  getOrders,
  getOrder,
  updateOrderStatus,
  // exported for paymentController
  createInvoice,
  decrementStockAndCount,
  fulfillShipment,
};
