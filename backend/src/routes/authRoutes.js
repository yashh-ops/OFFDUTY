import { protect } from '../middleware/auth.js'
import { register, login, adminLogin, logout, getMe } from '../controllers/authController.js'
import { Router } from 'express'
const router = Router()
router.post('/register', register)
router.post('/login', login)
router.post('/admin-login', adminLogin)
router.post('/logout', logout)
router.get('/me', protect, getMe)

export default router
