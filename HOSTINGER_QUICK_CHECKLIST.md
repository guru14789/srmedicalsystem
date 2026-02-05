# ✅ Quick Deployment Checklist - sreemeditec.in

## Before You Start

- [ ] Hostinger account ready
- [ ] Domain `sreemeditec.in` pointed to Hostinger
- [ ] FTP/File Manager access
- [ ] Firebase service account JSON downloaded
- [ ] Razorpay LIVE API keys ready

---

## Step 1: Upload Frontend (5 minutes)

**Files to upload**: `client/dist/*` → `public_html/`

- [ ] Login to Hostinger File Manager
- [ ] Navigate to `public_html/`
- [ ] Delete all old files (if any)
- [ ] Upload ALL files from `client/dist/` folder:
  - [ ] `index.html`
  - [ ] `assets/` folder (with JS and CSS)
  - [ ] `.htaccess`
  - [ ] `favicon.ico`
  - [ ] `logo.ico`
  - [ ] All image files (hero1.jpeg, hospital.jpg, op1.jpg, etc.)

**Verify**: Visit https://sreemeditec.in - website should load

---

## Step 2: Upload Backend (5 minutes)

**Files to upload**: `server/*` → `public_html/api/`

- [ ] In `public_html/`, create folder `api`
- [ ] Upload ALL files from `server/` to `public_html/api/`:
  - [ ] `index.php`
  - [ ] `api/` folder
  - [ ] `config/` folder (includes cors.php already configured)
  - [ ] `vendor/` folder (Razorpay SDK)

**Verify**: Visit https://sreemeditec.in/api/health - should return `{"status":"ok"...}`

---

## Step 3: Configure Environment (10 minutes)

**Create `.env` file in `public_html/api/`**

### 3.1 Get Firebase Service Account
- [ ] Go to https://console.firebase.google.com
- [ ] Open project `sreemeditec-97add`
- [ ] Settings → Service accounts → Generate new private key
- [ ] Download JSON file and copy entire content

### 3.2 Get Razorpay Live Keys
- [ ] Go to https://dashboard.razorpay.com
- [ ] Settings → API Keys
- [ ] Copy **Live Key ID** (rzp_live_...)
- [ ] Copy **Live Key Secret**

### 3.3 Create .env File
- [ ] In File Manager, go to `public_html/api/`
- [ ] Create new file named `.env`
- [ ] Paste this and fill in your values:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account"...PASTE_FULL_JSON...}
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
FRONTEND_URL=https://sreemeditec.in
PAYMENT_CALLBACK_URL=https://sreemeditec.in/api/payment-callback
```

- [ ] Save file
- [ ] Set permissions to 644

---

## Step 4: Enable HTTPS (2 minutes)

- [ ] In Hostinger panel → SSL
- [ ] Enable **Force HTTPS** for sreemeditec.in
- [ ] Wait for SSL to activate

**Verify**: Visit https://sreemeditec.in - green padlock should appear

---

## Step 5: Test Everything (10 minutes)

### Website
- [ ] Homepage loads with all images
- [ ] Favicon appears in browser tab
- [ ] Logo appears in header
- [ ] Mobile responsive (resize browser)

### API
- [ ] https://sreemeditec.in/api/health returns OK
- [ ] No CORS errors in browser console (F12)

### Authentication
- [ ] Can register new account
- [ ] Can login
- [ ] Can logout

### Shopping
- [ ] Can view products on Store page
- [ ] Product images display
- [ ] Can add to cart
- [ ] Cart count updates

### Payment Flow
- [ ] Go to checkout
- [ ] Fill shipping details
- [ ] Click "Proceed to Payment"
- [ ] Razorpay modal opens
- [ ] Use test card: 4111 1111 1111 1111
- [ ] Payment completes
- [ ] Order appears in Order History
- [ ] Order in Firebase Firestore

### Admin
- [ ] Can access admin dashboard
- [ ] Can view orders
- [ ] Can manage products

---

## ✅ All Done!

If all checkboxes are checked, your website is live and working!

**Your Website**: https://sreemeditec.in

---

## 🆘 Common Issues

**Images not showing?**
→ Re-upload all files from `client/dist/` to `public_html/`

**Razorpay error?**
→ Check `.env` file has correct LIVE keys

**404 on API?**
→ Check backend uploaded to `public_html/api/`

**CORS error?**
→ Check `cors.php` has sreemeditec.in in allowed origins

**Layout broken on mobile?**
→ Clear browser cache (Ctrl+Shift+Delete)

---

**Need detailed instructions?** See `DEPLOY_TO_HOSTINGER.md`
