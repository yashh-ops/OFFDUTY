import mongoose from 'mongoose'
const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    status: { type: String, enum: ['Active', 'Upcoming', 'Hidden'], default: 'Active' },
    launchDate: Date,
    image: {
      url: String,
      publicId: String,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Collection', collectionSchema)
