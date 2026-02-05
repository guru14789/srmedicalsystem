# 🔧 PHP Requirements & Automatic Validation

**For Hostinger Deployment - sreemeditec.in**

---

## ⚠️ CRITICAL PHP Requirements

The backend has **automatic validation** that checks your configuration before allowing the API to run.

### Required PHP Version
- **Minimum**: PHP 8.1
- **Recommended**: PHP 8.2 or higher

### Required PHP Extensions (MANDATORY)

**These extensions are CRITICAL for Razorpay payments:**

✅ **curl** - Required for Razorpay API calls (payment creation/verification)  
✅ **openssl** - Required for HTTPS connections and payment signature verification  
✅ **json** - Required for JSON data processing  
✅ **mbstring** - Required for string handling  

**How to enable in Hostinger:**
1. Login to hPanel
2. Go to **Advanced** → **PHP Configuration**
3. Click **PHP Extensions**
4. **Enable**: curl, openssl, json, mbstring
5. Save changes

---

## 🛡️ Automatic Environment Validation

The backend includes **automatic validation** (`server/config/validate_env.php`) that checks:

### 1. Razorpay Configuration
- ✅ `RAZORPAY_KEY_ID` is set
- ✅ `RAZORPAY_KEY_ID` uses LIVE keys (`rzp_live_...`) not test keys
- ✅ `RAZORPAY_KEY_SECRET` is set

### 2. Firebase Configuration
- ✅ `FIREBASE_SERVICE_ACCOUNT` is set
- ✅ JSON is valid with required fields (project_id, private_key)

### 3. URL Configuration
- ✅ `FRONTEND_URL` is set and uses HTTPS
- ✅ `PAYMENT_CALLBACK_URL` is set and uses HTTPS

### 4. PHP Extensions
- ✅ curl extension loaded
- ✅ json extension loaded
- ✅ mbstring extension loaded
- ✅ openssl extension loaded

---

## 🚨 What Happens If Validation Fails

If any check fails, the API will:
1. Return HTTP 500 error
2. Show error message: "Server configuration error"
3. Log specific issues to PHP error log
4. **Prevent the API from running** (safety feature)

**Example error response:**
```json
{
  "error": "Server configuration error",
  "details": "Required environment variables are not configured. Please contact administrator."
}
```

**The specific errors are logged to PHP error log** so you can see exactly what's missing.

---

## ✅ How to Verify Configuration

### Step 1: Upload Backend Files
Upload all `server/*` files to `public_html/api/`

### Step 2: Create .env File
Create `public_html/api/.env` with your actual keys (see DEPLOY_TO_HOSTINGER.md)

### Step 3: Test Validation
Visit: **https://sreemeditec.in/api/health**

**If configuration is correct:**
```json
{
  "status": "ok",
  "message": "Razorpay API server is running"
}
```

**If configuration has errors:**
```json
{
  "error": "Server configuration error",
  "details": "Required environment variables are not configured..."
}
```

### Step 4: Check PHP Error Logs
If you see configuration error:
1. Go to Hostinger hPanel
2. **Files** → **Error Logs**
3. Look for specific validation errors
4. Fix the issues and test again

---

## 🔍 Common Validation Errors

### ❌ "RAZORPAY_KEY_ID must use LIVE keys"

**Cause**: You're using test keys (rzp_test_...) in production

**Fix**:
1. Go to https://dashboard.razorpay.com
2. Settings → API Keys
3. Copy **LIVE Key ID** (starts with `rzp_live_`)
4. Update `.env` file
5. Test again

---

### ❌ "FIREBASE_SERVICE_ACCOUNT is not valid JSON"

**Cause**: Service account JSON is incomplete or has line breaks

**Fix**:
1. Copy the **entire** JSON from Firebase
2. Remove ALL line breaks (must be single line)
3. Paste in `.env` file as one line
4. Test again

---

### ❌ "Required PHP extension 'curl' is not loaded"

**Cause**: PHP curl extension not enabled

**Fix**:
1. Hostinger hPanel → PHP Configuration
2. PHP Extensions tab
3. Enable **curl**
4. Save changes
5. Test again

---

### ❌ "FRONTEND_URL must use HTTPS"

**Cause**: Using HTTP instead of HTTPS

**Fix**:
1. Edit `.env` file
2. Change `http://` to `https://`
3. Make sure SSL certificate is active in Hostinger
4. Test again

---

## 🔒 Security Features

The validation system provides these security benefits:

1. **Prevents test key usage in production** - Forces you to use live Razorpay keys
2. **Enforces HTTPS** - Won't allow HTTP URLs (insecure)
3. **Validates Firebase credentials** - Ensures service account is properly formatted
4. **Checks PHP extensions** - Prevents runtime errors from missing dependencies
5. **Fails safely** - Returns generic error to users, logs details for admins

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] PHP 8.1+ selected in Hostinger
- [ ] curl extension enabled
- [ ] openssl extension enabled
- [ ] json extension enabled
- [ ] mbstring extension enabled
- [ ] SSL certificate active (HTTPS)
- [ ] .env file created with all variables
- [ ] Using LIVE Razorpay keys (rzp_live_...)
- [ ] Firebase service account JSON is complete

---

## 🧪 Test Validation Manually (Optional)

You can test the validation script directly via SSH:

```bash
# SSH into Hostinger
ssh your-username@sreemeditec.in

# Navigate to API directory
cd public_html/api

# Run validation
php config/validate_env.php
```

**Output if all correct:**
```
✅ All environment variables are configured correctly!
```

**Output if errors:**
```
❌ Environment validation failed:
  - RAZORPAY_KEY_ID must use LIVE keys (rzp_live_) in production
  - Required PHP extension 'curl' is not loaded
```

---

## 🎯 Summary

**What's New:**
1. Automatic validation on every API request
2. Prevents misconfiguration from causing payment failures
3. Clear error messages for debugging
4. PHP extension checking

**How It Helps:**
- Catches configuration errors immediately
- Prevents test keys in production
- Ensures all dependencies are loaded
- Makes debugging easier

**What You Need to Do:**
1. Enable required PHP extensions in Hostinger
2. Use LIVE Razorpay keys in .env file
3. Ensure HTTPS is active
4. Test https://sreemeditec.in/api/health

---

**This validation runs automatically - you don't need to do anything except configure the .env file correctly!**
