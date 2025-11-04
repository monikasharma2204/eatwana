# Eatwana — API Documentation & System Architecture

**Version:** 1.0

**Overview**
Eatwana is a tiffin & cloud-kitchen service for students and working professionals. Features include dish/product management (veg/non-veg), tiffin plans (one-time / recurring: weekly, monthly, quarterly, half-yearly), order lifecycle and status updates by admin, multiple payment flows (screenshot upload for initial release; later Stripe/Razorpay), COD, WhatsApp chat/call requests, ratings/reviews, and admin dashboards.

This document contains:
- API endpoints (grouped by domain)
- Data models / schema suggestions
- Authentication & authorization
- Order lifecycle and state machine
- Payment flow & webhooks
- Background jobs & cron tasks
- Dev & deployment architecture
- Security, validation, rate limits, and testing notes

---

## Base info
- **Base URL**: `https://api.eatwana.com/v1`
- **Auth**: JWT Bearer tokens
- **Content-Type**: `application/json` (multipart/form-data for file upload)
- **Versioning**: path-based (`/v1/`), increment major on breaking changes
- **Pagination**: cursor or offset. Default `?page=1&limit=20`.
- **Time format**: ISO 8601 UTC in API responses.

---

# Models (MongoDB-style / Mongoose)

### User
```json
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  passwordHash: String,
  role: "user" | "admin" | "delivery",
  address: [{ label, line1, line2, city, state, pincode, lat, lng }],
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Dish / Product
```json
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,            // base price
  veg: Boolean,
  category: String,        // e.g., "Breakfast", "Main Course"
  tags: [String],
  images: [URL],
  options: [{ name, extraPrice }],
  isAvailable: Boolean,
  createdAt, updatedAt
}
```

### Menu (Daily / Weekly menu for tiffin)
```json
{
  _id,
  name: String,            // e.g., "July Week 1 - Morning Tiffin"
  type: "tiffin_menu" | "cloud_kitchen",
  dateRange: { start: Date, end: Date },
  dayWise: { Mon: [dishIds], Tue: [dishIds], ... },
  dishes: [dishIds],
  active: Boolean,
  createdBy: userId
}
```

### Tiffin Plan / Subscription
```json
{
  _id,
  userId,
  menuId,
  planType: "one_time" | "weekly" | "monthly" | "quarterly" | "half_yearly",
  startDate: Date,
  endDate: Date,
  deliveryDays: ["Mon","Tue"...],
  pricePerCycle: Number,
  totalAmount: Number,
  status: "active" | "paused" | "cancelled" | "completed",
  nextBillingDate: Date,
  createdAt, updatedAt
}
```

### Order
```json
{
  _id,
  userId,
  items: [{ dishId, qty, price, options }],
  subtotal: Number,
  discount: Number,
  tax: Number,
  deliveryCharge: Number,
  totalAmount: Number,
  payment: { method: "cod"|"manual_screenshot"|"razorpay"|"stripe", status: "pending"|"paid"|"failed", screenshotUrl },
  address: { ... },
  notes: String,
  type: "one_time" | "tiffin_subscription_order" | "cloud_kitchen",
  tiffinPlanId: ObjectId | null,
  status: "placed" | "accepted" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled" | "failed",
  assignedTo: deliveryUserId | null,
  timestamps: { placedAt, acceptedAt, preparedAt, assignedAt, deliveredAt },
  createdAt, updatedAt
}
```

### Review
```json
{ _id, userId, orderId, dishId|null, rating: 1-5, comment, createdAt }
```

### Audit / Invoice
- Keep invoice records for every payment/partial-payment with invoice number, amounts, and references.

---

# API Endpoints (grouped)

Note: All admin endpoints must be under `/admin` and protected by role-based middleware.

## Auth
- `POST /v1/auth/register` — body: `{ name, email, phone, password }` — registers user; returns token.
- `POST /v1/auth/login` — body: `{ emailOrPhone, password }` — returns JWT.
- `POST /v1/auth/refresh` — refresh token endpoint (if using refresh tokens).
- `POST /v1/auth/forgot-password` — send reset link / OTP.
- `POST /v1/auth/reset-password` — reset using token/OTP.

## Users
- `GET /v1/users/me` — get current user (auth)
- `PUT /v1/users/me` — update profile, addresses
- `POST /v1/users/:id/address` — add address
- `DELETE /v1/users/:id/address/:addrId`
- `GET /v1/users` — (admin) list users with filters

## Dishes / Products
- `GET /v1/dishes` — list dishes (`?page=&limit=&q=&veg=&category=`)
- `GET /v1/dishes/:id` — get dish
- `POST /v1/dishes` — create dish (admin) — multipart for images
- `PUT /v1/dishes/:id` — update (admin)
- `DELETE /v1/dishes/:id` — soft delete (admin)

## Menus
- `GET /v1/menus` — list menus
- `GET /v1/menus/:id`
- `POST /v1/menus` — (admin) create menu
- `PUT /v1/menus/:id` — (admin)
- `DELETE /v1/menus/:id` — (admin)

## Tiffin Plans / Subscriptions
- `POST /v1/plans` — create a subscription (user). Body includes planType, startDate, deliveryDays, menuId, payment details.
- `GET /v1/plans` — list user subscriptions (auth)
- `GET /v1/plans/:id` — detail
- `PUT /v1/plans/:id/pause` — pause subscription
- `PUT /v1/plans/:id/resume` — resume
- `PUT /v1/plans/:id/cancel` — cancel
- `POST /v1/plans/:id/advance-payment` — pay for multiple cycles (admin or user payment endpoint)

## Orders
- `POST /v1/orders` — place order (one-time or subscription order). Sample body:
```json
{
  "type":"one_time",
  "items":[{"dishId":"...","qty":2}],
  "payment": { "method":"manual_screenshot" },
  "addressId":"...",
  "notes":"No onion"
}
```
- `GET /v1/orders` — user orders list (`?status=&page=`)
- `GET /v1/orders/:id` — order detail
- `PUT /v1/orders/:id/cancel` — cancel (rules: before preparing)
- `POST /v1/orders/:id/upload-payment-screenshot` — multipart/form-data with screenshot (for manual payments)
- `PUT /v1/orders/:id/status` — (admin) update status (accept, preparing, ready, out_for_delivery, delivered)
- `PUT /v1/orders/:id/assign-delivery` — assign delivery person (admin)

## Payments
- `POST /v1/payments/manual/verify` — admin verifies screenshot and marks payment paid
- `POST /v1/payments/razorpay/create-order` — (future) create payment order (returns orderId)
- `POST /v1/payments/webhook` — payment gateway webhook endpoint (razorpay/stripe) — validate signature
- `GET /v1/invoices/:orderId` — get invoice PDF (generate on request)

## Reviews
- `POST /v1/reviews` — `{ orderId, dishId?, rating, comment }`
- `GET /v1/dishes/:id/reviews`

## Admin / Dashboard
- `GET /v1/admin/orders` — list all orders with filters (dateRange, status, assignedTo)
- `GET /v1/admin/sales-report` — returns aggregated sales (group by day/week/month)
- `GET /v1/admin/top-dishes` — analytics
- `POST /v1/admin/discounts` — create coupon/discount
- `PUT /v1/admin/settings` — configure delivery charge, tax, center working hours

## Contact / Support
- `POST /v1/support/contact` — user message, optional preferred contact method: whatsapp / call
- `POST /v1/whatsapp/send-template` — (internal) send order updates via WhatsApp Business API

## Delivery Users (role: delivery)
- `GET /v1/delivery/assigned` — get assigned orders
- `PUT /v1/delivery/:orderId/status` — update status to picked / delivered

---

# Request / Response Examples

### Create Order (one-time)
`POST /v1/orders`

Request body:
```json
{
  "type":"one_time",
  "items":[{"dishId":"64a...","qty":1}],
  "payment":{"method":"manual_screenshot"},
  "addressId":"64b...",
  "notes":"No chillies"
}
```

Success (201):
```json
{ "success": true, "orderId": "64f...", "status": "placed", "paymentStatus": "pending" }
```

### Upload screenshot
`POST /v1/orders/:id/upload-payment-screenshot`
- multipart/form-data: `file` field

Response: `200 { success: true, message: 'Uploaded' }`

---

# Order lifecycle / State Machine
1. `placed` — user placed order (payment pending/paid)
2. `accepted` — admin accepts order
3. `preparing` — kitchen prepares
4. `ready` — ready for pickup
5. `out_for_delivery` — delivery assigned and en route
6. `delivered` — delivered to user
7. `cancelled` — cancelled by user/admin (with rules & refund logic)

State transitions should be validated server-side. Keep timestamps for each transition.

---

# Payments & Webhooks (initial release)
- Manual: user uploads screenshot; admin manually verifies and marks `payment.status = paid`.
- Store screenshot URL and a `payment.verification` record with `verifiedBy`, `verifiedAt`, `notes`.
- Later: integrate Razorpay/Stripe. For these, implement `POST /v1/payments/webhook` to capture successful payments and update order/payment states.

Security for webhooks: validate HMAC signature and IP allowlist.

---

# Background Jobs / Cron Tasks
- **Billing job** (daily at 00:00): Create orders for active subscriptions for that day's delivery, or compute `nextBillingDate` and create invoices.
- **Retry job**: Handle failed payments or pending verifications (notify admin / user after 24 hours).
- **Notification job**: Send daily order reminders or upcoming subscription renewals via email/WhatsApp.
- **Cleanup job**: Remove expired temporary files and old screenshots after retention period (e.g., 90 days).

Use a job queue (BullMQ with Redis) for long-running tasks (PDF invoice generation, push notifications).

---

# Indexing & Performance (MongoDB)
- Index `orders.userId`, `orders.status`, `orders.createdAt`.
- Index `dishes.name`, `dishes.category`, `dishes.isAvailable`.
- Use TTL collections for ephemeral tokens (password reset, OTP).
- Cache frequently used menus with Redis.

---

# Security
- Store password hashes (bcrypt/scrypt/argon2).
- Rate-limit auth endpoints and file uploads.
- Validate all inputs server-side; use JSON schema or Joi/zod.
- Enforce role-based access control for admin endpoints.
- Secure file uploads (scan for malware, size limit, type whitelist).
- HTTPS required; secure cookies if using refresh tokens.

---

# Error handling & status codes
- Use consistent error format:
```json
{ "success": false, "error": { "code": "INVALID_INPUT", "message": "Dish id missing" }}
```
- Common codes: `400`, `401`, `403`, `404`, `409` (conflict), `422` (validation), `500`.

---

# Notifications & Communications
- Use WhatsApp Business API (templates) for order updates and OTPs.
- Fallback to SMS/Email for critical alerts.
- Provide in-app push notifications for web (service workers) and mobile (if built later).

---

# Admin Panel UX considerations
- Orders table with filters (date range, status, paymentStatus, delivery person).
- Quick actions: accept, cancel, assign delivery, view invoice, verify payment.
- Menu builder UI: drag & drop dishes into day-wise menus.
- Reports: revenue by period, top dishes, active subscriptions.

---

# Deployment & Infra (suggested)
- **Frontend**: React + Tailwind (Vercel / Netlify / static hosting)
- **Backend**: Node.js (Express / NestJS) on AWS ECS / Heroku / DigitalOcean app platform
- **DB**: MongoDB Atlas
- **Cache / Queue**: Redis (for session cache, BullMQ)
- **Object Storage**: S3 or S3-compatible for images and screenshots
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Prometheus/Grafana
- **Backups**: Daily DB backups, snapshot retention policy

Architecture diagram (textual):
- Client (React) -> API Gateway / Load Balancer -> NodeJS App -> MongoDB Atlas
- Background workers (Node/BullMQ) -> Redis -> S3 for generated assets
- Payment gateway webhooks -> API -> verify -> update DB

---

# Env variables (example)
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DB_URI`
- `REDIS_URL`
- `S3_BUCKET` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
- `WHATSAPP_API_KEY`
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
- `STRIPE_SECRET`

