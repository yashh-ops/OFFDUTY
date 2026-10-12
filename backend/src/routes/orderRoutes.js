import { protect, authorize } from '../middleware/auth.js'
import { checkout, getMyOrders, getOrders, getOrder, updateOrderStatus } from '../controllers/orderController.js'
import { shipOrder, trackOrder } from '../controllers/shipmentController.js'
import { Router } from 'express'
const router = Router()
router.post('/checkout', protect, checkout)
router.get('/mine', protect, getMyOrders)
router.get('/', protect, authorize('admin', 'staff'), getOrders)
router.get('/:id', protect, getOrder)
router.patch('/:id/status', protect, authorize('admin', 'staff'), updateOrderStatus)
router.post('/:id/ship', protect, authorize('admin', 'staff'), shipOrder)
router.get('/:id/track', protect, trackOrder)

export default router
