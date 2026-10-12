# OFFDUTY delivery status

This is a source-code delivery, not a certified production deployment.

## Included
- Customer React/Vite storefront and existing bundled assets
- Separate React/Vite admin panel with garment fit, fabric, GSM and size-colour SKU editor
- Express/Mongoose backend with conditional per-variant stock deduction and restocking
- Original order, payment, shipping, category, collection, banner and admin modules retained
- OFFDUTY rebrand and project documentation

## Requires your environment and acceptance testing
- MongoDB connection and development seed data (seed may overwrite existing catalog data)
- Cloudinary, Razorpay test-mode and Shiprocket credentials
- Actual product/campaign photos: original image assets remain; generated concept board is a visual reference only
- Complete end-to-end browser/payment/webhook testing; production-grade transaction and webhook race-hardening are not certified
- Customer-facing API/product variants integration audit, since storefront still supports legacy mock catalog

Never use the example credentials in production. Review each integration before deploying.
