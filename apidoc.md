# Eatwana - Tiffin Service API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Payment Flow](#payment-flow)

---

## Overview

**Eatwana** is a tiffin and cloud kitchen service platform that connects students and working professionals with home-cooked meals and restaurant-style dishes delivered to their doorstep.

### Key Features
- **Tiffin Service**: Subscribe to daily/weekly/monthly meal plans
- **Cloud Kitchen**: Order individual dishes (veg & non-veg)
- **Multiple Payment Options**: Online payment with screenshot upload, COD, WhatsApp, Call request
- **Order Management**: Real-time order tracking and status updates
- **Rating System**: Customer feedback and reviews
- **Admin Dashboard**: Complete control over menu, dishes, and orders

### Base URL
```
Production: https://api.eatwana.com/v1
Development: http://localhost:3000/api/v1
```

---

## Architecture

### System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │────────▶│   API       │────────▶│  Database   │
│ (Web/Mobile)│         │  Gateway    │         │  (MongoDB)  │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Microservices     │
                    ├─────────────────────┤
                    │ • Auth Service      │
                    │ • User Service      │
                    │ • Product Service   │
                    │ • Order Service     │
                    │ • Payment Service   │
                    │ • Notification      │
                    │ • Rating Service    │
                    └─────────────────────┘
```

### Technology Stack Recommendations

**Backend:**
- Node.js + Express.js / NestJS
- MongoDB (NoSQL) or PostgreSQL (SQL)
- Redis (Caching & Sessions)
- JWT for Authentication

**Frontend:**
- React.js / Next.js (Web)
- React Native / Flutter (Mobile)

**File Storage:**
- AWS S3 / Cloudinary (Images & Payment Screenshots)

**Notifications:**
- Firebase Cloud Messaging
- Twilio (WhatsApp & SMS)
- NodeMailer (Email)

---

## Authentication

### JWT Token Based Authentication

All authenticated requests must include the JWT token in the header:

```
Authorization: Bearer <token>
```

### User Roles
- `ADMIN`: Full system access
- `CUSTOMER`: Can browse, order, and rate
- `DELIVERY`: Can view and update delivery status (future scope)

---

## API Endpoints

### 1. Authentication APIs

#### 1.1 Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "SecurePass123!",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "landmark": "Near City Mall"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1.2 Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1.3 Verify Token
```http
GET /auth/verify
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "role": "CUSTOMER"
    }
  }
}
```

#### 1.4 Logout
```http
POST /auth/logout
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 1.5 Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### 1.6 Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_123",
  "newPassword": "NewSecurePass123!"
}
```

---

### 2. User Management APIs

#### 2.1 Get User Profile
```http
GET /users/profile
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

#### 2.2 Update User Profile
```http
PUT /users/profile
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+919876543211",
  "address": {
    "street": "456 New St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400002"
  }
}
```

#### 2.3 Get User Addresses
```http
GET /users/addresses
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "addr_1",
      "label": "Home",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "isDefault": true
    },
    {
      "id": "addr_2",
      "label": "Office",
      "street": "789 Work Plaza",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400003",
      "isDefault": false
    }
  ]
}
```

#### 2.4 Add New Address
```http
POST /users/addresses
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "label": "Office",
  "street": "789 Work Plaza",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400003",
  "landmark": "Near Metro Station",
  "isDefault": false
}
```

#### 2.5 Update Address
```http
PUT /users/addresses/:addressId
```

#### 2.6 Delete Address
```http
DELETE /users/addresses/:addressId
```

---

### 3. Dish/Product Management APIs

#### 3.1 Get All Dishes
```http
GET /dishes?category=veg&type=cloud-kitchen&page=1&limit=20
```

**Query Parameters:**
- `category`: veg | non-veg | all (default: all)
- `type`: cloud-kitchen | tiffin | all (default: all)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search by name

**Response (200):**
```json
{
  "success": true,
  "data": {
    "dishes": [
      {
        "id": "dish_1",
        "name": "Paneer Butter Masala",
        "description": "Rich and creamy paneer curry",
        "category": "veg",
        "type": "cloud-kitchen",
        "price": 180,
        "image": "https://cdn.eatwana.com/dishes/paneer-butter-masala.jpg",
        "isAvailable": true,
        "preparationTime": 20,
        "rating": 4.5,
        "totalRatings": 234
      },
      {
        "id": "dish_2",
        "name": "Chicken Biryani",
        "description": "Aromatic basmati rice with tender chicken",
        "category": "non-veg",
        "type": "cloud-kitchen",
        "price": 250,
        "image": "https://cdn.eatwana.com/dishes/chicken-biryani.jpg",
        "isAvailable": true,
        "preparationTime": 30,
        "rating": 4.8,
        "totalRatings": 567
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 95,
      "itemsPerPage": 20
    }
  }
}
```