---

# Testing & QA
- Unit tests for services (Jest)
- Integration tests for endpoints (supertest)
- E2E tests for main flows (Cypress)
- Load test order endpoints (k6) before launch to tune concurrency

---

# Misc considerations & edge cases
- Partial payments: store installment records and attach invoices.
- Discounts & coupons: apply validations (expiry, usage limit per user), store coupon usage.
- Subscription pause/resume: keep billing logic idempotent.
- Refunds: define policies, store refund records, and integrate with payment provider.
- Multiple addresses per user; allow different delivery charges per zone.
- Menu changes while subscription active: decide whether to use snapshot of menu at time of plan creation or dynamic current menu.

---

# Sample Postman collection (suggested)
Create a collection with: Auth flows, CRUD for dishes, create menu, create plan, place order, upload screenshot, admin change status, payment verify, webhooks.

---

# Roadmap (future)
1. Integrate Razorpay/Stripe for automated payments + auto-charge subscriptions
2. Recurring billing & invoices
3. Mobile app (React Native)
4. Real-time order tracking for delivery
5. Multi-kitchen / multi-center support
6. Advanced analytics & promotions engine

---

If you'd like, I can:
- generate OpenAPI 3.0 (Swagger) spec for these endpoints,
- produce a Postman collection / Insomnia export,
- scaffold the backend folder structure (Express + Mongoose) with sample controllers,
- or provide a sample DB seed script with sample dishes/menus.

Tell me which of the above you'd like next and I will scaffold it.

