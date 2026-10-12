import { protect, authorize } from '../middleware/auth.js'
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js'
import { Router } from 'express'
import upload from '../middleware/upload.js'
const router = Router()
router.get('/', getBanners)
router.post('/', protect, authorize('admin', 'staff'), upload.single('image'), createBanner)
router.patch('/:id', protect, authorize('admin', 'staff'), upload.single('image'), updateBanner)
router.delete('/:id', protect, authorize('admin'), deleteBanner)

export default router