#### 3.2 Get Dish by ID
```http
GET /dishes/:dishId
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "dish_1",
    "name": "Paneer Butter Masala",
    "description": "Rich and creamy paneer curry made with fresh ingredients",
    "category": "veg",
    "type": "cloud-kitchen",
    "price": 180,
    "images": [
      "https://cdn.eatwana.com/dishes/paneer-1.jpg",
      "https://cdn.eatwana.com/dishes/paneer-2.jpg"
    ],
    "isAvailable": true,
    "preparationTime": 20,
    "ingredients": ["Paneer", "Tomatoes", "Cream", "Butter", "Spices"],
    "nutritionInfo": {
      "calories": 350,
      "protein": "12g",
      "carbs": "25g",
      "fat": "22g"
    },
    "rating": 4.5,
    "totalRatings": 234,
    "reviews": [
      {
        "userId": "user_456",
        "userName": "Jane Smith",
        "rating": 5,
        "comment": "Delicious! Best paneer I've had.",
        "createdAt": "2025-10-28T15:30:00Z"
      }
    ]
  }
}
```

#### 3.3 Create Dish (Admin Only)
```http
POST /admin/dishes
Headers: Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: Paneer Butter Masala
description: Rich and creamy paneer curry
category: veg
type: cloud-kitchen
price: 180
preparationTime: 20
ingredients: ["Paneer", "Tomatoes", "Cream"]
image: <file>
```

**Response (201):**
```json
{
  "success": true,
  "message": "Dish created successfully",
  "data": {
    "id": "dish_1",
    "name": "Paneer Butter Masala",
    "category": "veg",
    "price": 180
  }
}
```

#### 3.4 Update Dish (Admin Only)
```http
PUT /admin/dishes/:dishId
Headers: Authorization: Bearer <admin_token>
```

#### 3.5 Delete Dish (Admin Only)
```http
DELETE /admin/dishes/:dishId
Headers: Authorization: Bearer <admin_token>
```

#### 3.6 Toggle Dish Availability (Admin Only)
```http
PATCH /admin/dishes/:dishId/availability
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "isAvailable": false
}
```

---

### 4. Tiffin Menu Management APIs

#### 4.1 Get Tiffin Plans
```http
GET /tiffin/plans
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "plan_1",
      "name": "Standard Veg Tiffin",
      "category": "veg",
      "description": "Healthy home-cooked vegetarian meals",
      "pricing": {
        "oneTime": 120,
        "weekly": 800,
        "monthly": 3200,
        "quarterly": 9000,
        "halfYearly": 17000
      },
      "includes": ["2 Rotis", "1 Sabji", "Dal", "Rice", "Salad"],
      "image": "https://cdn.eatwana.com/tiffin/veg-standard.jpg",
      "isAvailable": true
    },
    {
      "id": "plan_2",
      "name": "Premium Non-Veg Tiffin",
      "category": "non-veg",
      "description": "Delicious non-veg meals with variety",
      "pricing": {
        "oneTime": 180,
        "weekly": 1200,
        "monthly": 4800,
        "quarterly": 13500,
        "halfYearly": 25000
      },
      "includes": ["3 Rotis", "Chicken/Fish", "Dal", "Rice", "Salad"],
      "image": "https://cdn.eatwana.com/tiffin/nonveg-premium.jpg",
      "isAvailable": true
    }
  ]
}
```

#### 4.2 Get Daily Tiffin Menu
```http
GET /tiffin/menu?date=2025-11-05&planId=plan_1
```

