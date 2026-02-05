# 🚀 Quick Start - Local Development

Your environment is **100% ready** for local development! Just follow these steps.

## ✅ What's Already Done

- ✅ `.env` files created with all credentials
- ✅ Files secured in `.gitignore`
- ✅ Frontend environment configured
- ✅ Backend environment configured

## 🏃 3 Simple Steps to Run Locally

### Step 1: Install Dependencies (One-Time)

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
composer install
```

### Step 2: Start Servers (2 Terminals)

**Terminal 1 - Backend API:**
```bash
cd server
php -S localhost:8000 index.php
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Step 3: Open Browser

```
http://localhost:5000
```

---

## ⚠️ Before First Use

**Deploy Firestore Security Rules** (One-Time):

1. Go to: https://console.firebase.google.com/
2. Select your project → **Firestore Database** → **Rules** tab
3. Copy content from `firestore.rules` file
4. Paste into Firebase Console and click **"Publish"**

Without this step, registration and database operations won't work!

---

## 📁 Environment Files Created

### `client/.env` (456 bytes)
Contains:
- Firebase configuration (API key, project ID, etc.)
- Backend API URL: `http://localhost:8000`

### `server/.env` (2.7 KB)
Contains:
- Razorpay payment credentials
- Firebase Admin Service Account
- Callback URLs for local development

**Security:** Both files are excluded from Git automatically.

---

## 🧪 Test Everything

1. ✅ Homepage loads
2. ✅ Register a new account
3. ✅ Login works
4. ✅ Products display
5. ✅ Add to cart
6. ✅ Checkout flow
7. ✅ Admin dashboard (if admin)

---

## 📚 Full Documentation

- **`LOCAL_DEVELOPMENT_SETUP.md`** - Complete step-by-step guide
- **`ENV_FILES_CREATED.md`** - Environment files documentation
- **`DEPLOYMENT_GUIDE.md`** - Production deployment guide

---

## 💡 Tips

- **Both servers must run** - Frontend (5000) + Backend (8000)
- **Hot reload enabled** - Frontend changes auto-refresh
- **Check terminal logs** - Errors appear in server terminals
- **Use test payments** - Razorpay test card: 4111 1111 1111 1111

---

**Ready to code!** 🎉
