# 💻 Local Development Setup Guide - Sree Meditec E-Commerce

This guide will help you set up and run the Sree Meditec application on your local computer for development and testing.

## 📋 Prerequisites

Make sure you have these installed on your computer:

- ✅ **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- ✅ **PHP** (v8.0 or higher) - [Download here](https://www.php.net/downloads)
- ✅ **Composer** (PHP package manager) - [Download here](https://getcomposer.org/)
- ✅ **Git** (optional, for version control) - [Download here](https://git-scm.com/)
- ✅ **Code Editor** (VS Code, Sublime, etc.) - [VS Code recommended](https://code.visualstudio.com/)

### Verify Installations

Open terminal/command prompt and run:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
php --version     # Should show 8.x.x
composer --version # Should show 2.x.x
```

## 📥 Step 1: Download the Project

### If you have the project files:

Extract the ZIP file or place the project folder on your computer.

### If using Git:

```bash
git clone <your-repository-url>
cd sree-meditec
```

## 🔧 Step 2: Install Dependencies

### 2.1 Install Frontend Dependencies

```bash
cd client
npm install
```

This will install all React and Vite dependencies.

### 2.2 Install Backend Dependencies

```bash
cd ../server
composer install
```

This will install PHP dependencies (Razorpay SDK, Firebase Admin SDK, etc.).

## 🔑 Step 3: Environment Variables - ✅ Already Configured!

**Good news!** The environment files have been created for you with all the necessary credentials.

### ✅ Files Created:

- **`client/.env`** - Frontend Firebase configuration
- **`server/.env`** - Backend Razorpay and Firebase Admin configuration

These files contain:
- Firebase API keys and configuration
- Razorpay payment gateway credentials
- Firebase Admin Service Account (for backend)
- Local development URLs

**You don't need to create or edit anything!** Just proceed to the next step.

---

### 📝 Optional: Review Environment Variables

If you want to see what's configured, you can check:

**Frontend (`client/.env`):**
```env
VITE_FIREBASE_API_KEY=<configured>
VITE_FIREBASE_AUTH_DOMAIN=<configured>
VITE_FIREBASE_PROJECT_ID=<configured>
VITE_FIREBASE_STORAGE_BUCKET=<configured>
VITE_FIREBASE_MESSAGING_SENDER_ID=<configured>
VITE_FIREBASE_APP_ID=<configured>
VITE_API_URL=http://localhost:8000
```

**Backend (`server/.env`):**
```env
RAZORPAY_KEY_ID=<configured>
RAZORPAY_KEY_SECRET=<configured>
FIREBASE_SERVICE_ACCOUNT=<configured>
PAYMENT_CALLBACK_URL=http://localhost:8000/api/payment-callback
FRONTEND_URL=http://localhost:5000
```

**Important:** These `.env` files are excluded from Git (via `.gitignore`) to keep your credentials secure.

## 🔥 Step 4: Deploy Firebase Security Rules

**CRITICAL:** Your app won't work without deploying security rules!

### Option 1: Using Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **"Firestore Database"** in the left sidebar
4. Click the **"Rules"** tab
5. Open the `firestore.rules` file from your project
6. **Copy ALL the content** and paste into the Firebase Console
7. Click **"Publish"**

### Option 2: Using Firebase CLI

If you have Firebase CLI installed:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

## 🚀 Step 5: Run the Application

You need to run **both** frontend and backend servers.

### 5.1 Start Backend Server (Terminal 1)

Open a terminal/command prompt:

```bash
cd server
php -S localhost:8000 index.php
```

You should see:
```
PHP 8.x.x Development Server (http://localhost:8000) started
```

**Keep this terminal running.**

### 5.2 Start Frontend Server (Terminal 2)

Open a **new** terminal/command prompt:

```bash
cd client
npm run dev
```

You should see:
```
VITE v6.x.x ready in xxx ms
➜  Local:   http://localhost:5000/
```

**Keep this terminal running.**

## 🌐 Step 6: Access the Application

1. Open your web browser
2. Go to: **http://localhost:5000**
3. You should see the Sree Meditec homepage!

## 👤 Step 7: Create Admin Account

### Method 1: Register and Manually Set Admin Role

1. Click **"Register"** and create an account
2. Go to [Firebase Console](https://console.firebase.google.com)
3. Select your project → **Firestore Database**
4. Find the `users` collection
5. Find your user document (by email)
6. Edit the document and change `role` field from `"customer"` to `"admin"`
7. Save changes
8. Refresh your app and login

### Method 2: Use Existing Admin Account

If you already have an admin account set up:

- **Email:** mrgokkul@gmail.com
- **Password:** 123456
- **Role:** admin

## ✅ Step 8: Test Everything

### Test Checklist:

- [ ] Homepage loads correctly
- [ ] Navigation works (Home, About, Store, Contact)
- [ ] Can register a new account
- [ ] Can login with existing account
- [ ] Products display on Store page
- [ ] Can add products to cart
- [ ] Cart page shows items
- [ ] Checkout page loads
- [ ] Can select state (shipping cost appears)
- [ ] Chatbot appears in bottom-right corner
- [ ] Admin dashboard accessible (if admin)
- [ ] Can create/edit products (admin)

### Test Payment Flow:

1. Add products to cart
2. Go to checkout
3. Fill in shipping details
4. Select a state
5. Click "Proceed to Payment"
6. Use Razorpay **test card**:
   - **Card Number:** 4111 1111 1111 1111
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date
7. Complete payment
8. Check if order appears in Order History
9. Verify order is saved in Firebase

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 5000 already in use"

**Solution:**
- Stop other apps using port 5000
- Or change port in `client/vite.config.js`:
  ```javascript
  server: {
    port: 3000  // Change to 3000
  }
  ```

### Issue: "Port 8000 already in use"

**Solution:**
```bash
# Use different port
cd server
php -S localhost:9000 index.php

# Update client/.env
VITE_API_URL=http://localhost:9000
```

### Issue: Firebase connection errors

**Solution:**
- Verify all Firebase environment variables are correct
- Check Firebase Console for project status
- Ensure Firestore security rules are deployed
- Check browser console for specific errors

### Issue: Razorpay payment not working

**Solution:**
- Verify you're using TEST keys (rzp_test_)
- Check both `RAZORPAY_KEY_ID` is set in both `.env` files
- Ensure `RAZORPAY_KEY_SECRET` is in `server/.env`
- Check backend terminal for errors

### Issue: CORS errors

**Solution:**
- Ensure backend is running on port 8000
- Check `server/api/` files have CORS headers
- Verify `FRONTEND_URL` in `server/.env` is http://localhost:5000

### Issue: Composer install fails

**Solution:**
```bash
# Update composer
composer self-update

# Try installing again
cd server
composer install --ignore-platform-reqs
```

## 📁 Project Structure

```
sree-meditec/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── lib/             # Firebase & utilities
│   │   └── App.jsx          # Main app component
│   ├── .env                 # Environment variables (create this)
│   ├── .env.example         # Environment template
│   ├── package.json         # Dependencies
│   └── vite.config.js       # Vite configuration
│
└── server/                   # PHP Backend
    ├── api/
    │   ├── create_razorpay_order.php
    │   ├── payment-callback.php
    │   └── verify_razorpay_payment.php
    ├── config/
    │   └── firebase.php
    ├── vendor/              # PHP dependencies
    ├── .env                 # Environment variables (create this)
    ├── .env.example         # Environment template
    └── composer.json        # PHP dependencies
```

## 🔄 Development Workflow

### Making Changes

1. **Frontend Changes:**
   - Edit files in `client/src/`
   - Changes auto-reload in browser (Hot Module Replacement)

2. **Backend Changes:**
   - Edit files in `server/`
   - Restart PHP server (Ctrl+C, then run `php -S localhost:8000 index.php` again)

### Testing Changes

- Check browser console (F12) for errors
- Check terminal running frontend for Vite errors
- Check terminal running backend for PHP errors
- Use Firebase Console to check database/auth

## 📝 Useful Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
php -S localhost:8000 index.php  # Start PHP server
composer install                  # Install dependencies
composer update                   # Update dependencies
```

## 🔐 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use TEST credentials** for local development
3. **Use LIVE credentials** only in production
4. Keep `.env.example` updated (without actual values)
5. Don't share your Firebase service account JSON
6. Don't share your Razorpay secret key

## 📞 Need Help?

If you encounter issues:
1. Check the error message in the console
2. Review this guide's troubleshooting section
3. Check Firebase Console for errors
4. Verify all environment variables are set correctly
5. Ensure both servers are running

## 🎉 You're All Set!

Your local development environment is ready! You can now:
- Develop new features
- Test changes locally
- Debug issues
- Prepare for deployment

**Happy coding!** 🚀
