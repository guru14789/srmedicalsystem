# Deployment Guide for Sreemeditec E-commerce

## Production Deployment Configuration

This application is now configured for **Autoscale deployment** on Replit, which provides:
- Automatic scaling based on traffic
- Cost-efficient pay-per-use model
- Zero-downtime deployments
- Built-in SSL/HTTPS

---

## How Deployment Works

### Build Process
When you click "Deploy", Replit will:

1. **Install Dependencies**
   ```bash
   cd client && npm install
   ```

2. **Build Frontend for Production**
   ```bash
   npm run build
   ```
   - Creates optimized production files in `client/dist/`
   - Minifies JavaScript and CSS
   - Bundles all React components
   - Total size: ~1.6 MB (compressed to ~436 KB)

### Run Process
The production server will:

1. **Start PHP Server on Port 5000**
   ```bash
   cd server && php -S 0.0.0.0:5000 production_server.php
   ```

2. **Serve Both Frontend and API**
   - Frontend: Serves built React app from `client/dist/`
   - API: Routes `/api/*` requests to PHP backend
   - SPA Routing: All other routes serve `index.html` for client-side routing

---

## Production Server Architecture

The `server/production_server.php` file handles:

✅ **API Requests** → Routes to `server/index.php`
- `/api/create-razorpay-order` - Payment order creation
- `/api/payment-callback` - Payment verification

✅ **Static Assets** → Serves from `client/dist/`
- JavaScript bundles
- CSS stylesheets
- Images and fonts
- Favicon

✅ **SPA Routes** → Serves `index.html` for React Router
- `/`, `/store`, `/product/:id`, etc.
- Client-side routing handled by React Router

---

## Environment Variables

The following secrets are automatically available in production:

### Firebase Configuration
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Razorpay Configuration
- `RAZORPAY_KEY_ID` (embedded in build)
- `RAZORPAY_KEY_SECRET` (backend only)

### Firebase Admin SDK
- `FIREBASE_SERVICE_ACCOUNT` (backend only)

**Note:** Environment variables prefixed with `VITE_` are embedded during the build process and become part of the frontend bundle.

---

## Deployment Steps

### 1. Pre-Deployment Checklist

✅ **Firestore Security Rules Deployed**
   - Go to Firebase Console → Firestore Database → Rules
   - Deploy the rules from `firestore.rules`

✅ **All Environment Secrets Configured**
   - Check Replit Secrets panel
   - Verify all required secrets are set

✅ **Test Build Locally**
   ```bash
   cd client && npm run build
   ```

### 2. Deploy to Production

1. Click the **"Deploy"** button in Replit
2. Wait for build to complete (~25-30 seconds)
3. Deployment will start automatically
4. Your app will be live at: `https://[your-repl-name].[username].repl.co`

### 3. Post-Deployment Verification

✅ **Test Registration**
   - Create a new account
   - Verify success message appears
   - Check user is logged in

✅ **Test Product Browsing**
   - Visit the store
   - View product details
   - Add items to cart

✅ **Test Checkout Flow**
   - Proceed to checkout
   - Complete payment with Razorpay
   - Verify order is created

✅ **Test Admin Dashboard**
   - Login as admin
   - Check orders, users, products
   - Verify all data displays correctly

---

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Review build logs for specific errors

### Deployment Shows 500 Error
- Check that `client/dist/` folder exists
- Verify `server/production_server.php` is present
- Review deployment logs

### API Not Working
- Verify environment secrets are set
- Check PHP error logs
- Ensure `server/index.php` router is working

### Frontend Not Loading
- Verify build completed successfully
- Check that `client/dist/index.html` exists
- Review browser console for errors

---

## Performance Optimization

### Current Build Size
- **JavaScript**: 1,631 KB → 435 KB (gzip)
- **CSS**: 60 KB → 10.79 KB (gzip)
- **HTML**: 5.03 KB → 1.56 KB (gzip)

### Autoscale Benefits
- **Automatic Scaling**: Handles traffic spikes automatically
- **Cost Efficiency**: Pay only for actual usage
- **Global CDN**: Fast delivery worldwide
- **Zero Downtime**: Rolling deployments with no interruption

---

## Development vs Production

### Development Mode
```bash
# Run development servers (separate frontend & backend)
npm run dev  # Frontend on port 5000
php -S 0.0.0.0:8000 index.php  # Backend on port 8000
```

### Production Mode
```bash
# Build frontend
cd client && npm run build

# Run production server (serves both)
cd server && php -S 0.0.0.0:5000 production_server.php
```

---

## Custom Domain Setup

To use your own domain (e.g., `sreemeditec.com`):

1. Deploy your app on Replit
2. Go to Replit deployment settings
3. Add your custom domain
4. Update DNS records as instructed
5. SSL certificate will be automatically provisioned

---

## Monitoring & Logs

### View Logs
- Deployment logs: Available in Replit deployment panel
- Runtime logs: Check console output in deployment
- Error tracking: Browser console for frontend errors

### Health Checks
The deployment platform automatically monitors:
- Server uptime
- Response times
- Error rates

---

## Support

If you encounter issues during deployment:

1. Check the deployment logs for specific error messages
2. Verify all environment variables are correctly set
3. Review the troubleshooting section above
4. Contact Replit support for platform-specific issues

---

## Summary

✅ **Deployment Type**: Autoscale (cost-efficient, auto-scaling)
✅ **Build Command**: `cd client && npm install && npm run build`
✅ **Run Command**: `cd server && php -S 0.0.0.0:5000 production_server.php`
✅ **Production Ready**: Optimized builds, proper routing, secure API handling
✅ **One-Click Deploy**: Just click Deploy and it works!

Your application is now ready for production deployment! 🚀
