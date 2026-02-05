# Order Management & Customer Feedback Guide

## Overview

This guide explains the complete order management system, including order tracking, feedback collection, and invoice generation for the Sreemeditec e-commerce platform.

## Features Implemented

### ✅ 1. Complete Payment Flow
- User completes checkout and pays through Razorpay
- Backend verifies payment signature server-side
- Orders and payments are automatically created in Firestore
- User redirected to success page with order confirmation

### ✅ 2. Customer Order Management

#### View Order History
- **URL**: `/order-history`
- Customers can view all their orders
- Each order displays:
  - Order ID and date
  - Order status (Pending, Confirmed, Processing, Shipped, Out for Delivery, Delivered)
  - Items ordered with quantities and prices
  - Shipping address
  - Payment information
  - Total amount with tax breakdown

#### Order Details Page
- **URL**: `/order-details/:orderId`
- Comprehensive order information:
  - **Order Status Timeline**: Visual progress indicator showing complete order journey
  - **Order Items**: All products with images, quantities, and prices
  - **Delivery Address**: Complete shipping information with contact details
  - **Payment Information**: Payment method, status, and transaction ID
  - **Invoice Download**: One-click invoice generation in HTML format

#### Order Status Tracking
Orders progress through the following stages:
1. **Pending** - Order placed, awaiting confirmation
2. **Confirmed** - Payment verified, order confirmed
3. **Processing** - Order being prepared for shipment
4. **Shipped** - Order dispatched with courier
5. **Out for Delivery** - Order is with delivery agent
6. **Delivered** - Order successfully delivered

### ✅ 3. Feedback & Ratings System

#### Customer Feedback
- **When**: Available after order is delivered
- **Features**:
  - 5-star rating system
  - Optional written feedback/review
  - Submitted feedback is stored permanently
  - Cannot be edited after submission

#### Submitting Feedback
1. Go to Order Details page of a delivered order
2. Click "Rate & Review Order" button
3. Select rating (1-5 stars)
4. Optionally write feedback
5. Click "Submit Feedback"

### ✅ 4. Invoice Generation
- **Format**: HTML (can be converted to PDF)
- **Includes**:
  - Company branding
  - Invoice number and date
  - Order ID and status
  - Customer shipping address
  - Itemized list of products
  - Tax calculations (18% GST)
  - Grand total
  - Company contact information

#### Downloading Invoices
1. From Order History: Click "Download Invoice" button
2. From Order Details: Click "Download Invoice" in header
3. Open the downloaded HTML file in browser
4. Use browser's "Print to PDF" function to save as PDF

### ✅ 5. Admin Order Management

#### Orders Tab
- View all orders from all customers
- Filter and sort by status, date, customer
- Update order status with dropdown menu
- View complete order details in modal

#### Features for Admin:
- **Order Statistics**: Total orders, revenue, average order value
- **Status Management**: Change order status with one click
- **Customer Information**: View customer details, phone, email, address
- **Order Details Modal**: Quick view of all order information

### ✅ 6. Admin Feedback Management

#### Feedback Tab
- View all customer feedback and ratings
- **Statistics**:
  - Average rating across all orders
  - Total number of reviews
  - Rating distribution (1-5 stars)

#### Feedback Display:
- Customer name
- Order ID
- Star rating
- Written feedback
- Submission date
- Order value

## Database Structure

### Orders Collection
```javascript
{
  id: "auto-generated",
  user_id: "customer-uid",
  items: [
    {
      product_id: "...",
      product_name: "...",
      price: 1000,
      quantity: 2
    }
  ],
  subtotal: 2000,
  tax: 360,
  total: 2360,
  status: "confirmed",
  payment_id: "razorpay_payment_id",
  payment_status: "completed",
  shipping_name: "...",
  shipping_address: "...",
  shipping_city: "...",
  shipping_state: "...",
  shipping_pincode: "...",
  shipping_phone: "...",
  email: "...",
  feedback_submitted: false,
  rating: null,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Feedback Collection
```javascript
{
  id: "auto-generated",
  order_id: "...",
  user_id: "customer-uid",
  rating: 5,
  feedback: "Great product and service!",
  customer_name: "...",
  order_total: 2360,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

## Firestore Security Rules

**⚠️ CRITICAL**: You must deploy the updated `firestore.rules` file to Firebase Console for the system to work properly.

### Deploying Rules

1. Open Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to **Firestore Database**
4. Click on **Rules** tab
5. Copy the contents of `firestore.rules` file
6. Paste into the rules editor
7. Click **Publish**

The updated rules allow:
- Users to read their own orders
- Users to create orders during checkout
- Admins to read all orders and update status
- Users to submit feedback for delivered orders
- Admins to view all feedback

## Testing the Complete Flow

### Customer Flow:
1. Login as customer
2. Add products to cart
3. Proceed to checkout
4. Enter shipping details
5. Pay using Razorpay
6. **Result**: Redirected to success page
7. Go to Order History → See your order
8. Click "View Details" → See complete order information
9. Download invoice if needed
10. When order is delivered, submit feedback/rating

### Admin Flow:
1. Login as admin (mrgokkul@gmail.com)
2. Go to Admin Dashboard
3. **Dashboard Tab**: View order statistics
4. **Orders Tab**: 
   - View all customer orders
   - Update order status (Pending → Confirmed → Processing → Shipped → Delivered)
5. **Feedback Tab**: View all customer ratings and reviews
6. Monitor customer satisfaction and order fulfillment

## Troubleshooting

### Orders Not Showing
**Problem**: "Error fetching orders" or "No orders found"
**Solution**: 
1. Deploy Firebase security rules (see above)
2. Ensure user is logged in
3. Check browser console for errors

### Payment Successful But No Order
**Problem**: Payment went through but order not created
**Solution**: 
1. Check backend logs for errors
2. Verify FIREBASE_SERVICE_ACCOUNT environment variable is set
3. Check payment-callback.php for errors

### Cannot Submit Feedback
**Problem**: Feedback submission fails
**Solution**:
1. Ensure order status is "delivered"
2. Check if feedback already submitted
3. Deploy Firebase security rules for feedback collection

### Invoice Download Not Working
**Problem**: Invoice doesn't download
**Solution**:
1. Check browser's download settings
2. Allow popups for the website
3. Try different browser

## Environment Variables Required

Make sure these are set in your environment:

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Backend
```
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
PAYMENT_CALLBACK_URL=https://your-domain:8000/api/payment-callback
FRONTEND_URL=https://your-domain:5000
```

## Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Payment Processing | ✅ Complete | Razorpay redirect flow |
| Order Creation | ✅ Complete | Backend payment callback |
| Order History | ✅ Complete | `/order-history` |
| Order Details | ✅ Complete | `/order-details/:id` |
| Order Status Tracking | ✅ Complete | Visual timeline in order details |
| Feedback & Ratings | ✅ Complete | Order details page (delivered orders) |
| Invoice Download | ✅ Complete | Order history & order details |
| Admin Order Management | ✅ Complete | Admin Dashboard → Orders |
| Admin Feedback View | ✅ Complete | Admin Dashboard → Feedback |
| Admin Statistics | ✅ Complete | Admin Dashboard → Dashboard |

## Support

For technical issues or questions, please contact the development team or refer to the main README.md file.
