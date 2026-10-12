import { protect, authorize } from '../middleware/auth.js'
import { getFlashSales,
  getActiveFlashSale,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale, } from '../controllers/flashSaleController.js'
import { Router } from 'express'
const router = Router()
router.get('/active', getActiveFlashSale)

router.get('/', protect, authorize('admin', 'staff'), getFlashSales)
router.post('/', protect, authorize('admin', 'staff'), createFlashSale)
router.patch('/:id', protect, authorize('admin', 'staff'), updateFlashSale)
router.delete('/:id', protect, authorize('admin'), deleteFlashSale)

export default router
