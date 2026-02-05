# ⚡ QUICK FIX - Upload This One File!

Your payment error will be fixed by uploading **ONE FILE**.

---

## 📤 What to Upload

**File:** `server/index.php`  
**Upload to:** `public_html/api/index.php` on Hostinger

---

## 🚀 Steps (2 Minutes)

1. **Download** the file `server/index.php` to your computer
2. **Login** to Hostinger File Manager
3. **Go to** `public_html/api/`
4. **Delete** the old `index.php` (or rename to `index.php.old`)
5. **Upload** the new `server/index.php`
6. **Test:** Visit https://sreemeditec.in/api/health

---

## ✅ Expected Result

**Before:**
```json
{"error":"Server configuration error"}
```

**After:**
```json
{"status":"ok","message":"Razorpay API server is running"}
```

**Then payment will work!** 🎉

---

**This file contains code to read your .env file - that's what was missing!**
