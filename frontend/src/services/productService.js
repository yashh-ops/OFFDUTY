// OFFDUTY live catalogue adapter. No fabricated catalogue fallback in production.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5050/api').replace(/\/$/, '')
async function request(path) {
  const response = await fetch(`${BASE}${path}`)
  const body = await response.json().catch(() => ({}))
  if (!response.ok || body.success === false) throw new Error(body.message || `Catalogue request failed (${response.status})`)
  return body
}
const qs = (obj) => { const p = new URLSearchParams(); Object.entries(obj).forEach(([k,v]) => { if (v !== undefined && v !== null && v !== '' && v !== 'all' && (!Array.isArray(v) || v.length)) p.set(k, Array.isArray(v) ? v.join(',') : v) }); return p.toString() }
function adapt(p) {
  if (!p) return null
  const variants = p.variants || []
  return {
    ...p, id: String(p._id || p.id), category: p.category?.slug || p.category || '',
    collection: p.collection?.slug || p.collection || '',
    images: (p.images || []).map(i => typeof i === 'string' ? i : i.url).filter(Boolean),
    colors: (p.colors || []).map(c => typeof c === 'string' ? {name:c,hex:'#555555'} : c),
    gender: (p.gender || 'Unisex').toLowerCase(),
    stockCount: variants.length ? variants.reduce((sum,v) => sum + (v.stock || 0), 0) : p.stockCount,
    variants,
  }
}
const products = body => (body.products || []).map(adapt)
export async function getCategories() { const body = await request('/categories'); return body.categories || [] }
export async function getAllProducts() { return products(await request('/products?limit=200')) }
export async function getProductBySlug(slug) { try { return adapt((await request(`/products/${encodeURIComponent(slug)}`)).product) } catch(e) { if (/404/.test(e.message)) return null; throw e } }
export async function getFeaturedProducts(limit=8) { return products(await request(`/products/featured?limit=${limit}`)).slice(0,limit) }
export async function getNewArrivals(limit=8) { return products(await request(`/products/new-arrivals?limit=${limit}`)).slice(0,limit) }
export async function getRelatedProducts(product,limit=4) { if(!product) return []; return products(await request(`/products/${encodeURIComponent(product.slug)}/related`)).slice(0,limit) }
export async function searchProducts(query,gender) { if (!query?.trim()) return []; return products(await request(`/products/search?${qs({q:query,gender})}`)).filter(p => !gender || gender === 'all' || p.gender === gender || p.gender === 'unisex').slice(0,8) }
export async function getFilteredProducts({categories=[],minPrice,maxPrice,sizes=[],inStockOnly=false,gender,sort='featured'}={}) {
  return products(await request(`/products?${qs({categories,sizes,minPrice,maxPrice,inStock:inStockOnly?'1':undefined,gender,sort,limit:200})}`))
}
