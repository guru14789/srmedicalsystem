# 🔧 Fix Payment Error on Hostinger

**Error:** `Error creating payment order: SyntaxError: Unexpected token '<', "<!DOCTYPE"`

---

## ⚠️ What This Error Means

Your frontend is trying to call the payment API at `https://sreemeditec.in/api/create-razorpay-order`, but instead of getting JSON back, it's getting an **HTML error page** (which starts with `<!DOCTYPE`).

This means your **backend API is not working**.

---

## 🎯 Critical Missing File: `.htaccess` in API Folder

**The most common cause:** The `.htaccess` file is missing from your `public_html/api/` folder.

Without this file, Apache doesn't know how to route API requests, so it returns a 404 error page (HTML) instead of JSON.

---

## ✅ Quick Fix (3 Steps)

### **Step 1: Upload the Missing .htaccess File**

**Upload this file:** `server/.htaccess` → `public_html/api/.htaccess`

**In Hostinger File Manager:**
1. Go to `public_html/api/`
2. Click "Upload Files"
3. Upload `server/.htaccess` from your computer
4. Make sure it's named `.htaccess` (starts with a dot)

**Enable "Show Hidden Files"** in File Manager settings if you can't see it!

---

### **Step 2: Verify .env File Exists**

Check that `public_html/api/.env` exists with your credentials:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account"...YOUR_FULL_JSON...}
RAZORPAY_KEY_ID=rzp_live_YOUR_ACTUAL_KEY
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET
FRONTEND_URL=https://sreemeditec.in
PAYMENT_CALLBACK_URL=https://sreemeditec.in/api/payment-callback
```

**How to get Firebase JSON:**
1. Go to https://console.firebase.google.com
2. Select "sreemeditec-97add" project
3. Settings → Service Accounts
4. Click "Generate new private key"
5. Copy the ENTIRE JSON (must be ONE LINE)

**How to get Razorpay LIVE keys:**
1. Go to https://dashboard.razorpay.com
2. Settings → API Keys
3. Copy LIVE Key ID (starts with `rzp_live_`)
4. Copy LIVE Key Secret

---

### **Step 3: Test Backend API**

Visit this URL in your browser: **https://sreemeditec.in/api/health**

**If it works, you'll see:**
```json
{"status":"ok","message":"Razorpay API server is running"}
```

**If it still shows HTML or error:**
- .htaccess file is missing or incorrectly named
- .env file is missing or has wrong credentials
- PHP extensions not enabled

---

## 📁 Required File Structure on Hostinger

Your `public_html/api/` folder must have:

```
public_html/api/
├── .htaccess          ← CRITICAL! Routes requests to index.php
├── .env               ← CRITICAL! Your credentials
├── index.php          ← Main API router
├── composer.json
├── composer.lock
├── api/
│   ├── create_razorpay_order.php
│   └── verify_razorpay_payment.php
├── config/
│   ├── cors.php
│   └── validate_env.php
└── vendor/
    └── (all composer dependencies)
```

---

## 🔍 Diagnostic Checklist

**Check these in order:**

### ✅ 1. Check if .htaccess exists
- Go to `public_html/api/`
- Enable "Show Hidden Files" in File Manager
- Look for `.htaccess` file
- **If missing:** Upload from `server/.htaccess`

### ✅ 2. Check if .env exists
- Go to `public_html/api/`
- Look for `.env` file
- **If missing:** Create it with credentials above

### ✅ 3. Test API health endpoint
- Visit: https://sreemeditec.in/api/health
- **Should return JSON, not HTML**
- If HTML error: .htaccess or .env problem

### ✅ 4. Check PHP extensions
- Hostinger → PHP Configuration → Extensions
- Enable: **curl**, **openssl**, **json**, **mbstring**

### ✅ 5. Check file permissions
- `.htaccess` → 644
- `.env` → 644
- `index.php` → 644
- `api/` folder → 755
- `vendor/` folder → 755

---

## 🚨 Common Mistakes

### ❌ Mistake 1: .htaccess not uploaded
**Symptom:** API returns HTML error pages  
**Fix:** Upload `server/.htaccess` to `public_html/api/.htaccess`

### ❌ Mistake 2: .htaccess wrong name
**Symptom:** File exists but API still fails  
**Fix:** Make sure it's named `.htaccess` (starts with dot, no extension)

### ❌ Mistake 3: .env file missing
**Symptom:** API returns "Server configuration error"  
**Fix:** Create `.env` file with credentials

### ❌ Mistake 4: Using test Razorpay keys
**Symptom:** Validation error in logs  
**Fix:** Use LIVE keys (rzp_live_...) not test keys

### ❌ Mistake 5: Firebase JSON has line breaks
**Symptom:** Invalid JSON error  
**Fix:** Remove ALL line breaks, paste as single line

---

## 🧪 Step-by-Step Testing

**Test 1:** Backend routing works
```
Visit: https://sreemeditec.in/api/health
Expected: {"status":"ok","message":"Razorpay API server is running"}
```

**Test 2:** Environment configured
```
Check browser console at: https://sreemeditec.in/api/health
Should NOT show "Server configuration error"
```

**Test 3:** CORS works
```
From your website, open browser console (F12)
Try to add to cart and checkout
Should NOT show CORS error
```

**Test 4:** Payment creation
```
Add product to cart
Click checkout
Should open Razorpay modal (not error)
```

---

## 📝 Complete Upload Checklist

Upload these files from `server/` to `public_html/api/`:

- [ ] `.htaccess` ← **MOST IMPORTANT!**
- [ ] `.env` ← **CREATE THIS with your credentials**
- [ ] `index.php`
- [ ] `composer.json`
- [ ] `composer.lock`
- [ ] `api/` folder with all PHP files
- [ ] `config/` folder with all PHP files
- [ ] `vendor/` folder with all dependencies

---

## 🎯 Expected Result After Fix

After uploading `.htaccess` and `.env`:

✅ `https://sreemeditec.in/api/health` returns JSON  
✅ No "Unexpected token '<'" errors  
✅ Payment checkout opens Razorpay modal  
✅ Orders create successfully  
✅ No console errors  

---

## 💡 Quick Diagnostic Command

**Check what the API returns:**

1. Open browser console (F12)
2. Go to Network tab
3. Try to checkout
4. Look for request to `/api/create-razorpay-order`
5. Click on it → Preview tab
6. If you see HTML → .htaccess missing
7. If you see JSON error → .env problem

---

## 🆘 Still Not Working?

If you've uploaded both `.htaccess` and `.env` and it still fails:

**Check Hostinger Error Logs:**
1. Hostinger hPanel
2. Files → Error Logs
3. Look for PHP errors
4. Common issues:
   - Missing PHP extensions
   - Invalid Firebase JSON
   - Wrong file permissions
   - Syntax errors

**Check PHP Version:**
- Must be PHP 8.1 or higher
- Hostinger → Advanced → PHP Configuration

**Check .htaccess syntax:**
- Make sure file is plain text (not Word doc)
- No extra spaces or characters
- Exactly as provided in `server/.htaccess`

---

## ✅ Summary

**The Issue:** Backend API returning HTML instead of JSON

**The Fix:**
1. Upload `server/.htaccess` → `public_html/api/.htaccess`
2. Create `public_html/api/.env` with credentials
3. Enable PHP extensions (curl, openssl)
4. Test: https://sreemeditec.in/api/health

**Expected Result:** JSON response, payment works

---

**The .htaccess file is THE critical file for the backend to work!** 🎯
