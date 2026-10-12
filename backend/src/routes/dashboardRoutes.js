import { protect, authorize } from '../middleware/auth.js'
import { getDashboard } from '../controllers/dashboardController.js'
import { Router } from 'express'
const router = Router()
router.get('/', protect, authorize('admin', 'staff'), getDashboard)

export default router
