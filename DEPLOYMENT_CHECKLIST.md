# ✅ Deployment Checklist - Sree Meditec E-Commerce

Use this checklist to ensure your application is properly configured before deploying to production.

## 📋 Pre-Deployment Checklist

### 🔥 Firebase Configuration

- [ ] Firebase project created
- [ ] Firestore database initialized
- [ ] Firebase Authentication enabled
- [ ] Firebase Storage bucket created
- [ ] Firebase service account JSON downloaded
- [ ] Firestore security rules deployed (from `firestore.rules` file)
- [ ] Firebase security rules tested and working
- [ ] Admin user account created and role set to "admin"

**How to verify:**
- Login to Firebase Console
- Check Firestore has collections: users, products, orders, payments
- Test authentication (login/register)
- Try uploading an image to Storage

---

### 💳 Razorpay Configuration

- [ ] Razorpay account created
- [ ] Production/Live API keys generated
- [ ] Test payment completed successfully in test mode
- [ ] Payment webhook URL configured (if using webhooks)
- [ ] Payment callback URL is accessible
- [ ] Live mode activated (after testing)

**Razorpay Keys:**
- Development: `rzp_test_XXXXXX` (Test Key ID)
- Production: `rzp_live_XXXXXX` (Live Key ID)

**How to verify:**
- Login to Razorpay Dashboard
- Go to Settings > API Keys
- Generate and save both Test and Live keys
- Test a payment in test mode first

---

### 🔐 Environment Variables

#### Frontend (.env in client/)

