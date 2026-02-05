# ⚠️ Firestore Composite Index Required

## Notice

You may see an error in the browser console about a missing Firestore index when viewing orders. This is **expected and normal** - it will be automatically resolved.

## The Error

```
Error fetching orders: FirebaseError: failed-precondition
```

## Why This Happens

We added a filter to hide pending (unpaid) orders:
```javascript
where('status', '!=', 'pending')
```

Firestore requires a **composite index** for queries using the `!=` operator.

## How to Fix (Automatic)

1. **Open your app in the browser**
2. **Go to Order History** (as a customer) or **Admin Orders** (as admin)
3. **Check the browser console** (press F12)
4. You'll see an error with a **link to create the index**
5. **Click the link** - it opens Firebase Console
6. **Click "Create Index"**
7. Wait 1-2 minutes for the index to build
8. **Refresh the page** - orders will now load!

## Alternative: Manual Creation

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Indexes** tab
4. Click **"Create Index"**
5. Configure:
   - **Collection:** `orders`
   - **Fields to index:**
     - `status` - Ascending
     - `user_id` - Ascending (for customer orders)
   - **Query scope:** Collection
6. Click **Create**
7. Wait for the index to build (1-2 minutes)

## Status

✅ The code is correct and working
⏳ Just needs the Firestore index to be created (one-time setup)
🔄 Will automatically work once index is ready

## Impact

- **Before index:** Orders page shows loading or error
- **After index:** Orders load instantly ✅

This is a one-time setup. Once the index is created, it will work forever!