**Query Parameters:**
- `date`: Date in YYYY-MM-DD format (default: today)
- `planId`: Tiffin plan ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "date": "2025-11-05",
    "day": "Wednesday",
    "planId": "plan_1",
    "planName": "Standard Veg Tiffin",
    "menu": {
      "mainCourse": "Aloo Gobi",
      "dal": "Moong Dal Tadka",
      "rice": "Steamed Rice",
      "bread": "Roti (2 pcs)",
      "extras": ["Salad", "Pickle", "Papad"]
    },
    "nutritionInfo": {
      "totalCalories": 550,
      "protein": "18g",
      "carbs": "85g",
      "fat": "15g"
    }
  }
}
```

#### 4.3 Get Weekly Menu
```http
GET /tiffin/menu/weekly?planId=plan_1&startDate=2025-11-04
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "planId": "plan_1",
    "planName": "Standard Veg Tiffin",
    "weeklyMenu": [
      {
        "date": "2025-11-04",
        "day": "Monday",
        "menu": {
          "mainCourse": "Paneer Masala",
          "dal": "Dal Fry",
          "rice": "Jeera Rice",
          "bread": "Roti (2 pcs)"
        }
      },
      {
        "date": "2025-11-05",
        "day": "Tuesday",
        "menu": {
          "mainCourse": "Aloo Gobi",
          "dal": "Moong Dal",
          "rice": "Steamed Rice",
          "bread": "Roti (2 pcs)"
        }
      }
    ]
  }
}
```

#### 4.4 Create Tiffin Plan (Admin Only)
```http
POST /admin/tiffin/plans
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Standard Veg Tiffin",
  "category": "veg",
  "description": "Healthy home-cooked vegetarian meals",
  "pricing": {
    "oneTime": 120,
    "weekly": 800,
    "monthly": 3200,
    "quarterly": 9000,
    "halfYearly": 17000
  },
  "includes": ["2 Rotis", "1 Sabji", "Dal", "Rice", "Salad"]
}
```

#### 4.5 Update Daily Menu (Admin Only)
```http
POST /admin/tiffin/menu/daily
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "date": "2025-11-05",
  "planId": "plan_1",
  "menu": {
    "mainCourse": "Aloo Gobi",
    "dal": "Moong Dal Tadka",
    "rice": "Steamed Rice",
    "bread": "Roti (2 pcs)",
    "extras": ["Salad", "Pickle"]
  }
}
```

#### 4.6 Bulk Upload Weekly Menu (Admin Only)
```http
POST /admin/tiffin/menu/weekly
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "planId": "plan_1",
  "startDate": "2025-11-04",
  "menus": [
    {
      "day": "Monday",
      "menu": {
        "mainCourse": "Paneer Masala",
        "dal": "Dal Fry"
      }
    }
  ]
}
```

---

### 5. Order Management APIs

#### 5.1 Create Order
```http
POST /orders
Headers: Authorization: Bearer <token>
```

**Request Body (Cloud Kitchen Order):**
```json
{
  "orderType": "cloud-kitchen",
  "items": [
    {
      "dishId": "dish_1",
      "quantity": 2,
      "price": 180
    },
    {
      "dishId": "dish_3",
      "quantity": 1,
      "price": 250
    }
  ],
  "deliveryAddress": {
    "addressId": "addr_1"
  },
  "paymentMethod": "COD",
  "specialInstructions": "Less spicy please",
  "deliveryTime": "ASAP"
}
```

**Request Body (Tiffin Subscription):**
```json
{
  "orderType": "tiffin",
  "planId": "plan_1",
  "subscriptionType": "monthly",
  "startDate": "2025-11-06",
  "deliveryTime": "13:00",
  "deliveryAddress": {
    "addressId": "addr_1"
  },
  "paymentMethod": "online",
  "paymentScreenshot": "<base64_image_or_url>"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "order_12345",
    "orderType": "cloud-kitchen",
    "status": "pending",
    "totalAmount": 610,
    "estimatedDelivery": "45 mins",
    "paymentMethod": "COD",
    "createdAt": "2025-11-04T14:30:00Z"
  }
}
```

#### 5.2 Get User Orders
```http
GET /orders?status=active&page=1&limit=10
Headers: Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: pending | confirmed | preparing | out-for-delivery | delivered | cancelled | all
- `orderType`: cloud-kitchen | tiffin | all
- `page`: Page number
- `limit`: Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": "order_12345",
        "orderType": "cloud-kitchen",
        "status": "preparing",
        "items": [
          {
            "dishId": "dish_1",
            "dishName": "Paneer Butter Masala",
            "quantity": 2,
            "price": 180
          }
        ],
        "totalAmount": 610,
        "paymentMethod": "COD",
        "deliveryAddress": {
          "street": "123 Main St",
          "city": "Mumbai",
          "pincode": "400001"
        },
        "estimatedDelivery": "30 mins",
        "createdAt": "2025-11-04T14:30:00Z",
        "updatedAt": "2025-11-04T14:45:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