- [ ] `VITE_FIREBASE_API_KEY` - Set correctly
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` - Set correctly
- [ ] `VITE_FIREBASE_PROJECT_ID` - Set correctly
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` - Set correctly
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` - Set correctly
- [ ] `VITE_FIREBASE_APP_ID` - Set correctly
- [ ] `RAZORPAY_KEY_ID` - Using **LIVE** key (rzp_live_)

#### Backend (.env in server/)

- [ ] `FIREBASE_SERVICE_ACCOUNT` - Complete JSON as single line
- [ ] `RAZORPAY_KEY_ID` - Using **LIVE** key (rzp_live_)
- [ ] `RAZORPAY_KEY_SECRET` - Using **LIVE** secret key
- [ ] `FRONTEND_URL` - Set to production domain (https://yourdomain.com)
- [ ] `PAYMENT_CALLBACK_URL` - Set correctly (https://yourdomain.com/api/payment-callback)

**Critical:**
- [ ] All environment variables use **production/live** credentials
- [ ] No test/development credentials in production
- [ ] `.env` files are NOT committed to version control
- [ ] `.env.example` files are up to date

---

### 🔒 Security

- [ ] HTTPS/SSL certificate installed and active
- [ ] HTTPS redirect enabled (HTTP → HTTPS)
- [ ] CORS configured correctly (restrict origins in production)
- [ ] `.env` files protected from web access
- [ ] Firebase service account JSON secured
- [ ] Razorpay secret key never exposed to frontend
- [ ] Firestore security rules prevent unauthorized access
- [ ] Admin routes require authentication and admin role

**Security Files to Check:**
- [ ] `server/.htaccess` - Blocks access to `.env` file
- [ ] `server/api/*.php` - CORS headers restrict to your domain only
- [ ] `firestore.rules` - Users can only access their own data

---

### 🏗️ Build & Files

#### Frontend Build

- [ ] `npm install` completed successfully
- [ ] `npm run build` completed without errors
- [ ] `dist/` folder created with all files
- [ ] `dist/index.html` exists
- [ ] `dist/assets/` folder contains bundled JS and CSS
- [ ] No errors in build output
- [ ] Build size is reasonable (<5MB total)

#### Backend Files

- [ ] `composer install` completed successfully
- [ ] `vendor/` folder exists with all dependencies
- [ ] All PHP files are uploaded
- [ ] `config/` directory with firebase.php exists
- [ ] `api/` directory with all endpoint files exists

**Files to Upload:**
```
Frontend (client/dist/*):
- index.html
- assets/
- attached_assets/ (if exists)

Backend (server/*):
- api/
- config/
- vendor/
- .htaccess (if using)
```

---

### 🌐 Hostinger/Server Configuration

- [ ] Hosting account active
- [ ] Domain pointed to hosting server
- [ ] DNS propagated (check with DNS checker)
- [ ] PHP version 8.0+ enabled
- [ ] Required PHP extensions enabled:
  - [ ] curl
  - [ ] json
  - [ ] mbstring
  - [ ] openssl
  - [ ] xml
- [ ] File permissions set correctly (755 for directories, 644 for files)
- [ ] `.htaccess` files uploaded and active
- [ ] Environment variables configured in hosting

**PHP Extensions Check:**
```php
<?php
phpinfo(); // Upload to check PHP configuration
```

---

### 🧪 Testing

#### Basic Functionality

- [ ] Website loads at your domain
- [ ] All pages accessible (Home, About, Store, Contact)
- [ ] Navigation works correctly
- [ ] Images and assets load properly
- [ ] Chatbot appears in bottom-right corner
- [ ] Responsive design works on mobile

#### Authentication

- [ ] User registration works
- [ ] User login works
- [ ] Password reset works
- [ ] Logout works
- [ ] Admin login redirects to admin dashboard
- [ ] Customer login redirects to home/profile

#### E-Commerce Features

- [ ] Products load from Firebase
- [ ] Product search works
- [ ] Category filtering works
- [ ] Product details page shows correctly
- [ ] Add to cart works
- [ ] Cart page displays items
- [ ] Update cart quantities works
- [ ] Remove from cart works
- [ ] Wishlist add/remove works
- [ ] Wishlist page displays saved items

#### Checkout & Payment

- [ ] Checkout page loads with cart items
- [ ] Shipping form validation works
- [ ] State selection updates shipping cost
- [ ] Order summary shows correct totals:
  - [ ] Subtotal (products only)
  - [ ] GST (per product calculation)
  - [ ] Shipping cost (based on state)
  - [ ] Grand total (all included)
- [ ] "Proceed to Payment" creates Razorpay order
- [ ] Razorpay payment modal opens
- [ ] Payment with test card succeeds (TEST MODE ONLY)
- [ ] Payment callback redirects correctly
- [ ] Order created in Firebase
- [ ] Payment record created in Firebase
- [ ] Order appears in Order History
- [ ] Order details page shows all information

**Test Payment (Production - Real Money!):**
- [ ] Test with real card (small amount first)
- [ ] Verify payment received in Razorpay Dashboard
- [ ] Order status updates correctly
- [ ] Email notifications sent (if configured)

#### Admin Features

- [ ] Admin dashboard accessible
- [ ] User management works
- [ ] Product CRUD operations work:
  - [ ] Create product
  - [ ] Edit product (including GST %)
  - [ ] Delete product
  - [ ] Upload product image
- [ ] Order management works
- [ ] View customer feedback
- [ ] Shipping cost configuration works
- [ ] Analytics display correctly

---

### 📧 Optional: Email Configuration

- [ ] Email service configured (SendGrid, SMTP, etc.)
- [ ] Order confirmation emails sent
- [ ] Password reset emails sent
- [ ] Welcome emails sent
- [ ] Email templates customized

---

### 📊 Monitoring & Analytics

- [ ] Google Analytics added (if desired)
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Server error logs accessible
- [ ] Firebase usage monitored
- [ ] Razorpay dashboard monitored

---

### 🔄 Backup & Recovery

- [ ] Firebase Firestore backup strategy planned
- [ ] Regular database exports scheduled
- [ ] Code repository backed up (Git)
- [ ] Server files backed up
- [ ] Recovery plan documented

---

### 📱 Performance

- [ ] Page load time < 3 seconds
- [ ] Images optimized (compressed)
- [ ] CSS/JS minified (Vite does this automatically)
- [ ] Lazy loading enabled for images
- [ ] Browser caching configured
- [ ] CDN considered for static assets

---

### 🎨 Final Checks

- [ ] Company name and branding correct
- [ ] Contact information correct
- [ ] About Us page content accurate
- [ ] Terms of Service page complete
- [ ] Privacy Policy page complete
- [ ] Refund Policy page complete
- [ ] Shipping Policy page complete
- [ ] Footer links work
- [ ] Social media links correct (if any)
- [ ] Favicon displays correctly
- [ ] Meta tags for SEO set

---

## 🚀 Deployment Steps Summary

1. **Prepare Environment**
   - Set all environment variables to LIVE/PRODUCTION values
   - Deploy Firebase security rules

2. **Build Frontend**
   ```bash
   cd client
   npm install
   npm run build
   ```

3. **Prepare Backend**
   ```bash
   cd server
   composer install
   ```

4. **Upload to Hostinger**
   - Upload `client/dist/*` to `public_html/`
   - Upload `server/*` to `public_html/api/`
   - Configure environment variables

5. **Enable HTTPS**
   - Install SSL certificate
   - Force HTTPS redirect

6. **Test Everything**
   - Go through entire testing checklist above
   - Test with real payment (small amount)

7. **Monitor**
   - Check error logs
   - Monitor Firebase usage
   - Check Razorpay dashboard

---

## ⚠️ Critical Warnings

### BEFORE Going Live:

1. **Switch to LIVE Razorpay Keys**
   - Replace `rzp_test_` with `rzp_live_`
   - Update both frontend and backend `.env` files

2. **Test Payment Flow with Real Card**
   - Use a small amount (₹10) first
   - Verify money is received
   - Check order created correctly

3. **Restrict CORS**
   - Update `server/api/*.php` files
   - Change `Access-Control-Allow-Origin: *` to your domain

4. **Secure Environment Variables**
   - Never commit `.env` to Git
   - Use secure storage on server
   - Protect with `.htaccess`

5. **Firebase Firestore Rules**
   - MUST be deployed or app won't work
   - Test all database operations

---

## 🎉 Post-Deployment

After successful deployment:

- [ ] Announce launch to users
- [ ] Share website link
- [ ] Monitor for first few orders
- [ ] Be ready to fix issues quickly
- [ ] Collect user feedback
- [ ] Plan future updates

---

## 📞 Emergency Contacts

**If something goes wrong:**

- Firebase Support: https://firebase.google.com/support
- Razorpay Support: https://razorpay.com/support
- Hostinger Support: Your hosting panel
- Developer: Check error logs and Firebase Console

---

## ✅ Final Sign-Off

I confirm that:
- [ ] All checklist items above are completed
- [ ] Application has been thoroughly tested
- [ ] All credentials are LIVE/PRODUCTION
- [ ] Backups are in place
- [ ] I'm ready to deploy to production

**Date:** _______________  
**Signed:** _______________

---

**Good luck with your deployment! 🚀**
