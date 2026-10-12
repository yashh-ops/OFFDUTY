import mongoose from 'mongoose'
const updateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: { type: String, enum: ['Feature', 'Fix', 'Improvement'], default: 'Feature' },
  },
  { timestamps: true }
)

export default mongoose.model('Update', updateSchema)
