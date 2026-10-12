# OFFDUTY — Made for Your Own Lane

Converted from the supplied UnboxStore MERN project. The original three-app architecture and existing business logic are retained.

## Applications
- `frontend`: React/Vite storefront
- `admin`: separate React/Vite management application
- `backend`: Express/Mongoose REST API

## Setup
1. Install Node.js and start a MongoDB instance or configure MongoDB Atlas.
2. In `backend`, copy `.env.example` to `.env` and set secrets and integration keys. Never commit `.env`.
3. Run `npm install` in each of `backend`, `frontend`, and `admin`.
4. Set the frontend and admin API URLs to your backend address, and configure backend CORS origins.
5. Run `npm run dev` in each application in separate terminals.
6. Configure Cloudinary, Razorpay and Shiprocket before using live uploads, payments or shipping.

## Conversion status
OFFDUTY rebranding, storefront campaign hero, clothing metadata schema, gender/fit query filtering, and removal of customer-facing add-product route are implemented. Existing backend/admin operations are preserved, but live external integrations and the new variant-level checkout workflow are NOT verified. The variant schema is additive only; legacy `stockCount` remains authoritative until cart/order/inventory migration is implemented. Existing images are bundled from the source project and should be replaced with licensed OFFDUTY campaign photography before public launch.

**Do not run the legacy seed script against a database with data you need.** It deletes existing sample collections.
