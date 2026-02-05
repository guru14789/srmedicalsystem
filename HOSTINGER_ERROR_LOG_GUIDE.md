# 📋 How to Check Hostinger Error Logs

**To find out exactly what's wrong with your .env configuration:**

---

## 📍 Step-by-Step Guide

### **Step 1: Login to Hostinger**
1. Go to https://hpanel.hostinger.com
2. Login with your credentials

---

### **Step 2: Access Error Logs**
1. Click on your website: **sreemeditec.in**
2. In the left sidebar, click **"Files"**
3. Click **"Error Logs"**

---

### **Step 3: Find the Error**
1. You'll see a list of errors
2. Look for recent errors (today's date/time: **Nov 10, 2025**)
3. Find entries that contain: **"Environment validation failed"**

---

### **Step 4: Read the Error Message**

The error log will show you **exactly** what's wrong. Examples:

#### ❌ **Missing Razorpay Key:**
```
Environment validation failed: RAZORPAY_KEY_ID is not set
```
**Fix:** Add `RAZORPAY_KEY_ID=rzp_live_...` to .env file

---

#### ❌ **Using Test Keys:**
```
Environment validation failed: RAZORPAY_KEY_ID must use LIVE keys (rzp_live_) in production, found: rzp_test_XXXXXX
```
**Fix:** Replace test key with LIVE key from Razorpay dashboard

---

#### ❌ **Invalid Firebase JSON:**
```
Environment validation failed: FIREBASE_SERVICE_ACCOUNT is not valid JSON or missing required fields
```
**Fix:** 
- Re-download Firebase service account JSON
- Remove ALL line breaks
- Paste as single line in .env

---

#### ❌ **Missing PHP Extension:**
```
Environment validation failed: Required PHP extension 'curl' is not loaded
```
**Fix:** 
- Go to Advanced → PHP Configuration → PHP Extensions
- Enable curl and openssl

---

#### ❌ **HTTP URLs (need HTTPS):**
```
Environment validation failed: FRONTEND_URL must use HTTPS, found: http://sreemeditec.in
```
**Fix:** Change `http://` to `https://` in .env file

---

### **Step 5: Fix the Issue**

Based on the error message:
1. Edit `public_html/api/.env` file
2. Fix the specific issue
3. Save the file
4. Test: https://sreemeditec.in/api/health

---

## 🔍 Alternative: Check via File Manager

If you can't access Error Logs section:

1. Hostinger → **Files** → **File Manager**
2. Look for files named:
   - `error_log`
   - `php_error.log`
   - `error.log`
3. Usually in `public_html/` or `public_html/logs/`
4. Download and open in text editor
5. Search for "Environment validation failed"

---

## ✅ What the Error Log Shows

The error log will show ONE or MORE of these issues:

**Razorpay Issues:**
- ❌ `RAZORPAY_KEY_ID is not set`
- ❌ `RAZORPAY_KEY_SECRET is not set`
- ❌ `RAZORPAY_KEY_ID must use LIVE keys (rzp_live_)`

**Firebase Issues:**
- ❌ `FIREBASE_SERVICE_ACCOUNT is not set`
- ❌ `FIREBASE_SERVICE_ACCOUNT is not valid JSON`
- ❌ `FIREBASE_SERVICE_ACCOUNT missing required fields`

**URL Issues:**
- ❌ `FRONTEND_URL is not set`
- ❌ `PAYMENT_CALLBACK_URL is not set`
- ❌ `FRONTEND_URL must use HTTPS`
- ❌ `PAYMENT_CALLBACK_URL must use HTTPS`

**PHP Extension Issues:**
- ❌ `Required PHP extension 'curl' is not loaded`
- ❌ `Required PHP extension 'openssl' is not loaded`
- ❌ `Required PHP extension 'json' is not loaded`
- ❌ `Required PHP extension 'mbstring' is not loaded`

---

## 📝 Quick Reference

**Error Log Location:**
Hostinger hPanel → Files → Error Logs

**What to look for:**
"Environment validation failed:"

**How to fix:**
See FIX_SERVER_CONFIGURATION_ERROR.md for solutions

**Test after fixing:**
https://sreemeditec.in/api/health

---

**The error log will tell you EXACTLY what to fix!** 🎯
