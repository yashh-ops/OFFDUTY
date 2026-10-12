import mongoose from 'mongoose'
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customer: String,
    email: String,
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Unpaid', 'Paid', 'Refunded'], default: 'Unpaid' },
  },
  { timestamps: true }
)

export default mongoose.model('Invoice', invoiceSchema)
