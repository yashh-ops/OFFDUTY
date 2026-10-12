import authRoutes from './authRoutes.js'
import wishlistRoutes from './wishlistRoutes.js'
import userRoutes from './userRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import collectionRoutes from './collectionRoutes.js'
import productRoutes from './productRoutes.js'
import orderRoutes from './orderRoutes.js'
import invoiceRoutes from './invoiceRoutes.js'
import bannerRoutes from './bannerRoutes.js'
import promoCodeRoutes from './promoCodeRoutes.js'
import flashSaleRoutes from './flashSaleRoutes.js'
import supportRoutes from './supportRoutes.js'
import updateRoutes from './updateRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import shippingRoutes from './shippingRoutes.js'
import { Router } from 'express'
const router = Router()

router.use('/auth', authRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/users', userRoutes)
router.use('/categories', categoryRoutes)
router.use('/collections', collectionRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)
router.use('/invoices', invoiceRoutes)
router.use('/banners', bannerRoutes)
router.use('/promo-codes', promoCodeRoutes)
router.use('/flash-sales', flashSaleRoutes)
router.use('/support', supportRoutes)
router.use('/updates', updateRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/payments', paymentRoutes)
router.use('/shipping', shippingRoutes)

export default router
