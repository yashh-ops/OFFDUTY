const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5050/api').replace(/\/$/, '')
export async function checkoutOrder(payload) {
  const response = await fetch(`${BASE}/orders/checkout`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) throw new Error(data.message || `Checkout failed (${response.status})`)
  if (!data.order?.orderNumber) throw new Error('Order confirmation was missing from the server response')
  return data
}

// Load the official Razorpay checkout only when a customer selects online payment.
export function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => window.Razorpay ? resolve() : reject(new Error('Payment checkout unavailable'))
    script.onerror = () => reject(new Error('Could not load secure payment checkout'))
    document.body.appendChild(script)
  })
}

export async function verifyRazorpayPayment(payload) {
  const response = await fetch(`${BASE}/payments/verify`, {
    method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) throw new Error(data.message || 'Payment verification failed; contact support before paying again.')
  return data
}
