# How to Deploy Firestore Security Rules

## CRITICAL: You must deploy these security rules to Firebase Console for registration to work properly!

The registration page error "permission-denied" happens because Firestore security rules haven't been deployed yet.

### Quick Steps to Deploy Rules:

1. **Go to Firebase Console**: https://console.firebase.google.com/

2. **Select your project**: Click on your Sreemeditec project

3. **Navigate to Firestore Database**:
   - Click on "Firestore Database" in the left sidebar
   - Click on the "Rules" tab at the top

4. **Copy and paste the rules**:
   - Open the `firestore.rules` file from this project
   - Copy ALL the content
   - Paste it into the Firebase Console Rules editor

5. **Publish the rules**:
   - Click the blue "Publish" button
   - Wait for confirmation message

### That's it! 

Once the rules are deployed, registration will work perfectly with:
- ✅ Clear success message: "Account created successfully! 🎉"
- ✅ Proper error messages for email already in use
- ✅ User data saved correctly in Firestore
- ✅ Automatic login after registration

---

## What was fixed:

1. **Security Rules**: Updated to accept `role: 'user'` (was only accepting 'customer')
2. **Success Message**: Shows "Account created successfully! 🎉 Welcome to Sreemeditec, [Name]!"
3. **Error Handling**: Clear messages for all Firebase errors:
   - Email already in use
   - Invalid email
   - Weak password
   - Network errors
   - Missing required fields

## Test After Deployment:

Try creating a new account - you should see the success message and be automatically logged in!