#### 5.3 Get Order by ID
```http
GET /orders/:orderId
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_12345",
    "orderType": "cloud-kitchen",
    "status": "out-for-delivery",
    "items": [
      {
        "dishId": "dish_1",
        "dishName": "Paneer Butter Masala",
        "quantity": 2,
        "price": 180,
        "image": "https://cdn.eatwana.com/dishes/paneer.jpg"
      }
    ],
    "pricing": {
      "subtotal": 610,
      "deliveryCharges": 40,
      "taxes": 32.5,
      "discount": 50,
      "total": 632.5
    },
    "paymentMethod": "COD",
    "paymentStatus": "pending",
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "phone": "+919876543210"
    },
    "specialInstructions": "Less spicy please",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2025-11-04T14:30:00Z"
      },
      {
        "status": "confirmed",
        "timestamp": "2025-11-04T14:32:00Z"
      },
      {
        "status": "preparing",
        "timestamp": "2025-11-04T14:35:00Z"
      },
      {
        "status": "out-for-delivery",
        "timestamp": "2025-11-04T15:05:00Z"
      }
    ],
    "estimatedDelivery": "15 mins",
    "createdAt": "2025-11-04T14:30:00Z"
  }
}
```

#### 5.4 Cancel Order
```http
POST /orders/:orderId/cancel
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "orderId": "order_12345",
    "status": "cancelled",
    "refundAmount": 632.5,
    "refundStatus": "initiated"
  }
}
```

