import { optionalAuth } from '../middleware/auth.js'
import { verifyPayment } from '../controllers/paymentController.js'
import { Router } from 'express'
const router = Router()
router.post('/verify', optionalAuth, verifyPayment)

export default router
