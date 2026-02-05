# 🚀 Final Upload Instructions for Hostinger

**Domain:** sreemeditec.in  
**Status:** All issues fixed - Ready to upload

---

## ✅ What's Been Fixed

1. ✅ **MIME Type Error** - Added proper JavaScript/CSS MIME types to .htaccess
2. ✅ **Image Path Error** - Fixed `/public/` paths to load from root `/`
3. ✅ **Backend Configuration** - CORS and environment validation ready

---

## 📦 Files Ready to Upload

All files are in the `client/dist/` folder, ready to upload directly to Hostinger.

---

## 🎯 Step-by-Step Upload Process

### **Step 1: Clear Hostinger public_html Folder**

1. Login to Hostinger File Manager
2. Go to `public_html/`
3. **Delete all files** (HTML, CSS, JS, images)
4. **⚠️ KEEP the `api` folder** (don't delete it!)

---

### **Step 2: Upload Frontend Files**

**Upload ALL files from `client/dist/` to `public_html/`:**

**Critical files to upload:**
- ✅ `index.html`
- ✅ `.htaccess` ← **VERY IMPORTANT!** This fixes the MIME type error
- ✅ `favicon.ico`
- ✅ `logo.png`
- ✅ All image files (*.jpg, *.jpeg, *.png)
- ✅ `assets/` folder (contains CSS and JavaScript)

---

### **Step 2.5: Upload Backend Files (API)**

**Upload ALL files from `server/` to `public_html/api/`:**

**CRITICAL files to upload:**
- ✅ `.htaccess` ← **CRITICAL!** Routes API requests to index.php
- ✅ `index.php` ← Main API router
- ✅ `composer.json` and `composer.lock`
- ✅ `api/` folder with all PHP files
- ✅ `config/` folder with all PHP files
- ✅ `vendor/` folder with all dependencies

**DO NOT upload:**
- ❌ `.env` (you'll create this separately with your real credentials)

**Your file structure should look like:**
```
public_html/
├── index.html
├── .htaccess          ← CRITICAL FILE!
├── favicon.ico
├── logo.png
├── Maria Parham Med.jpeg
├── download.jpeg
├── hero1.jpeg
├── hospital.jpg
├── meet.jpeg
├── op.jpeg
├── op1.jpg
├── pipeline.jpeg
├── assets/
│   ├── index-DeObbG_s.css
│   └── index-jQgyhxC6.js
└── api/               ← Already uploaded
    ├── index.php
    ├── .env
    └── ...
```

---

### **Step 3: Verify .htaccess Files (TWO FILES!)**

**Frontend .htaccess:** `public_html/.htaccess`
- Fixes MIME type errors for JavaScript and CSS
- Enables React Router (SPA routing)

**Backend .htaccess:** `public_html/api/.htaccess`
- **CRITICAL!** Routes API requests to index.php
- Without this, payment API will fail!

**How to see them:**
- In File Manager, enable "Show Hidden Files"
- Files start with a dot (`.htaccess`)

**The file should contain:**
```apache
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType text/css .css
  AddType image/jpeg .jpg .jpeg
  AddType image/png .png
  AddType image/x-icon .ico
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

---

### **Step 4: Verify Backend .env File**

Make sure `public_html/api/.env` exists with your credentials:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account"...YOUR_JSON...}
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
FRONTEND_URL=https://sreemeditec.in
PAYMENT_CALLBACK_URL=https://sreemeditec.in/api/payment-callback
```

---

### **Step 5: Enable PHP Extensions (if not done)**

1. Hostinger hPanel → **Advanced** → **PHP Configuration**
2. Click **PHP Extensions**
3. Enable:
   - ✅ curl
   - ✅ openssl
   - ✅ json
   - ✅ mbstring
4. Save

---

### **Step 6: Test Your Website**

**1. Test Homepage:**
Visit: `https://sreemeditec.in`
- ✅ Should load without errors
- ✅ All images should display
- ✅ No console errors

**2. Test Backend API:**
Visit: `https://sreemeditec.in/api/health`
- ✅ Should return: `{"status":"ok","message":"Razorpay API server is running"}`

**3. Test Services Page:**
Visit: `https://sreemeditec.in/services`
- ✅ Images should load (hospital.jpg, pipeline.jpeg, etc.)

**4. Test About Page:**
Visit: `https://sreemeditec.in/about`
- ✅ meet.jpeg image should display

---

## 🔍 Common Issues After Upload

### ❌ Still getting MIME type error?

**Cause:** .htaccess file not uploaded or hidden

**Fix:**
1. In Hostinger File Manager, click **Settings** → Enable "Show Hidden Files"
2. Check if `.htaccess` exists in `public_html/`
3. If missing, upload it from `client/dist/.htaccess`

---

### ❌ Images still showing 422 error?

**Cause:** Images not uploaded or in wrong folder

**Fix:**
1. Make sure ALL *.jpg and *.jpeg files are in `public_html/` (root folder)
2. Don't put them in a subfolder
3. File names are case-sensitive

---

### ❌ Payment error still showing?

**Cause:** Backend .env file missing or incorrect

**Fix:**
1. Check `public_html/api/.env` exists
2. Verify LIVE Razorpay keys (starts with `rzp_live_`)
3. Test: `https://sreemeditec.in/api/health`

---

### ❌ Blank page or 404 errors?

**Cause:** index.html not in root or wrong location

**Fix:**
1. Make sure `index.html` is in `public_html/` (not in a subfolder)
2. Clear browser cache (Ctrl + Shift + Delete)
3. Hard refresh (Ctrl + F5)

---

## ✅ Final Checklist

Before going live, verify:

- [ ] All files uploaded from `client/dist/` to `public_html/`
- [ ] `.htaccess` file exists in `public_html/` (enable "Show Hidden Files")
- [ ] All images (*.jpg, *.jpeg) in `public_html/` root folder
- [ ] `assets/` folder with CSS and JS files
- [ ] `api/` folder with backend files
- [ ] `api/.env` file with LIVE credentials
- [ ] PHP extensions enabled (curl, openssl)
- [ ] HTTPS/SSL enabled on domain
- [ ] `https://sreemeditec.in` loads without errors
- [ ] `https://sreemeditec.in/api/health` returns OK
- [ ] Browser console has no errors (F12)
- [ ] Images display on all pages
- [ ] Payment checkout works (test mode)

---

## 🎉 Success Criteria

After upload, you should see:

✅ Homepage loads with all images  
✅ No console errors (press F12)  
✅ Services page images display  
✅ About page images display  
✅ Payment checkout opens Razorpay modal  
✅ API health check returns OK  
✅ Mobile responsive layout works  
✅ Logo and favicon display  

---

## 📞 Still Having Issues?

If problems persist after following all steps:

1. **Check browser console** (F12 → Console tab) for specific errors
2. **Check Hostinger error logs** (Files → Error Logs)
3. **Verify file permissions** (should be 644 for files, 755 for folders)
4. **Clear ALL caches** (browser, Cloudflare if enabled, Hostinger cache)

---

## 📝 Summary

**What you need to upload:**
- Everything from `client/dist/` → `public_html/`
- Make sure `.htaccess` is included (fixes MIME error)
- All images in root folder (not `/public/` subfolder)
- Backend `api/.env` file with credentials

**Expected result:**
- Website loads perfectly
- All images display
- Payment system works
- No console errors

---

**You're ready to go live!** 🚀

Just upload the files and test each URL above. Everything should work perfectly!