#### 5.5 Get All Orders (Admin Only)
```http
GET /admin/orders?status=pending&page=1&limit=20
Headers: Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `status`: Order status filter
- `orderType`: Order type filter
- `date`: Filter by date (YYYY-MM-DD)
- `page`, `limit`: Pagination

#### 5.6 Update Order Status (Admin Only)
```http
PATCH /admin/orders/:orderId/status
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "preparing",
  "note": "Order is being prepared"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "orderId": "order_12345",
    "status": "preparing",
    "updatedAt": "2025-11-04T14:45:00Z"
  }
}
```

#### 5.7 Pause/Resume Tiffin Subscription
```http
PATCH /orders/tiffin/:orderId/subscription
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "action": "pause",
  "pauseFrom": "2025-11-10",
  "pauseTo": "2025-11-15",
  "reason": "Going out of town"
}
```

---

### 6. Payment APIs

#### 6.1 Upload Payment Screenshot
```http
POST /payments/screenshot
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
orderId: order_12345
screenshot: <file>
transactionId: TXN123456789
paymentMethod: UPI
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment screenshot uploaded successfully",
  "data": {
    "paymentId": "payment_789",
    "orderId": "order_12345",
    "screenshotUrl": "https://cdn.eatwana.com/payments/screenshot_789.jpg",
    "status": "pending_verification",
    "uploadedAt": "2025-11-04T14:35:00Z"
  }
}
```

#### 6.2 Verify Payment (Admin Only)
```http
PATCH /admin/payments/:paymentId/verify
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "verified",
  "note": "Payment verified successfully"
}
```

#### 6.3 Get Payment Status
```http
GET /payments/:orderId/status
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_12345",
    "paymentMethod": "online",
    "paymentStatus": "verified",
    "amount": 632.5,
    "transactionId": "TXN123456789",
    "screenshotUrl": "https://cdn.eatwana.com/payments/screenshot_789.jpg",
    "verifiedAt": "2025-11-04T14:40:00Z"
  }
}
```

#### 6.4 Create Online Payment Intent (Future)
```http
POST /payments/create-intent
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "order_12345",
  "amount": 632.5,
  "currency": "INR",
  "paymentGateway": "razorpay"
}
```

---

### 7. Rating & Review APIs

#### 7.1 Add Rating
```http
POST /ratings
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "order_12345",
  "dishId": "dish_1",
  "rating": 5,
  "comment": "Absolutely delicious! Will order again.",
  "images": ["<base64_image>"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Rating submitted successfully",
  "data": {
    "ratingId": "rating_456",
    "dishId": "dish_1",
    "rating": 5,
    "comment": "Absolutely delicious! Will order again.",
    "createdAt": "2025-11-04T16:00:00Z"
  }
}
```

#### 7.2 Get Dish Ratings
```http
GET /ratings/dish/:dishId?page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "dishId": "dish_1",
    "averageRating": 4.5,
    "totalRatings": 234,
    "ratingDistribution": {
      "5": 150,
      "4": 60,
      "3": 20,
      "2": 3,
      "1": 1
    },
    "reviews": [
      {
        "ratingId": "rating_456",
        "userId": "user_123",
        "userName": "John Doe",
        "rating": 5,
        "comment": "Absolutely delicious!",
        "images": ["https://cdn.eatwana.com/reviews/img1.jpg"],
        "createdAt": "2025-11-04T16:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 24,
      "totalItems": 234
    }
  }
}
```

#### 7.3 Update Rating
```http
PUT /ratings/:ratingId
Headers: Authorization: Bearer <token>
```

#### 7.4 Delete Rating
```http
DELETE /ratings/:ratingId
Headers: Authorization: Bearer <token>
```

---

### 8. Communication APIs

#### 8.1 Request WhatsApp Chat
```http
POST /communication/whatsapp-request
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "phone": "+919876543210",
  "message": "I want to inquire about tiffin plans",
  "orderId": "order_12345"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "WhatsApp request sent successfully",
  "data": {
    "whatsappLink": "https://wa.me/919999999999?text=Hello%20I%20need%20help",
    "requestId": "req_789"
  }
}
```

#### 8.2 Request Callback
```http
POST /communication/callback-request
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "phone": "+919876543210",
  "preferredTime": "2025-11-04T18:00:00Z",
  "reason": "Want to discuss monthly tiffin plan",
  "orderId": "order_12345"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Callback request submitted successfully",
  "data": {
    "requestId": "callback_123",
    "status": "pending",
    "preferredTime": "2025-11-04T18:00:00Z",
    "createdAt": "2025-11-04T14:30:00Z"
  }
}
```

#### 8.3 Get Communication Requests (Admin Only)
```http
GET /admin/communication/requests?status=pending&type=callback
Headers: Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "requestId": "callback_123",
        "type": "callback",
        "userId": "user_123",
        "userName": "John Doe",
        "phone": "+919876543210",
        "preferredTime": "2025-11-04T18:00:00Z",
        "reason": "Want to discuss monthly tiffin plan",
        "status": "pending",
        "createdAt": "2025-11-04T14:30:00Z"
      }
    ]
  }
}
```

#### 8.4 Update Communication Request Status (Admin Only)
```http
PATCH /admin/communication/requests/:requestId
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "completed",
  "note": "Called and explained all plans"
}
```

---

### 9. Notification APIs

#### 9.1 Get User Notifications
```http
GET /notifications?unreadOnly=true&page=1&limit=20
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_1",
        "type": "order_status",
        "title": "Order Out for Delivery",
        "message": "Your order #12345 is out for delivery",
        "data": {
          "orderId": "order_12345",
          "status": "out-for-delivery"
        },
        "isRead": false,
        "createdAt": "2025-11-04T15:05:00Z"
      },
      {
        "id": "notif_2",
        "type": "promotional",
        "title": "Special Offer!",
        "message": "Get 20% off on your first tiffin subscription",
        "data": {
          "offerCode": "FIRST20"
        },
        "isRead": false,
        "createdAt": "2025-11-04T10:00:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 25
    }
  }
}
```

#### 9.2 Mark Notification as Read
```http
PATCH /notifications/:notificationId/read
Headers: Authorization: Bearer <token>
```

#### 9.3 Mark All as Read
```http
PATCH /notifications/read-all
Headers: Authorization: Bearer <token>
```

#### 9.4 Delete Notification
```http
DELETE /notifications/:notificationId
Headers: Authorization: Bearer <token>
```

#### 9.5 Send Notification (Admin Only)
```http
POST /admin/notifications/send
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "type": "promotional",
  "title": "Weekend Special",
  "message": "Flat 30% off on all cloud kitchen orders this weekend!",
  "targetAudience": "all",
  "data": {
    "offerCode": "WEEKEND30"
  },
  "scheduledFor": "2025-11-08T09:00:00Z"
}
```

---

### 10. Analytics & Reports APIs (Admin Only)

#### 10.1 Get Dashboard Stats
```http
GET /admin/analytics/dashboard
Headers: Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "today": {
      "totalOrders": 45,
      "revenue": 18500,
      "newCustomers": 8,
      "activeSubscriptions": 120
    },
    "thisWeek": {
      "totalOrders": 312,
      "revenue": 125400,
      "newCustomers": 42,
      "cancelledOrders": 5
    },
    "thisMonth": {
      "totalOrders": 1250,
      "revenue": 485000,
      "newCustomers": 165,
      "activeSubscriptions": 340
    },
    "topSellingDishes": [
      {
        "dishId": "dish_2",
        "dishName": "Chicken Biryani",
        "orderCount": 234,
        "revenue": 58500
      }
    ]
  }
}
```

#### 10.2 Get Sales Report
```http
GET /admin/analytics/sales?startDate=2025-10-01&endDate=2025-10-31&groupBy=day
Headers: Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2025-10-01",
      "endDate": "2025-10-31"
    },
    "summary": {
      "totalOrders": 1250,
      "totalRevenue": 485000,
      "averageOrderValue": 388,
      "totalCustomers": 456
    },
    "breakdown": [
      {
        "date": "2025-10-01",
        "orders": 42,
        "revenue": 16500
      },
      {
        "date": "2025-10-02",
        "orders": 38,
        "revenue": 14200
      }
    ]
  }
}
```

#### 10.3 Get Order Reports
```http
GET /admin/analytics/orders?status=delivered&startDate=2025-10-01&endDate=2025-10-31
Headers: Authorization: Bearer <admin_token>
```

#### 10.4 Get Customer Analytics
```http
GET /admin/analytics/customers
Headers: Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 1250,
    "activeCustomers": 856,
    "newCustomersThisMonth": 165,
    "customerRetentionRate": 78.5,
    "topCustomers": [
      {
        "userId": "user_456",
        "userName": "Jane Smith",
        "totalOrders": 45,
        "totalSpent": 18900,
        "lastOrderDate": "2025-11-03"
      }
    ]
  }
}
```

#### 10.5 Get Revenue Analytics
```http
GET /admin/analytics/revenue?period=monthly&year=2025
Headers: Authorization: Bearer <admin_token>
```

---

### 11. Settings & Configuration APIs

#### 11.1 Get App Settings (Admin Only)
```http
GET /admin/settings
Headers: Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "general": {
      "appName": "Eatwana",
      "supportEmail": "support@eatwana.com",
      "supportPhone": "+919999999999",
      "whatsappNumber": "+919999999999"
    },
    "delivery": {
      "baseDeliveryCharge": 40,
      "freeDeliveryAbove": 500,
      "maxDeliveryRadius": 10,
      "estimatedDeliveryTime": 45
    },
    "payment": {
      "codEnabled": true,
      "onlinePaymentEnabled": true,
      "minOrderAmount": 100,
      "taxPercentage": 5
    },
    "tiffin": {
      "allowPauseSubscription": true,
      "minPauseDays": 3,
      "maxPauseDays": 30,
      "advanceOrderDays": 1
    }
  }
}
```

#### 11.2 Update Settings (Admin Only)
```http
PUT /admin/settings
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "delivery": {
    "baseDeliveryCharge": 50,
    "freeDeliveryAbove": 600
  },
  "payment": {
    "taxPercentage": 5.5
  }
}
```

#### 11.3 Get Delivery Areas (Admin Only)
```http
GET /admin/delivery-areas
Headers: Authorization: Bearer <admin_token>
```

#### 11.4 Add Delivery Area (Admin Only)
```http
POST /admin/delivery-areas
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "city": "Mumbai",
  "areas": [
    {
      "name": "Andheri West",
      "pincode": "400053",
      "deliveryCharge": 40,
      "isActive": true
    }
  ]
}
```

---

### 12. Coupon & Offers APIs

#### 12.1 Get Available Coupons
```http
GET /coupons?applicable=true
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "coupon_1",
      "code": "FIRST20",
      "title": "First Order Discount",
      "description": "Get 20% off on your first order",
      "discountType": "percentage",
      "discountValue": 20,
      "minOrderAmount": 300,
      "maxDiscount": 100,
      "validFrom": "2025-11-01T00:00:00Z",
      "validTill": "2025-12-31T23:59:59Z",
      "applicableOn": ["cloud-kitchen", "tiffin"],
      "usageLimit": 1,
      "isActive": true
    }
  ]
}
```

#### 12.2 Validate Coupon
```http
POST /coupons/validate
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "code": "FIRST20",
  "orderAmount": 500,
  "orderType": "cloud-kitchen"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "discountAmount": 100,
    "finalAmount": 400,
    "message": "Coupon applied successfully"
  }
}
```

#### 12.3 Create Coupon (Admin Only)
```http
POST /admin/coupons
Headers: Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "code": "WEEKEND30",
  "title": "Weekend Special",
  "description": "Get 30% off on weekend orders",
  "discountType": "percentage",
  "discountValue": 30,
  "minOrderAmount": 400,
  "maxDiscount": 150,
  "validFrom": "2025-11-08T00:00:00Z",
  "validTill": "2025-11-10T23:59:59Z",
  "applicableOn": ["cloud-kitchen"],
  "usageLimitPerUser": 2,
  "totalUsageLimit": 100,
  "isActive": true
}
```

---

## Data Models

### User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // hashed
  role: 'ADMIN' | 'CUSTOMER' | 'DELIVERY';
  addresses: Address[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Address {
  id: string;
  label: string; // Home, Office, etc.
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}
```

