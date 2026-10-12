import { protect, authorize } from '../middleware/auth.js'
import { getUpdates, createUpdate, deleteUpdate } from '../controllers/updateController.js'
import { Router } from 'express'
const router = Router()
router.get('/', getUpdates)
router.post('/', protect, authorize('admin', 'staff'), createUpdate)
router.delete('/:id', protect, authorize('admin'), deleteUpdate)

export default router
