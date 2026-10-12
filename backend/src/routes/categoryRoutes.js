import { protect, authorize } from '../middleware/auth.js'
import { getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory, } from '../controllers/categoryController.js'
import { Router } from 'express'
import upload from '../middleware/upload.js'
const router = Router()
router.get('/', getCategories)
router.get('/:idOrSlug', getCategory)

router.post('/', protect, authorize('admin', 'staff'), upload.single('image'), createCategory)
router.patch('/:id', protect, authorize('admin', 'staff'), upload.single('image'), updateCategory)
router.delete('/:id', protect, authorize('admin'), deleteCategory)

export default router