### Dish Model
```typescript
interface Dish {
  id: string;
  name: string;
  description: string;
  category: 'veg' | 'non-veg';
  type: 'cloud-kitchen' | 'tiffin';
  price: number;
  images: string[];
  ingredients: string[];
  nutritionInfo?: NutritionInfo;
  preparationTime: number; // in minutes
  isAvailable: boolean;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}
```

### Tiffin Plan Model
```typescript
interface TiffinPlan {
  id: string;
  name: string;
  category: 'veg' | 'non-veg';
  description: string;
  pricing: {
    oneTime: number;
    weekly: number;
    monthly: number;
    quarterly: number;
    halfYearly: number;
  };
  includes: string[];
  image: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DailyMenu {
  id: string;
  date: Date;
  day: string;
  planId: string;
  menu: {
    mainCourse: string;
    dal: string;
    rice: string;
    bread: string;
    extras: string[];
  };
  nutritionInfo?: NutritionInfo;
}
```

### Order Model
```typescript
interface Order {
  id: string;
  userId: string;
  orderType: 'cloud-kitchen' | 'tiffin';
  
  // For cloud kitchen orders
  items?: OrderItem[];
  
  // For tiffin orders
  planId?: string;
  subscriptionType?: 'oneTime' | 'weekly' | 'monthly' | 'quarterly' | 'halfYearly';
  startDate?: Date;
  endDate?: Date;
  deliveryTime?: string;
  
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  
  pricing: {
    subtotal: number;
    deliveryCharges: number;
    taxes: number;
    discount: number;
    total: number;
  };
  
  paymentMethod: 'COD' | 'online' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  
  deliveryAddress: Address;
  specialInstructions?: string;
  
  statusHistory: StatusHistory[];
  
  // For subscriptions
  isPaused?: boolean;
  pauseFrom?: Date;
  pauseTo?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  dishId: string;
  dishName: string;
  quantity: number;
  price: number;
  image: string;
}

interface StatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
}
```

