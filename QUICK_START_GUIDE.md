# 🚀 Quick Start Guide - Sree Meditec E-Commerce

## For Immediate Local Development

### 1. Install Requirements
- Node.js 18+ ([Download](https://nodejs.org/))
- PHP 8.0+ ([Download](https://www.php.net/downloads))
- Composer ([Download](https://getcomposer.org/))

### 2. Setup Environment Variables

**Frontend (client/.env):**
```bash
cd client
cp .env.example .env
# Edit .env and add your Firebase + Razorpay TEST credentials
```

**Backend (server/.env):**
```bash
cd server
cp .env.example .env
# Edit .env and add your Firebase Admin SDK + Razorpay TEST credentials
```

### 3. Install Dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd server
composer install
```

### 4. Deploy Firebase Rules
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Firestore Database → Rules tab
3. Copy content from `firestore.rules` file
4. Paste and Publish

### 5. Run Application
**Terminal 1 - Backend:**
```bash
cd server
php -S localhost:8000 index.php
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 6. Open Browser
Visit: **http://localhost:5000**

---

## For Hostinger Deployment

### 1. Build Frontend
```bash
cd client
npm run build
```

### 2. Upload Files
- Upload `client/dist/*` → `public_html/`
- Upload `server/*` → `public_html/api/`

### 3. Configure Environment Variables
Add to `public_html/api/.htaccess`:
```apache
SetEnv FIREBASE_SERVICE_ACCOUNT '{"type":"service_account",...}'
SetEnv RAZORPAY_KEY_ID "rzp_live_XXXX"
SetEnv RAZORPAY_KEY_SECRET "YOUR_SECRET"
SetEnv FRONTEND_URL "https://yourdomain.com"
SetEnv PAYMENT_CALLBACK_URL "https://yourdomain.com/api/payment-callback"
```

### 4. Enable HTTPS
- Install SSL certificate in Hostinger
- Force HTTPS redirect

### 5. Test
Visit your domain and test all features!

---

## Important Credentials

### Firebase Console
https://console.firebase.google.com
- Get: API keys, Service Account, Storage bucket

### Razorpay Dashboard  
https://dashboard.razorpay.com
- Get: Key ID (public), Key Secret (private)
- Use TEST keys for development, LIVE keys for production

---

## Test Payment Cards

**Test Mode (Razorpay):**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

---

## Admin Access

**Default Admin Account:**
- Email: mrgokkul@gmail.com
- Password: 123456
- Role: admin

**Or create new admin:**
1. Register new account
2. Firebase Console → Firestore
3. Find user document
4. Change `role` to `"admin"`

---

## Troubleshooting

### "Module not found"
```bash
cd client
rm -rf node_modules
npm install
```

### "Port already in use"
Change port in `vite.config.js` or kill process

### Firebase errors
- Check security rules are deployed
- Verify all environment variables

### Payment not working
- Check both RAZORPAY_KEY_ID in frontend AND backend
- Verify RAZORPAY_KEY_SECRET in backend
- Use TEST keys for development

---

## Need Help?

📖 **Full Documentation:**
- `LOCAL_DEVELOPMENT_SETUP.md` - Detailed local setup
- `DEPLOYMENT_GUIDE_HOSTINGER.md` - Complete deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `FIREBASE_DEPLOYMENT_GUIDE.md` - Firebase rules deployment

---

**Happy building! 🎉**
