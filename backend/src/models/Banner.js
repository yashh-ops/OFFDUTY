import mongoose from 'mongoose'
const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    placement: { type: String, required: true },
    link: String,
    image: {
      url: { type: String, required: true },
      publicId: String,
    },
    status: { type: String, enum: ['Live', 'Draft'], default: 'Draft' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Banner', bannerSchema)
