# 🚀 Hostinger Deployment Guide - sreemeditec.in

**Ready-to-Deploy Package for Your Medical Equipment E-Commerce Website**

---

## 📦 What's Ready

✅ **Frontend**: Production build configured for `https://sreemeditec.in`  
✅ **Backend**: PHP API with Razorpay integration  
✅ **Images**: All images included (favicon, logo, product images)  
✅ **CORS**: Configured for your domain  
✅ **Responsive Layout**: Mobile and desktop optimized  

---

## 🎯 Quick Deployment (5 Steps)

### **Step 1: Prepare Your Files**

You have 2 folders ready to upload:

**Frontend Files** (in `client/dist/`):
```
client/dist/
├── index.html              ← Main page
├── assets/                 ← CSS & JavaScript
│   ├── index-Bgl8flqf.js
│   └── index-DeObbG_s.css
├── favicon.ico             ← Browser icon
├── logo.ico                ← Logo image
├── .htaccess               ← URL routing
└── All images (hero1.jpeg, hospital.jpg, etc.)
```

**Backend Files** (in `server/`):
```
server/
├── index.php               ← API router
├── api/                    ← Payment endpoints
│   ├── create_razorpay_order.php
│   └── verify_razorpay_payment.php
├── config/                 ← Configuration
│   ├── cors.php           ← Already configured for sreemeditec.in
│   └── firebase.php
├── vendor/                 ← PHP dependencies (Razorpay SDK)
└── .env.hostinger          ← Environment template
```

---

### **Step 2: Upload Frontend to Hostinger**

1. **Login to Hostinger**:
   - Go to https://hpanel.hostinger.com
   - Login with your credentials

2. **Access File Manager**:
   - Click on your domain `sreemeditec.in`
   - Click **File Manager**
   - Navigate to `public_html` folder

3. **Delete Old Files** (if any):
   - Delete everything in `public_html` folder (clean slate)

4. **Upload Frontend Files**:
   - Upload **ALL files** from `client/dist/` to `public_html/`
   - Make sure you upload:
     - ✅ `index.html`
     - ✅ `assets/` folder
     - ✅ `favicon.ico`
     - ✅ `logo.ico`
     - ✅ `.htaccess`
     - ✅ All image files (.jpg, .jpeg, .svg)

**Your structure should look like:**
```
public_html/
├── index.html
├── assets/
│   ├── index-Bgl8flqf.js
│   └── index-DeObbG_s.css
├── favicon.ico
├── logo.ico
├── .htaccess
├── hero1.jpeg
├── hospital.jpg
├── op1.jpg
└── ... (all other images)
```

---

### **Step 3: Upload Backend API to Hostinger**

1. **Create API Folder**:
   - In `public_html`, create a new folder called `api`
   - Enter the `api` folder

2. **Upload Backend Files**:
   - Upload **ALL files and folders** from `server/` to `public_html/api/`
   - Make sure you upload:
     - ✅ `index.php`
     - ✅ `api/` folder
     - ✅ `config/` folder
     - ✅ `vendor/` folder (contains Razorpay SDK)

**Your structure should look like:**
```
public_html/
├── api/                    ← Backend folder
│   ├── index.php
│   ├── api/
│   │   ├── create_razorpay_order.php
│   │   └── verify_razorpay_payment.php
│   ├── config/
│   │   ├── cors.php       ← Already configured for sreemeditec.in
│   │   └── firebase.php
│   └── vendor/            ← Razorpay PHP SDK
└── index.html             ← Frontend
```

---

### **Step 4: Configure Backend Environment**

