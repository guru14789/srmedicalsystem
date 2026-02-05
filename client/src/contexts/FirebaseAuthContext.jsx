import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              ...userData
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
              role: 'user'
            });
          }
        } catch (error) {
          console.log('Could not fetch user document, using auth data only:', error.message);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            role: 'user'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (userData) => {
    try {
      const { email, password, name, phone, address } = userData;
      
      if (!email || !password || !name) {
        return { 
          success: false, 
          error: 'Please provide all required fields (name, email, and password)' 
        };
      }

      if (password.length < 6) {
        return { 
          success: false, 
          error: 'Password must be at least 6 characters long' 
        };
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateFirebaseProfile(firebaseUser, {
        displayName: name
      });

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          user_id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: email,
          name: name,
          username: name,
          phone: phone || '',
          address: address || '',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        });
        console.log('User profile created in Firestore successfully');
      } catch (firestoreError) {
        console.warn('Could not create Firestore user document:', firestoreError.code, '- User can still login with Firebase Auth');
      }

      toast({
        title: "Account created successfully! 🎉",
        description: `Welcome to SR Medical System, ${name}!`,
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password with at least 6 characters.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('No user logged in');

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...profileData,
        updated_at: new Date()
      });

      if (profileData.username) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: profileData.username
        });
      }

      setUser(prev => ({ ...prev, ...profileData }));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user || !auth.currentUser) throw new Error('No user logged in');

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });

      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      toast({
        title: "Password change failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loading,
    isAdmin: user ? user.role === 'admin' : false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
