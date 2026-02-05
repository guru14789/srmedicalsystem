# 🔧 Fix "Server Configuration Error"

**Error:** `{"error":"Server configuration error","message":"Please check server logs for details."}`

---

## ✅ Good News!

Your backend API is **running** and the `.htaccess` file is working! 

The issue is that the **environment validation is failing** - meaning your `.env` file is missing, incomplete, or has invalid values.

---

## 🎯 What's Being Checked

The backend automatically validates:

1. ✅ **Firebase service account** is set and valid JSON
2. ✅ **Razorpay keys** are set and using **LIVE** keys (not test)
3. ✅ **URLs** are set (FRONTEND_URL, PAYMENT_CALLBACK_URL)
4. ✅ **PHP extensions** are enabled (curl, openssl, json, mbstring)

**One of these is failing!**

---

## 🔍 How to Find the Exact Error

### **Option 1: Check Hostinger Error Logs**

1. Login to Hostinger hPanel
2. Go to **Files** → **Error Logs**
3. Look for recent errors (today's date)
4. Look for line starting with: **"Environment validation failed:"**
5. It will tell you exactly what's wrong!

**Example error messages you might see:**
- `RAZORPAY_KEY_ID is not set`
- `RAZORPAY_KEY_ID must use LIVE keys (rzp_live_) in production`
- `FIREBASE_SERVICE_ACCOUNT is not valid JSON`
- `Required PHP extension 'curl' is not loaded`

---

### **Option 2: Manual Checklist**

Check your `public_html/api/.env` file has ALL these variables correctly:

---

## ✅ Step 1: Check FIREBASE_SERVICE_ACCOUNT

**Required format:**
```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"sreemeditec-97add","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-...@sreemeditec-97add.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**Common mistakes:**
- ❌ Missing completely → Add it!
- ❌ Has line breaks → Must be ONE LINE
- ❌ Missing quotes around value
- ❌ Invalid JSON (missing brackets, commas)

**How to get it:**
1. Go to https://console.firebase.google.com
2. Select **sreemeditec-97add** project
3. Settings ⚙️ → **Service Accounts**
4. Click **"Generate new private key"**
5. Download the JSON file
6. Open in text editor
7. **Remove ALL line breaks** (make it one line)
8. Copy the entire JSON
9. Paste in .env file

---

## ✅ Step 2: Check RAZORPAY_KEY_ID

**Required format:**
```env
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXX
```

**Critical:** Must start with `rzp_live_` (NOT `rzp_test_`)

**Common mistakes:**
- ❌ Using test key: `rzp_test_...` → Use LIVE key!
- ❌ Missing completely → Add it!
- ❌ Extra spaces or quotes

**How to get it:**
1. Go to https://dashboard.razorpay.com
2. Login with your account
3. Settings → **API Keys**
4. Look for **"Live Keys"** section (NOT Test Keys)
5. Copy **Key ID** (starts with `rzp_live_`)
6. Paste in .env file

---

## ✅ Step 3: Check RAZORPAY_KEY_SECRET

**Required format:**
```env
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

**Common mistakes:**
- ❌ Missing completely → Add it!
- ❌ Using test secret → Use LIVE secret!
- ❌ Extra spaces or quotes

**How to get it:**
1. Same page as above (Razorpay dashboard → API Keys)
2. Copy **Key Secret** from Live Keys section
3. Paste in .env file

---

## ✅ Step 4: Check FRONTEND_URL

**Required format:**
```env
FRONTEND_URL=https://sreemeditec.in
```

**Common mistakes:**
- ❌ Missing completely → Add it!
- ❌ Using HTTP instead of HTTPS → Must be HTTPS!
- ❌ Trailing slash: `https://sreemeditec.in/` → Remove trailing slash!

---

## ✅ Step 5: Check PAYMENT_CALLBACK_URL

**Required format:**
```env
PAYMENT_CALLBACK_URL=https://sreemeditec.in/api/payment-callback
```

**Common mistakes:**
- ❌ Missing completely → Add it!
- ❌ Using HTTP instead of HTTPS → Must be HTTPS!
- ❌ Wrong path → Must be `/api/payment-callback`

---

## ✅ Step 6: Check PHP Extensions

The backend requires these PHP extensions:
- **curl** - For Razorpay API calls
- **openssl** - For secure connections
- **json** - For JSON processing
- **mbstring** - For string handling

**How to enable:**
1. Hostinger hPanel
2. **Advanced** → **PHP Configuration**
3. Click **"PHP Extensions"** tab
4. Find and **enable** (tick the boxes):
   - ✅ curl
   - ✅ openssl
   - ✅ json
   - ✅ mbstring
5. Click **Save**

---

## 📝 Complete .env File Template

Your `public_html/api/.env` should look like this (with YOUR actual values):

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"sreemeditec-97add","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...YOUR_KEY...==\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-12345@sreemeditec-97add.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-12345%40sreemeditec-97add.iam.gserviceaccount.com"}
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
FRONTEND_URL=https://sreemeditec.in
PAYMENT_CALLBACK_URL=https://sreemeditec.in/api/payment-callback
```

**Important:**
- Firebase JSON must be **ONE LINE** (no line breaks!)
- Razorpay Key ID must start with **rzp_live_** (not rzp_test_)
- URLs must use **HTTPS** (not HTTP)
- No trailing slashes on URLs
- No extra spaces or quotes

---

## 🧪 Test After Fixing

After you fix the .env file:

**Visit:** https://sreemeditec.in/api/health

**If fixed, you'll see:**
```json
{"status":"ok","message":"Razorpay API server is running"}
```

**If still error:**
- Check Hostinger error logs for specific issue
- Verify .env file saved correctly
- Make sure PHP extensions enabled
- Clear browser cache

---

## 🎯 Most Common Issues

### ❌ Issue 1: Using Test Razorpay Keys

**Error in logs:** `RAZORPAY_KEY_ID must use LIVE keys`

**Fix:** 
- Go to Razorpay dashboard
- Use keys from **"Live Keys"** section (NOT Test Keys)
- Key ID must start with `rzp_live_`

---

### ❌ Issue 2: Firebase JSON Has Line Breaks

**Error in logs:** `FIREBASE_SERVICE_ACCOUNT is not valid JSON`

**Fix:**
- Open the JSON file in text editor
- Select all → Copy
- Go to: https://www.textfixer.com/tools/remove-line-breaks.php
- Paste and click "Remove Line Breaks"
- Copy the result
- Paste in .env file

---

### ❌ Issue 3: Missing curl Extension

**Error in logs:** `Required PHP extension 'curl' is not loaded`

**Fix:**
- Hostinger → PHP Configuration → PHP Extensions
- Enable **curl** and **openssl**
- Save

---

### ❌ Issue 4: URLs Using HTTP

**Error in logs:** `FRONTEND_URL must use HTTPS`

**Fix:**
- Change `http://` to `https://` in .env file
- Make sure SSL certificate is active in Hostinger

---

## 📞 Need Help?

**Check error logs first:**
1. Hostinger hPanel → Files → Error Logs
2. Look for "Environment validation failed:"
3. It will tell you exactly what to fix!

**Then fix the specific issue and test again.**

---

## ✅ Summary

**The Error:** Environment validation failing (missing or invalid .env values)

**The Fix:**
1. Check Hostinger error logs for specific issue
2. Verify .env file has ALL 5 variables
3. Use LIVE Razorpay keys (rzp_live_...)
4. Firebase JSON must be ONE LINE
5. URLs must use HTTPS
6. Enable PHP extensions (curl, openssl)
7. Test: https://sreemeditec.in/api/health

---

**After fixing, payment will work!** 🎉
