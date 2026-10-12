import { protect, authorize } from '../middleware/auth.js'
import { getInvoices, getInvoice, downloadInvoicePdf } from '../controllers/invoiceController.js'
import { Router } from 'express'
const router = Router()
router.use(protect, authorize('admin', 'staff'))
router.get('/', getInvoices)
router.get('/:id', getInvoice)
router.get('/:id/pdf', downloadInvoicePdf)

export default router
