import { Router } from 'express'
import mongoose from 'mongoose'
import { protect, authorize } from '../middleware/auth.js'
import asyncHandler from '../middleware/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import User from '../models/User.js'
import Product from '../models/Product.js'
const router = Router()
router.use(protect, authorize('customer'))
router.get('/', asyncHandler(async (req,res) => {
 const user = await User.findById(req.user._id).populate('wishlist')
 res.json({success:true,products:user.wishlist.filter(Boolean)})
}))
router.put('/:productId', asyncHandler(async (req,res) => {
 const id=req.params.productId
 if (!mongoose.isValidObjectId(id)) throw new ApiError(400,'Invalid product')
 if (!await Product.exists({_id:id})) throw new ApiError(404,'Product not found')
 await User.updateOne({_id:req.user._id},{$addToSet:{wishlist:id}})
 res.json({success:true})
}))
router.delete('/:productId', asyncHandler(async (req,res) => {
 if (!mongoose.isValidObjectId(req.params.productId)) throw new ApiError(400,'Invalid product')
 await User.updateOne({_id:req.user._id},{$pull:{wishlist:req.params.productId}})
 res.json({success:true})
}))
export default router