### Payment Model
```typescript
interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  method: 'COD' | 'online' | 'wallet';
  status: 'pending' | 'verified' | 'failed' | 'refunded';
  transactionId?: string;
  screenshotUrl?: string;
  gatewayResponse?: any;
  verifiedBy?: string;
  verifiedAt?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Rating Model
```typescript
interface Rating {
  id: string;
  userId: string;
  orderId: string;
  dishId?: string;
  planId?: string;
  rating: number; // 1-5
  comment?: string;
  images?: string[];
  response?: {
    text: string;
    respondedBy: string;
    respondedAt: Date;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### HTTP Status Codes
- `200 OK`: Successful GET, PUT, PATCH requests
- `201 Created`: Successful POST requests
- `204 No Content`: Successful DELETE requests
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource or business logic conflict
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side errors

### Common Error Codes
```typescript
enum ErrorCodes {
  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Resources
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  
  // Business Logic
  DISH_NOT_AVAILABLE = 'DISH_NOT_AVAILABLE',
  OUT_OF_DELIVERY_AREA = 'OUT_OF_DELIVERY_AREA',
  ORDER_CANNOT_BE_CANCELLED = 'ORDER_CANNOT_BE_CANCELLED',
  INVALID_COUPON = 'INVALID_COUPON',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  
  // Server
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}
```

### Example Error Responses

**Validation Error (422):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "phone": "Phone number must be 10 digits"
      }
    }
  }
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication token is missing or invalid"
  }
}
```

**Resource Not Found (404):**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Dish with ID 'dish_999' not found"
  }
}
```

