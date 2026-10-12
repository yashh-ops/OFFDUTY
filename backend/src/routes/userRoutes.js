import { protect, authorize } from '../middleware/auth.js'
import { getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  addAddress,
  updateAddress,
  deleteAddress, } from '../controllers/userController.js'
import { Router } from 'express'
const router = Router()
router.patch('/me', protect, updateMe)
router.post('/me/addresses', protect, addAddress)
router.patch('/me/addresses/:addressId', protect, updateAddress)
router.delete('/me/addresses/:addressId', protect, deleteAddress)

router.get('/', protect, authorize('admin', 'staff'), getUsers)
router.get('/:id', protect, authorize('admin', 'staff'), getUser)
router.patch('/:id', protect, authorize('admin'), updateUser)
router.delete('/:id', protect, authorize('admin'), deleteUser)

export default router
