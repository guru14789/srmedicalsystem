# ⚡ Quick Fix for Payment Error

**Error:** Payment not working - "Unexpected token '<'" error

---

## 🎯 The Problem

Your backend API at `https://sreemeditec.in/api/` is missing the `.htaccess` file, so it's returning HTML error pages instead of JSON.

---

## ✅ The Fix (1 Minute)

### **Upload this file to Hostinger:**

**From:** `server/.htaccess`  
**To:** `public_html/api/.htaccess`

**Steps:**
1. Open Hostinger File Manager
2. Go to `public_html/api/`
3. Click "Upload"
4. Upload the file `server/.htaccess`
5. Rename it to `.htaccess` (if needed)

---

## 🧪 Test It Works

Visit: **https://sreemeditec.in/api/health**

**Should see:**
```json
{"status":"ok","message":"Razorpay API server is running"}
```

**If still broken:**
- Make sure `.env` file exists in `public_html/api/.env`
- Enable "Show Hidden Files" to see `.htaccess`
- Check PHP extensions enabled (curl, openssl)

---

## 📄 Need More Help?

See **FIX_PAYMENT_ERROR_HOSTINGER.md** for detailed troubleshooting.

---

**That's it! Upload the .htaccess file and payment will work!** ✅