1. **Get Your Firebase Service Account**:
   - Go to https://console.firebase.google.com
   - Select your project `sreemeditec-97add`
   - Go to **Project Settings** (gear icon)
   - Click **Service accounts** tab
   - Click **Generate new private key**
   - Download the JSON file
   - Open it and **copy the entire JSON** (you'll need this)

2. **Get Your Razorpay Live Keys**:
   - Go to https://dashboard.razorpay.com
   - Login to your account
   - Go to **Settings** → **API Keys**
   - Copy your **Live Key ID** (starts with `rzp_live_`)
   - Copy your **Live Key Secret**
   - ⚠️ **IMPORTANT**: Use LIVE keys, not TEST keys!

3. **Create .env File on Hostinger**:
   - In File Manager, go to `public_html/api/`
   - Click **New File**
   - Name it `.env` (exactly, with the dot)
   - Click **Edit**
   - Copy this template and fill in your actual values:

```env
# Firebase Service Account (paste the entire JSON as ONE line)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"sreemeditec-97add",...PASTE_YOUR_ENTIRE_JSON_HERE...}

# Razorpay Live Keys
RAZORPAY_KEY_ID=rzp_live_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET_KEY

# URLs
FRONTEND_URL=https://sreemeditec.in
PAYMENT_CALLBACK_URL=https://sreemeditec.in/api/payment-callback
```

4. **Save and Set Permissions**:
   - Save the file
   - Right-click on `.env` → **Permissions**
   - Set to `644` (rw-r--r--)

---

### **Step 5: Enable HTTPS (SSL Certificate)**

1. **In Hostinger Panel**:
   - Go to **SSL** section
   - Select your domain `sreemeditec.in`
   - Enable **Force HTTPS**
   - Wait for SSL certificate to activate (usually instant)

2. **Verify SSL**:
   - Visit https://sreemeditec.in (with https)
   - You should see a green padlock 🔒

---

## ✅ Verification Steps

After deployment, test each feature:

### **1. Website Loads** ✅
- Visit: https://sreemeditec.in
- You should see your homepage with all images

### **2. Images Display** ✅
- Check if logo appears in header
- Check if favicon appears in browser tab
- Check if product images load on Store page
- Check if hero images load on homepage

### **3. API Health Check** ✅
- Visit: https://sreemeditec.in/api/health
- You should see: `{"status":"ok","message":"Razorpay API server is running"}`
- If you see an error, check your `.env` file

### **4. Responsive Layout** ✅
- Open website on mobile (or resize browser window)
- Menu should collapse to hamburger icon
- Layout should adapt to screen size
- Images should scale properly

### **5. Razorpay Payment Test** ✅

**Test the complete payment flow:**

1. **Add Product to Cart**:
   - Go to Store page
   - Click "Add to Cart" on any product
   - Cart icon should show item count

2. **Go to Checkout**:
   - Click cart icon
   - Click "Proceed to Checkout"
   - Fill in shipping details
   - Click "Proceed to Payment"

3. **Razorpay Modal Opens**:
   - Razorpay payment modal should open
   - You should see correct amount
   - You should see "Pay ₹XXX" button

4. **Complete Payment** (Test Mode):
   - Use Razorpay test card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: Any future date
   - OTP: `123456`
   - Click Pay

5. **Order Created**:
   - You should be redirected to success page
   - Order should appear in your Order History
   - Check Firebase Firestore → `orders` collection
   - Order status should be `confirmed`

---

## 🔧 Troubleshooting

### ❌ **Images Not Showing**

**Check:**
- Did you upload ALL files from `client/dist/` including images?
- Check File Manager: Do you see `favicon.ico`, `logo.ico`, `hero1.jpeg`, etc.?
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console (F12) for 404 errors

**Fix:**
```
Re-upload all files from client/dist/ to public_html/
Make sure .htaccess is uploaded
Clear browser cache and refresh
```

---

### ❌ **Razorpay Not Connecting**

**Error**: "Failed to create Razorpay order"

**Check:**
1. Visit https://sreemeditec.in/api/health
   - If error 404: Backend not uploaded correctly
   - If error 500: Check `.env` file

2. Check `.env` file:
   - Does it exist in `public_html/api/.env`?
   - Are Razorpay keys correct?
   - Is Firebase service account JSON complete?

3. Check browser console (F12):
   - Look for CORS errors
   - Look for network errors

**Fix:**
```
1. Verify .env file exists in public_html/api/.env
2. Verify Razorpay keys are LIVE keys (rzp_live_...)
3. Verify Firebase service account JSON is complete
4. Check cors.php has sreemeditec.in in allowed origins
```

---

### ❌ **Orders Not Creating**

**Check:**
1. Payment completes successfully?
2. Check Firebase Firestore → `orders` collection
3. Check browser console for errors
4. Check if Firebase service account has write permissions

**Fix:**
```
1. Verify Firebase service account JSON is correct
2. Check Firestore security rules allow server writes
3. Test payment again with test card
```

---

### ❌ **Layout Too Small on Mobile**

**Check:**
1. Does `index.html` have viewport meta tag?
2. Clear browser cache
3. Check if CSS loaded (browser console)

**Fix:**
```
The production build already includes responsive CSS.
Clear cache: Ctrl+Shift+Delete
Force refresh: Ctrl+F5
Check mobile view: F12 → Toggle device toolbar
```

---

### ❌ **CORS Error in Browser Console**

**Error**: `Access to fetch blocked by CORS policy`

**Check:**
1. Is HTTPS enabled?
2. Is `cors.php` configured with your domain?

**Fix:**
```
1. Edit public_html/api/config/cors.php
2. Verify $allowedOrigins includes:
   - https://sreemeditec.in
   - https://www.sreemeditec.in
3. Save file
4. Clear browser cache
```

---

## 📋 Post-Deployment Checklist

After deployment, check all these:

- [ ] Website loads at https://sreemeditec.in
- [ ] SSL certificate active (green padlock)
- [ ] Favicon appears in browser tab
- [ ] Logo appears in header
- [ ] All images load on homepage
- [ ] Product images load on Store page
- [ ] Mobile layout responsive (hamburger menu)
- [ ] API health returns OK: https://sreemeditec.in/api/health
- [ ] Can register new account
- [ ] Can login to existing account
- [ ] Can add products to cart
- [ ] Cart count updates
- [ ] Checkout page loads
- [ ] Razorpay modal opens on payment
- [ ] Test payment completes successfully
- [ ] Order appears in Order History
- [ ] Order visible in Firebase Firestore
- [ ] Admin dashboard accessible
- [ ] Can view orders in admin panel

---

## 🎉 Success!

If all checks pass, your website is **fully deployed and working!**

**Your live website**: https://sreemeditec.in

**Features working:**
✅ Razorpay payments  
✅ Order creation  
✅ Image display  
✅ Responsive layout  
✅ Firebase authentication  
✅ Admin dashboard  
✅ Shopping cart  
✅ Order tracking  

---

## 🆘 Need Help?

**Common Issues:**

1. **API Returns 404**: Backend not uploaded to `public_html/api/`
2. **Razorpay Error**: Check `.env` file has correct keys
3. **Images Missing**: Re-upload all files from `client/dist/`
4. **CORS Error**: Verify `cors.php` has your domain
5. **Layout Issues**: Clear browser cache (Ctrl+Shift+Delete)

**Still stuck?**
- Check PHP error logs in Hostinger panel
- Check browser console (F12) for errors
- Verify all files uploaded correctly
- Make sure HTTPS is enabled

---

## 📁 Files to Upload Summary

**Frontend (upload to `public_html/`):**
```bash
client/dist/* → public_html/
```

**Backend (upload to `public_html/api/`):**
```bash
server/* → public_html/api/
```

**Create manually on Hostinger:**
- `public_html/api/.env` (using template above)

---

## 🔐 Security Reminders

✅ **DO:**
- Use HTTPS (SSL enabled)
- Use LIVE Razorpay keys in production
- Keep `.env` file secure (permissions 644)
- Use strong passwords
- Backup Firestore database regularly

❌ **DON'T:**
- Use TEST Razorpay keys in production
- Expose `.env` file publicly
- Commit secrets to Git
- Allow CORS from all origins

---

**Deployment Date**: November 10, 2025  
**Domain**: sreemeditec.in  
**Status**: Ready to Deploy 🚀