---

## Payment Flow

### Initial Version (Screenshot Upload)

```
1. User creates order → Order status: 'pending'
2. User selects payment method: 'online'
3. User makes payment via UPI/Bank Transfer
4. User uploads payment screenshot → Payment status: 'pending_verification'
5. Admin verifies screenshot → Payment status: 'verified'
6. Order status updated → 'confirmed'
7. Order preparation begins
```

### Future Version (Razorpay/Stripe Integration)

```
1. User creates order → Order status: 'pending'
2. Backend creates payment intent with Razorpay/Stripe
3. User completes payment on gateway
4. Webhook receives payment confirmation
5. Payment status: 'paid', Order status: 'confirmed'
6. Order preparation begins
```

### COD Flow

```
1. User creates order with COD
2. Order status: 'confirmed' immediately
3. Payment collected on delivery
4. Delivery person updates payment status: 'paid'
```

---

## Webhooks (Future Implementation)

### Payment Gateway Webhook
```http
POST /webhooks/payment
```

**Request Body (Razorpay):**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_123456",
        "amount": 63250,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_12345"
      }
    }
  }
}
```

---

## Rate Limiting

- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 500 requests per 15 minutes per user
- **Admin endpoints**: 1000 requests per 15 minutes

**Rate Limit Headers:**
```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 485
X-RateLimit-Reset: 1699012800
```

---

## Pagination

All list endpoints support pagination using query parameters:

```
?page=1&limit=20
```

**Response includes pagination metadata:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 195,
    "itemsPerPage": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## File Upload Specifications

### Supported Formats
- **Images**: JPG, JPEG, PNG, WebP
- **Max Size**: 5MB per file
- **Dimensions**: Min 400x400px, Max 2000x2000px

### Image Storage
- Use CDN for faster delivery
- Generate thumbnails automatically
- Store original and compressed versions

---

## Security Best Practices

1. **Authentication**: Use JWT with short expiration (15 mins) and refresh tokens
2. **Password**: Minimum 8 characters, hash with bcrypt (salt rounds: 10)
3. **API Keys**: Never expose in client code
4. **HTTPS**: Enforce SSL/TLS in production
5. **CORS**: Whitelist allowed origins
6. **Input Validation**: Sanitize all user inputs
7. **SQL Injection**: Use parameterized queries
8. **Rate Limiting**: Prevent abuse
9. **File Upload**: Validate file types and sizes
10. **Logging**: Log sensitive operations, exclude passwords

---

## Environment Variables

```env
# Server
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/eatwana
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# File Storage
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=eatwana-uploads
AWS_REGION=ap-south-1

# Payment Gateway (Future)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Notifications
FIREBASE_SERVER_KEY=your_firebase_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@eatwana.com
SMTP_PASSWORD=your_password

# Other
WHATSAPP_BUSINESS_NUMBER=+919999999999
SUPPORT_EMAIL=support@eatwana.com
SUPPORT_PHONE=+919999999999
```

---

## Testing

### Test User Credentials
```json
{
  "admin": {
    "email": "admin@eatwana.com",
    "password": "Admin@123"
  },
  "customer": {
    "email": "customer@eatwana.com",
    "password": "Customer@123"
  }
}
```

### Postman Collection
Import the Eatwana API collection to test all endpoints with pre-configured requests.

---

## Changelog

### Version 1.0.0 (Initial Release)
- User authentication and profile management
- Dish and tiffin plan management
- Order creation and tracking
- Payment screenshot upload
- Rating and review system
- WhatsApp and callback requests
- Admin dashboard and analytics

### Version 1.1.0 (Planned)
- Razorpay/Stripe integration
- Real-time order tracking
- Delivery partner app
- Advanced analytics
- Loyalty program
- Referral system

---

## Support & Contact

**Email**: dev@eatwana.com  
**Documentation**: https://docs.eatwana.com  
**API Status**: https://status.eatwana.com