import { protect, authorize, optionalAuth } from '../middleware/auth.js'
import { getTickets, getMyTickets, getTicket, createTicket, addMessage, updateTicket } from '../controllers/supportController.js'
import { Router } from 'express'
const router = Router()
router.post('/', optionalAuth, createTicket)
router.get('/mine', protect, getMyTickets)
router.get('/', protect, authorize('admin', 'staff'), getTickets)
router.get('/:id', protect, getTicket)
router.post('/:id/messages', protect, addMessage)
router.patch('/:id', protect, authorize('admin', 'staff'), updateTicket)

export default router
