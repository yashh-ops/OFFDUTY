import asyncHandler from '../middleware/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import Update from '../models/Update.js'
// GET /api/updates
const getUpdates = asyncHandler(async (req, res) => {
  const updates = await Update.find().sort({ createdAt: -1 }).limit(50)
  res.json({ success: true, updates })
})

// POST /api/updates (admin)
const createUpdate = asyncHandler(async (req, res) => {
  const { title, tag } = req.body
  if (!title) throw new ApiError(400, 'Title is required')
  const update = await Update.create({ title, tag })
  res.status(201).json({ success: true, update })
})

// DELETE /api/updates/:id (admin)
const deleteUpdate = asyncHandler(async (req, res) => {
  const update = await Update.findByIdAndDelete(req.params.id)
  if (!update) throw new ApiError(404, 'Update not found')
  res.json({ success: true, message: 'Update deleted' })
})

export {  getUpdates, createUpdate, deleteUpdate  }
