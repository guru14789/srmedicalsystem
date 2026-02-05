# 🏥 Sree Meditec E-Commerce Platform

A modern, production-ready e-commerce platform for medical equipment sales, built with React, Firebase, and PHP backend for secure payment processing.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28.svg)
![PHP](https://img.shields.io/badge/PHP-8.2-777BB4.svg)

## ✨ Key Features

### 🛍️ Complete E-Commerce Solution
- Product catalog with categories and search
- Shopping cart with wishlist functionality
- Secure Razorpay payment integration
- Order tracking and history
- Product-specific GST calculation (0-100%)
- State-based shipping costs
- Invoice generation

### 🤖 AI Customer Support
- Fixed bottom-right chatbot widget
- Comprehensive knowledge base
- Instant answers about products, policies, shipping

### 👤 User Management
- Firebase Authentication
- Role-based access (admin/customer)
- User profiles with avatars
- Order history and tracking
- Customer feedback system

### 🎛️ Admin Dashboard
- Analytics and metrics
- Product management (CRUD)
- Order processing
- Shipping configuration
- User management
- Quote requests handling

## 🚀 Quick Start

### Installation

```bash
# Frontend
cd client
npm install

# Backend
cd server
composer install
```

### Configuration

1. **Create environment files:**
   ```bash
   # Frontend
   cd client
   cp .env.example .env

   # Backend  
   cd server
   cp .env.example .env
   ```

2. **Add credentials to .env files** (see `.env.example` for details)

3. **Deploy Firebase security rules:**
   - Firebase Console → Firestore → Rules
   - Copy from `firestore.rules` and publish

### Run Locally

```bash
# Terminal 1 - Backend
cd server
php -S localhost:8000 index.php

# Terminal 2 - Frontend
cd client
npm run dev
```

Visit: **http://localhost:5000**

## 📚 Documentation

- **[Quick Start Guide](QUICK_START_GUIDE.md)** - Get running fast
- **[Local Development](LOCAL_DEVELOPMENT_SETUP.md)** - Detailed setup
- **[Hostinger Deployment](DEPLOYMENT_GUIDE_HOSTINGER.md)** - Production deployment
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Pre-launch verification
- **[Firebase Setup](FIREBASE_DEPLOYMENT_GUIDE.md)** - Security rules

## 🏗️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Firebase SDK  
**Backend:** PHP 8.2, Razorpay SDK, Firebase Admin SDK  
**Services:** Firebase (Auth, Firestore, Storage), Razorpay  

## 🔐 Environment Setup

See `.env.example` files in `client/` and `server/` directories for required environment variables.

**Required:**
- Firebase credentials (Console → Project Settings)
- Razorpay API keys (Dashboard → API Keys)
- Firebase Admin SDK service account

## 🧪 Testing

**Test Payments (Razorpay):**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Admin Access:**
- Email: mrgokkul@gmail.com
- Password: 123456

## 🐛 Troubleshooting

See [Local Development Setup](LOCAL_DEVELOPMENT_SETUP.md) for common issues.

## 📞 Support

Check documentation files for detailed guides and troubleshooting.

---

**Built with ❤️ for medical equipment excellence**
