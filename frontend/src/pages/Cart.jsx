import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, CheckCircle2 } from "lucide-react";

import {
  checkoutOrder,
  verifyRazorpayPayment,
  loadRazorpayCheckout,
} from "../services/orderService";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Button from "../components/common/Button";
import QuantityInput from "../components/common/QuantityInput";

// Default shipping address
const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    promoCode,
    promoLabel,
    promoError,
    applyPromo,
    removePromo,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    itemCount,
    amountToFreeShipping,
  } = useCart();

  const navigate = useNavigate();
  const { user } = useAuth();

  // States
  const [promoInput, setPromoInput] = useState("");
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Update shipping fields
  function handleAddressChange(field, value) {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: null,
    }));

    setCheckoutError("");
  }

  // Validate shipping address
  function validateAddress() {
    const next = {};

    if (!address.fullName.trim()) {
      next.fullName = "Full name is required";
    }

    if (!/^\d{10}$/.test(address.phone.trim())) {
      next.phone = "Enter a valid 10-digit phone number";
    }

    if (!address.addressLine.trim()) {
      next.addressLine = "Address is required";
    }

    if (!address.city.trim()) {
      next.city = "City is required";
    }

    if (!address.state.trim()) {
      next.state = "State is required";
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      next.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  // Handle order placement
  async function handlePlaceOrder(e) {
    e.preventDefault();

    // Prevent duplicate orders
    if (placing) return;

    // Check login
    if (!user) {
      navigate("/login?next=%2Fcart");
      return;
    }

    // Validate shipping address
    if (!validateAddress()) {
      setCheckoutError(
        "Please complete all required shipping details correctly.",
      );
      return;
    }

    const customerEmail = user?.email || email.trim();

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setCheckoutError(
        "Please enter a valid email address for your order receipt.",
      );
      return;
    }

    setCheckoutError("");
    setPlacing(true);

    try {
      // Send checkout request to backend
      const result = await checkoutOrder({
        items: items.map(({ productId, size, color, quantity }) => ({
          productId,
          size,
          color,
          quantity,
        })),

        shippingAddress: {
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          addressLine: address.addressLine.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.pincode.trim(),
        },

        email: customerEmail,
        promoCode: promoCode || undefined,
        paymentMethod,
      });

      // Check backend response
      if (!result?.order) {
        throw new Error(
          "Invalid server response. Please check your order status.",
        );
      }

      // Razorpay payment
      if (paymentMethod === "Razorpay") {
        if (!result.razorpayOrder?.id || !result.razorpayKeyId) {
          throw new Error(
            "Online payment is not configured. Your bag has been preserved.",
          );
        }

        // Load Razorpay script
        await loadRazorpayCheckout();

        const payment = await new Promise((resolve, reject) => {
          const instance = new window.Razorpay({
            key: result.razorpayKeyId,
            amount: result.razorpayOrder.amount,
            currency: result.razorpayOrder.currency,

            name: "OFFDUTY",

            description: `Order ${result.order.orderNumber}`,

            order_id: result.razorpayOrder.id,

            prefill: {
              name: address.fullName,
              email: customerEmail,
              contact: address.phone,
            },

            theme: {
              color: "#171717",
            },

            handler: resolve,

            modal: {
              ondismiss: () =>
                reject(
                  new Error(
                    "Payment window closed. Your bag is preserved. Check your payment status before trying again.",
                  ),
                ),
            },
          });

          instance.on("payment.failed", (failure) => {
            reject(new Error(failure.error?.description || "Payment failed."));
          });

          instance.open();
        });

        // Verify payment on backend
        await verifyRazorpayPayment({
          orderId: result.order._id,
          ...payment,
        });
      }

      // Order successfully placed
      setOrder({
        id: result.order.orderNumber,
        total: result.order.total,
        itemCount,
        address: { ...address },
        paymentMethod,
      });

      // Clear cart only after success
      clearCart();
    } catch (error) {
      console.error("OFFDUTY Checkout Error:", error);

      setCheckoutError(
        error.message || "Checkout failed. Your bag has not been cleared.",
      );
    } finally {
      setPlacing(false);
    }
  }

  // ORDER SUCCESS SCREEN
  if (order) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <CheckCircle2 size={48} className="text-neutral-900" />

        <h1 className="mt-5 text-2xl font-bold">Order placed!</h1>

        <p className="mt-2 text-sm text-neutral-600">
          Thanks
          {order.address.fullName
            ? `, ${order.address.fullName.split(" ")[0]}`
            : ""}{" "}
          — your order{" "}
          <span className="font-semibold text-neutral-900">{order.id}</span> is
          confirmed.{" "}
          {order.paymentMethod === "COD"
            ? "Your cash-on-delivery order has been recorded."
            : "Your online payment has been verified."}
        </p>

        <div className="mt-6 w-full rounded-lg border border-neutral-200 p-5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Items</span>

            <span className="font-medium">{order.itemCount}</span>
          </div>

          <div className="mt-2 flex justify-between">
            <span className="text-neutral-500">Order total</span>

            <span className="font-semibold">₹{order.total}</span>
          </div>

          <div className="mt-2 flex justify-between">
            <span className="text-neutral-500">Shipping to</span>

            <span className="text-right font-medium">
              {order.address.city}, {order.address.state}{" "}
              {order.address.pincode}
            </span>
          </div>
        </div>

        <Button className="mt-8 w-full" onClick={() => navigate("/shop")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  // EMPTY CART SCREEN
  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <ShoppingBag size={40} className="text-neutral-300" />

        <h1 className="mt-4 text-xl font-bold">Your bag is empty</h1>

        <p className="mt-2 text-sm text-neutral-500">
          Looks like you haven't added anything yet.
        </p>

        <Button as={Link} to="/shop" className="mt-6">
          Start Shopping
        </Button>
      </div>
    );
  }

  // MAIN CART PAGE
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Your Bag</h1>

      <p className="mt-1 text-sm text-neutral-500">{itemCount} items</p>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        {/* LEFT SIDE */}
        <div>
          {/* CART ITEMS */}
          <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-24 flex-none bg-neutral-100 object-cover"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>

                      <p className="mt-0.5 text-xs text-neutral-500">
                        {item.color} / {item.size}
                      </p>
                    </div>

                    <p className="text-sm font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <QuantityInput
                      size="sm"
                      value={item.quantity}
                      max={item.stockCount}
                      onChange={(qty) => updateQuantity(item.id, qty)}
                    />

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* SHIPPING ADDRESS FORM */}
          <form
            id="checkout-form"
            onSubmit={handlePlaceOrder}
            className="mt-10 border-t border-neutral-200 pt-8"
            aria-label="Shipping address"
            noValidate
          >
            <h2 className="text-lg font-bold">Shipping Address</h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                error={errors.fullName}
                className="sm:col-span-2"
              >
                <input
                  value={address.fullName}
                  onChange={(e) =>
                    handleAddressChange("fullName", e.target.value)
                  }
                  autoComplete="name"
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>

              <Field label="Phone number" error={errors.phone}>
                <input
                  value={address.phone}
                  onChange={(e) => handleAddressChange("phone", e.target.value)}
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>

              <Field label="Pincode" error={errors.pincode}>
                <input
                  value={address.pincode}
                  onChange={(e) =>
                    handleAddressChange("pincode", e.target.value)
                  }
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>

              <Field label="Email" className="sm:col-span-2">
                <input
                  type="email"
                  value={user?.email || email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={Boolean(user?.email)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>

              <Field
                label="Address"
                error={errors.addressLine}
                className="sm:col-span-2"
              >
                <input
                  value={address.addressLine}
                  onChange={(e) =>
                    handleAddressChange("addressLine", e.target.value)
                  }
                  autoComplete="street-address"
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>

              <Field label="City" error={errors.city}>
                <input
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  autoComplete="address-level2"
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>

              <Field label="State" error={errors.state}>
                <input
                  value={address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  autoComplete="address-level1"
                  className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
              </Field>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div className="h-fit rounded-lg border border-neutral-200 p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Order Summary</h2>

          {/* FREE SHIPPING MESSAGE */}
          {amountToFreeShipping > 0 ? (
            <p className="mt-3 text-xs text-neutral-600">
              Add <span className="font-semibold">₹{amountToFreeShipping}</span>{" "}
              more for free shipping.
            </p>
          ) : (
            <p className="mt-3 text-xs font-medium text-green-700">
              You've unlocked free shipping.
            </p>
          )}

          {/* PROMO CODE */}
          <div className="mt-4">
            {promoCode ? (
              <div className="flex items-center justify-between rounded-md bg-neutral-100 px-3 py-2 text-sm">
                <span>
                  <span className="font-medium">{promoCode}</span> applied —{" "}
                  {promoLabel}
                </span>

                <button
                  type="button"
                  onClick={removePromo}
                  className="text-xs font-medium underline underline-offset-4"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code"
                  className="min-w-0 flex-1 border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />

                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    await applyPromo(promoInput);
                    setPromoInput("");
                  }}
                >
                  Apply
                </Button>
              </div>
            )}

            {promoError && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {promoError}
              </p>
            )}
          </div>

          {/* PRICE BREAKDOWN */}
          <div className="mt-5 space-y-2.5 border-t border-neutral-200 pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Discount</span>
                <span className="font-medium text-green-700">-₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-neutral-500">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">Tax</span>
              <span className="font-medium">₹{tax}</span>
            </div>
          </div>

          {/* TOTAL */}
          <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-base font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {/* PAYMENT METHOD */}
          <fieldset className="mt-5 space-y-2 border-t border-neutral-200 pt-4">
            <legend className="mb-2 text-sm font-semibold">
              Payment method
            </legend>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "Razorpay"}
                onChange={() => setPaymentMethod("Razorpay")}
              />
              Pay online (Razorpay)
            </label>
          </fieldset>

          <p className="mt-4 text-xs text-neutral-600">
            The server calculates the final payable amount. Online payment
            requires configured Razorpay test or live credentials.
          </p>

          {/* ERROR MESSAGE */}
          {checkoutError && (
            <p role="alert" className="mt-3 text-sm font-medium text-red-700">
              {checkoutError}
            </p>
          )}

          {/* PLACE ORDER BUTTON */}
          <Button
            type="submit"
            form="checkout-form"
            disabled={placing}
            className="mt-6 w-full"
            size="lg"
          >
            {placing
              ? "Processing..."
              : paymentMethod === "COD"
                ? "Place Cash-on-Delivery Order"
                : "Proceed to Secure Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Reusable form field
function Field({ label, error, children, className = "" }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1.5 block font-medium text-neutral-700">{label}</span>

      {children}

      {error && (
        <span className="mt-1 block text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
