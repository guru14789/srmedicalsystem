# Overview

This project is a production-ready, modular, secure, and scalable e-commerce web application for Sree Meditec, a medical equipment company. It features a React frontend, Firebase services, and a PHP backend for secure payment processing. The application offers comprehensive features including user authentication, product management, order processing, and a robust admin dashboard, aiming to provide an efficient and secure e-commerce experience for medical equipment sales.

## Recent Updates (Nov 21, 2025)
- **Payment Callback REST API Fix**: Completely rewrote payment-callback.php to use Firebase REST API instead of PHP SDK to fix "Google\Cloud\Firestore\FirestoreClient" not found error on Hostinger production server; new version uses firebase/php-jwt library for authentication and direct HTTPS requests to Firestore REST API for querying/updating documents; works on any PHP hosting without requiring google/cloud-firestore package
- **Payment Callback Production Fix**: Fixed Firebase error causing payment failures - updated environment variable loading in server/index.php to prioritize Replit environment variables over .env file; set PAYMENT_CALLBACK_URL and FRONTEND_URL to https://sreemeditec.in in shared environment; added comprehensive error logging to payment-callback.php for debugging; built production frontend to client/dist/
- **Admin-Controlled Product Ratings**: Added rating field (0-5 stars) in admin product form - admins can now set and edit product ratings which display on Store page product cards and Product Details pages
- **Mobile-Responsive Admin Panel**: Complete mobile optimization for all admin dashboard components - tabs show icons-only on mobile, cards adapt to smaller screens, tables convert to mobile-friendly layouts, touch-friendly buttons
- **Order History Auto-Refresh**: Added 30-second auto-refresh and manual refresh button to Order History page - orders now update automatically when admin changes status
- **Firestore Query Fix**: Fixed "failed-precondition" error by replacing `where status != 'pending'` with JavaScript filtering - eliminates need for Firestore composite index
- **Payment Callback Fix**: Added missing `/payment-callback` route to server/index.php - fixes "Endpoint not found" error after successful payment; now properly redirects to payment success page
- **Savings Badge Feature**: Added red "Save ₹X" badge to product cards that displays when products have original_price higher than current price; shows actual savings amount
- **Original Price Support**: Fixed ProductCard to read `original_price` field from Firebase (snake_case) for discount calculations and badge display
- **Critical .env Loading Fix**: Added automatic .env file loading to server/index.php - PHP now reads environment variables correctly
- **Backend .htaccess**: Created server/.htaccess to route API requests properly - fixes payment "Unexpected token '<'" error
- **Image Path Fix**: Removed /public/ prefix from image paths in Services and About pages
- **MIME Type Fix**: Added proper JavaScript/CSS MIME types to frontend .htaccess
- **Complete Deployment Package**: All files ready for Hostinger with comprehensive troubleshooting guides
- **Environment Validation**: Added automatic validation for Razorpay LIVE keys, Firebase credentials, and PHP extensions
- **CORS Security Fixed**: Proper OPTIONS preflight handling for sreemeditec.in domain
- **Favicon & Logo Update**: Added custom favicon.ico to browser tab and replaced ShieldCheck icon with actual logo image in header/navbar; improved brand identity with consistent logo across all pages
- **Weight-Based Shipping System**: Replaced admin Shipping tab with product-level weight configuration; shipping costs now calculated per-item based on product weight and customer state at checkout only
- **Product Weight Field**: Added required weight_kg field to product schema and admin product forms for accurate shipping calculation
- **Smart Shipping Calculation**: Implemented tier-based shipping (0-1kg, 1-5kg, 5-10kg, 10kg+) with state-specific rates for 15 major Indian states; per-item calculation prevents overcharging on multi-item orders
- **Terms of Service Update**: Updated footer Terms of Service with comprehensive 8-section legal content covering cookies, licenses, user comments, hyperlinking, disclaimers, and liability; made social media icons (LinkedIn, Twitter, Instagram) clickable with proper links
- **Privacy Policy Update**: Updated footer Privacy Policy with comprehensive 12-section legal content covering data collection, cookies, user rights, children's privacy, and KVB payment security
- **Refund Policy Update**: Updated footer Refund Policy with comprehensive legal content including 7-day eligibility, 4-8 day processing, dispute resolution, and arbitration provisions governed by Indian law
- **Terms & Privacy Modals**: Added clickable Terms of Service and Privacy Policy pop-up modals on the registration page for transparency and legal compliance
- **Total Amount Display Fix**: Fixed order total calculations in Order Details, Invoice Download, and Admin Orders to correctly show subtotal + GST + shipping
- **Order Visibility Filter**: Only successfully paid orders (status: 'confirmed') are now visible to customers and admins; unpaid/abandoned orders (status: 'pending') are hidden from all views
- **Local Development Setup**: Created .env files with all credentials for running the app locally on your computer
- **Production Deployment Ready**: Configured Autoscale deployment with optimized production build serving both frontend and API from single PHP server
- **Fixed Registration Issues**: Updated Firestore security rules to accept both 'user' and 'customer' roles, fixing permission-denied errors during account creation
- **Enhanced Success Messaging**: Registration now shows clear success message "Account created successfully! 🎉 Welcome to Sreemeditec, [Name]!"
- **Improved Error Handling**: All Firebase authentication errors now display user-friendly messages
- **Auto-Refresh Features**: Added 60-second auto-refresh to Admin Orders and Users tabs, 30-second auto-refresh to customer Order Details page
- **Manual Refresh Buttons**: Added manual refresh buttons to all admin data tables for instant updates

