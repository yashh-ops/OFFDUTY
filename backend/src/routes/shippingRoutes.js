import { checkServiceability } from '../controllers/shipmentController.js'
import { Router } from 'express'
const router = Router()
router.get('/serviceability', checkServiceability)

export default router
