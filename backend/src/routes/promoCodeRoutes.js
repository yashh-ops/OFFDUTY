import { protect, authorize } from '../middleware/auth.js'
import { getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode, } from '../controllers/promoCodeController.js'
import { Router } from 'express'
const router = Router()
router.post('/validate', validatePromoCode)

router.get('/', protect, authorize('admin', 'staff'), getPromoCodes)
router.post('/', protect, authorize('admin', 'staff'), createPromoCode)
router.patch('/:id', protect, authorize('admin', 'staff'), updatePromoCode)
router.delete('/:id', protect, authorize('admin'), deletePromoCode)

export default router