# User Preferences

Preferred communication style: Simple, everyday language.

# Shipping System

## Weight-Based Shipping (Nov 9, 2025)
The application now uses intelligent weight-based and state-based shipping calculation instead of flat rates:

**Key Features:**
- Products require `weight_kg` field for shipping calculation
- Per-item shipping cost calculation (prevents overcharging on multi-item orders)
- Tier-based rates: 0-1kg, 1-5kg, 5-10kg, 10kg+ with state-specific pricing
- 15 major Indian states with custom rates (Tamil Nadu has lowest as local state)
- Shipping cost only displayed at checkout (not on product pages)
- Automatic calculation based on cart weight and customer state
- Caching system for performance (5-minute cache)
- Fallback to default rates if Firestore unavailable

**Admin removed Shipping tab** - shipping is now product-level (weight) and calculated automatically at checkout.

# System Architecture

## Hybrid Architecture
- **Frontend**: React 18 (Vite, port 5000)
- **Backend**: PHP 8.2 (port 8000) for secure payment processing.
- **Authentication**: Firebase Authentication with email/password and role-based access control (admin/customer).
- **Database**: Firebase Firestore.
- **File Storage**: Firebase Storage for product images and user avatars.
- **State Management**: React hooks with Firebase Authentication Context.
- **Routing**: React Router with protected routes.
- **Payment Processing**: PHP backend with Razorpay SDK for secure signature verification and redirect-based payment flow.

## Database Design
- **Primary Database**: Firebase Firestore (document-based model).
- **Key Collections**: `users`, `products`, `orders`, `cart`, `payments`, `shipments`, `contacts`, `quotes`, `wishlists`, `cart_history`, `feedback`, `settings`.
- **Security**: Firestore security rules ensure data access control based on authentication and roles.

## Firebase Service Layer
- **Location**: `client/src/lib/firebaseService.js`
- **Response Format**: Retrieval methods return `{success: true, data: [...]}`. Mutation methods return `{success: true/false}`.
- **Functionality**: Provides methods for authentication, user management, product management (CRUD), order management, cart operations, contact/quote handling, and payment order creation/verification (via PHP backend).

## PHP Backend (Razorpay Integration - Redirect Flow)
- **Location**: `server/` directory
- **Endpoints**:
  - `POST /api/create-razorpay-order`: Initiates Razorpay order creation.
  - `POST /api/payment-callback`: Receives payment confirmation from Razorpay, verifies signature, updates Firestore, and redirects to the frontend.
- **Dependencies**: Razorpay PHP SDK v2.9, Firebase Admin SDK v7.23 (kreait/firebase-php).
- **Security**: Server-side payment verification (signature validation), server-side Firestore updates via Firebase Admin SDK, Razorpay secret key not exposed to frontend.
- **CORS**: Enabled for all origins.
- **Environment Variables**: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `FIREBASE_SERVICE_ACCOUNT`, `PAYMENT_CALLBACK_URL`, `FRONTEND_URL`.

## UI/UX Features
- **Styling**: Tailwind CSS with a custom design system.
- **Responsive Design**: Mobile-optimized components.
- **Typography**: Enhanced spacing and responsive typography.
- **Image Handling**: Fallback images for improved user experience.
- **AI-Powered Chatbot**: Fixed bottom-right widget with a comprehensive knowledge base for customer support.
- **Wishlist System**: Allows users to save products.
- **Order Details**: Comprehensive order information with status tracking and invoice download.
- **Customer Feedback**: 5-star rating and feedback system for delivered orders.

## E-commerce Features
- **Product Management**: Full CRUD operations for detailed product information, including GST percentages.
- **Shopping Cart**: Persistent cart system.
- **Order Processing**: Complete lifecycle management with inventory tracking and state-based shipping costs.
- **Order Visibility**: Only confirmed/paid orders visible to customers and admins; pending orders hidden from all views.
- **Checkout Flow**: Streamlined process with secure redirect to Razorpay.
- **Admin Dashboard**: Comprehensive management of orders, users, products, quotes, shipping costs, and customer feedback, including analytics and role management.

# External Dependencies

## Firebase Services
- **Firebase Authentication**: User authentication and session management.
- **Firebase Firestore**: Real-time NoSQL database.
- **Firebase Storage**: Cloud storage for images and files.
- **Firebase SDK**: Version 11.0.2.

## Payment Processing
- **Razorpay**: Fully integrated payment gateway using a server-side redirect flow. PHP backend handles order creation, signature verification, Firestore updates, and redirects.
- **Credentials**: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `FIREBASE_SERVICE_ACCOUNT` are stored as environment secrets.

## Development Tools
- **Vite**: Frontend build tool and development server.
- **PHP Built-in Server**: Backend development server.
- **Composer**: PHP dependency management.
- **React Router**: Client-side routing.
- **Tailwind CSS**: Utility-first CSS framework.