import { createContext, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CartContext = createContext(null)

const FREE_SHIPPING_THRESHOLD = 2999
const STANDARD_SHIPPING = 149
const TAX_RATE = 0.05

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5050/api').replace(/\/$/, '')

function lineId(productId, size, color) {
  return `${productId}::${size}::${color}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('cart:items', [])
  const [isCartOpen, setCartOpen] = useState(false)
  const [promoCode, setPromoCode] = useLocalStorage('cart:promo', null)
  const [promoError, setPromoError] = useState('')
  const [promoDetails, setPromoDetails] = useState(null)

  function addItem(product, { size, color, quantity = 1 }) {
    setItems((prev) => {
      const id = lineId(product.id, size, color)
      const existing = prev.find((item) => item.id === id)
      const variant = product.variants?.length ? product.variants.find(v => v.size === size && v.color === color) : null
      const maxQty = product.variants?.length ? (variant?.stock ?? 0) : product.stockCount
      if (maxQty <= 0) return prev

      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, maxQty)
        return prev.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item))
      }

      return [
        ...prev,
        {
          id,
          productId: product.id,
          variantSku: variant?.sku || null,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          price: variant?.price ?? product.price,
          size,
          color,
          quantity: Math.min(quantity, maxQty),
          stockCount: maxQty,
        },
      ]
    })
    setCartOpen(true)
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function updateQuantity(id, quantity) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stockCount)) }
          : item
      )
    )
  }

  function clearCart() {
    setItems([])
    setPromoCode(null)
    setPromoDetails(null)
  }

  async function applyPromo(code) {
    const normalized = code.trim().toUpperCase()
    if (!normalized) return
    setPromoError('')
    try {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const response = await fetch(`${API_BASE}/promo-codes/validate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalized, subtotal }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.success) throw new Error(data.message || 'Promo code unavailable')
      setPromoDetails(data)
      setPromoCode(data.code)
    } catch (error) {
      setPromoDetails(null)
      setPromoCode(null)
      setPromoError(error.message || 'Could not validate promo code')
    }
  }

  function removePromo() {
    setPromoCode(null)
    setPromoDetails(null)
    setPromoError('')
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const promo = promoCode && promoDetails?.code === promoCode ? promoDetails : null

    const discount = promo ? Math.min(subtotal, promo.discount || 0) : 0
    const discountedSubtotal = subtotal - discount

    let shipping = subtotal === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING
    if (promo?.freeShipping) shipping = 0

    const tax = Math.round(discountedSubtotal * TAX_RATE)
    const total = discountedSubtotal + shipping + tax
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal)

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      itemCount,
      amountToFreeShipping,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    }
  }, [items, promoCode, promoDetails])

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isCartOpen,
    setCartOpen,
    promoCode,
    promoLabel: promoDetails?.code === promoCode ? (promoDetails.freeShipping ? 'Free shipping' : `₹${promoDetails.discount} off`) : null,
    promoError,
    applyPromo,
    removePromo,
    ...totals,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
