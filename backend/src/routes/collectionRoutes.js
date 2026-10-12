import { protect, authorize } from '../middleware/auth.js'
import { getCollections,
  getCollection,
  getCollectionProducts,
  createCollection,
  updateCollection,
  deleteCollection, } from '../controllers/collectionController.js'
import { Router } from 'express'
import upload from '../middleware/upload.js'
const router = Router()
router.get('/', getCollections)
router.get('/:idOrSlug', getCollection)
router.get('/:idOrSlug/products', getCollectionProducts)

router.post('/', protect, authorize('admin', 'staff'), upload.single('image'), createCollection)
router.patch('/:id', protect, authorize('admin', 'staff'), upload.single('image'), updateCollection)
router.delete('/:id', protect, authorize('admin'), deleteCollection)

export default router
