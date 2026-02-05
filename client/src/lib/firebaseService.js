import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

const getBackendUrl = () => {
  // Check if VITE_API_URL is set (production environment)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Auto-detect for Replit environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('replit') || hostname.includes('repl.co')) {
      return `https://${hostname}:8000/api`;
    }
  }

  // Fallback to localhost for local development
  return 'http://localhost:8000/api';
};

const PHP_BACKEND_URL = getBackendUrl();

export const firebaseService = {
  async getProducts(filters = {}) {
    try {
      const productsRef = collection(db, 'products');
      let q = query(productsRef);

      if (filters.category && filters.category !== 'all') {
        q = query(q, where('category', '==', filters.category));
      }

      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        _id: doc.id,
        ...doc.data()
      }));

      return { success: true, data: products };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, error: error.message };
    }
  },

  async getProduct(productId) {
    try {
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        return {
          success: true,
          data: { id: productDoc.id, _id: productDoc.id, ...productDoc.data() }
        };
      }
      return { success: false, error: 'Product not found' };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { success: false, error: error.message };
    }
  },

  async getProductBySlug(slug) {
    try {
      // Since we don't have a slug field field yet, we fetch all and filter.
      // Optimization: In production, add a 'slug' field to Firestore documents.
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);

      const product = snapshot.docs.find(doc => {
        const data = doc.data();
        const nameSlug = data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        return nameSlug === slug;
      });

      if (product) {
        return {
          success: true,
          data: { id: product.id, _id: product.id, ...product.data() }
        };
      }
      return { success: false, error: 'Product not found' };
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return { success: false, error: error.message };
    }
  },

  async createProduct(productData) {
    try {
      const productsRef = collection(db, 'products');
      const docRef = await addDoc(productsRef, {
        ...productData,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      });
      return { success: true, data: { id: docRef.id } };
    } catch (error) {
      console.error('Error creating product:', error);
      return { success: false, error: error.message };
    }
  },

  async updateProduct(productId, productData) {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...productData,
        updated_at: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }
  },

  async getOrders(userId) {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      // Filter out pending orders in JavaScript to avoid Firestore index requirement
      const orders = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at?.toDate?.() || new Date(),
          updated_at: doc.data().updated_at?.toDate?.() || new Date()
        }))
        .filter(order => order.status !== 'pending');
      return { success: true, data: orders };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { success: false, error: error.message };
    }
  },

  async getAllOrders() {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      // Filter out pending orders in JavaScript to avoid Firestore index requirement
      const orders = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at?.toDate?.() || new Date(),
          updated_at: doc.data().updated_at?.toDate?.() || new Date()
        }))
        .filter(order => order.status !== 'pending');
      return { success: true, data: orders };
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return { success: false, error: error.message };
    }
  },

  async createOrder(orderData) {
    try {
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, {
        ...orderData,
        status: 'pending',
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      });
      return { success: true, order_id: docRef.id, data: { id: docRef.id } };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }
  },

  async createPaymentOrder(data) {
    try {
      const orderId = data.order_id;

      const orderDoc = await getDoc(doc(db, 'orders', orderId));

      if (!orderDoc.exists()) {
        return { success: false, error: 'Order not found' };
      }

      const orderData = orderDoc.data();
      const amount = orderData.total_amount;

      const response = await fetch(`${PHP_BACKEND_URL}/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          amount: amount,
          customer_name: data.customer_name || orderData.customer_name,
          customer_email: data.customer_email || orderData.email,
          customer_contact: data.customer_contact || orderData.phone
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create Razorpay order');
      }

      const paymentsRef = collection(db, 'payments');
      await addDoc(paymentsRef, {
        order_id: orderId,
        user_id: orderData.user_id,
        razorpay_order_id: result.razorpay_order_id,
        amount: result.amount,
        currency: result.currency,
        status: 'created',
        created_at: Timestamp.now()
      });

      return {
        success: true,
        razorpay_order_id: result.razorpay_order_id,
        amount: result.amount,
        currency: result.currency,
        razorpay_key_id: result.razorpay_key_id,
        callback_url: result.callback_url,
        prefill: result.prefill
      };
    } catch (error) {
      console.error('Error creating payment order:', error);
      return { success: false, error: error.message };
    }
  },

  async verifyPayment(paymentData) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

      const response = await fetch(`${PHP_BACKEND_URL}/verify-razorpay-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.verified) {
        throw new Error(result.error || 'Payment verification failed');
      }

      return { success: true };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { success: false, error: error.message };
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: status,
        updated_at: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  },

  async getOrderById(orderId) {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        return {
          success: true,
          data: {
            id: orderDoc.id,
            ...orderDoc.data(),
            created_at: orderDoc.data().created_at?.toDate?.() || new Date(),
            updated_at: orderDoc.data().updated_at?.toDate?.() || new Date()
          }
        };
      }
      return { success: false, error: 'Order not found' };
    } catch (error) {
      console.error('Error fetching order:', error);
      return { success: false, error: error.message };
    }
  },

  async submitFeedback(feedbackData) {
    try {
      const feedbackRef = collection(db, 'feedback');
      await addDoc(feedbackRef, {
        ...feedbackData,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      });

      if (feedbackData.order_id) {
        const orderRef = doc(db, 'orders', feedbackData.order_id);
        await updateDoc(orderRef, {
          feedback_submitted: true,
          rating: feedbackData.rating,
          updated_at: Timestamp.now()
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: error.message };
    }
  },

  async getOrderFeedback(orderId) {
    try {
      const feedbackRef = collection(db, 'feedback');
      const q = query(feedbackRef, where('order_id', '==', orderId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          success: true,
          data: {
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate?.() || new Date()
          }
        };
      }
      return { success: false, error: 'No feedback found' };
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return { success: false, error: error.message };
    }
  },

  async getAllFeedback() {
    try {
      const feedbackRef = collection(db, 'feedback');
      const snapshot = await getDocs(feedbackRef);
      const feedback = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.() || new Date()
      })).sort((a, b) => b.created_at - a.created_at);
      return { success: true, data: feedback };
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return { success: false, error: error.message };
    }
  },

  async getAllUsers() {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
      return { success: true, data: users };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, error: error.message };
    }
  },

  async updateUserRole(userId, role) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: role,
        updated_at: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { success: false, error: error.message };
    }
  },

  async getDashboardStats() {
    try {
      const ordersRef = collection(db, 'orders');
      const ordersQuery = query(ordersRef, where('status', '!=', 'pending'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const productsSnapshot = await getDocs(collection(db, 'products'));

      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const totalRevenue = orders.reduce((sum, order) => {
        const amount = parseFloat(order.total_amount || order.totalAmount || 0);
        return sum + amount;
      }, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayRevenue = orders.reduce((sum, order) => {
        const orderDate = order.created_at?.toDate?.() || new Date(order.created_at);
        if (orderDate >= today) {
          const amount = parseFloat(order.total_amount || order.totalAmount || 0);
          return sum + amount;
        }
        return sum;
      }, 0);

      const stats = {
        total_revenue: totalRevenue,
        today_revenue: todayRevenue,
        total_orders: orders.length,
        total_users: usersSnapshot.size,
        total_products: productsSnapshot.size,
        recent_orders: orders.slice(0, 5).map(order => ({
          id: order.id,
          customer_name: order.customer_name || 'N/A',
          total_amount: order.total_amount || 0,
          status: order.status || 'confirmed',
          created_at: order.created_at
        }))
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { success: false, error: error.message };
    }
  },

  async uploadImage(file, path) {
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return { success: true, url };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, error: error.message };
    }
  },

  async createQuote(quoteData) {
    try {
      const quotesRef = collection(db, 'quotes');
      const docRef = await addDoc(quotesRef, {
        ...quoteData,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        status: 'new'
      });
      return { success: true, data: { id: docRef.id } };
    } catch (error) {
      console.error('Error creating quote:', error);
      return { success: false, error: error.message };
    }
  },

  async createContact(contactData) {
    try {
      const contactsRef = collection(db, 'contacts');
      const docRef = await addDoc(contactsRef, {
        ...contactData,
        created_at: Timestamp.now(),
        status: 'new'
      });
      return { success: true, data: { id: docRef.id } };
    } catch (error) {
      console.error('Error creating contact:', error);
      return { success: false, error: error.message };
    }
  },

  async getAllContacts() {
    try {
      const contactsRef = collection(db, 'contacts');
      const q = query(contactsRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const contacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.() || new Date()
      }));
      return { success: true, data: contacts };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return { success: false, error: error.message };
    }
  },

  async getAllQuotes() {
    try {
      const quotesRef = collection(db, 'quotes');
      const q = query(quotesRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const quotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.() || new Date()
      }));
      return { success: true, data: quotes };
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return { success: false, error: error.message };
    }
  },

  async updateContactStatus(contactId, status) {
    try {
      const contactRef = doc(db, 'contacts', contactId);
      await updateDoc(contactRef, { status, updated_at: Timestamp.now() });
      return { success: true };
    } catch (error) {
      console.error('Error updating contact status:', error);
      return { success: false, error: error.message };
    }
  },

  async updateQuoteStatus(quoteId, status) {
    try {
      const quoteRef = doc(db, 'quotes', quoteId);
      await updateDoc(quoteRef, { status, updated_at: Timestamp.now() });
      return { success: true };
    } catch (error) {
      console.error('Error updating quote status:', error);
      return { success: false, error: error.message };
    }
  },

  async getWishlist(userId) {
    try {
      const wishlistRef = collection(db, 'wishlists');
      const q = query(wishlistRef, where('user_id', '==', userId));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: items };
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return { success: false, error: error.message };
    }
  },

  async addToWishlist(userId, product) {
    try {
      const wishlistRef = collection(db, 'wishlists');
      const q = query(wishlistRef, where('user_id', '==', userId), where('product_id', '==', product.id));
      const existing = await getDocs(q);

      if (!existing.empty) {
        return { success: false, error: 'Already in wishlist' };
      }

      await addDoc(wishlistRef, {
        user_id: userId,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image,
        created_at: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    }
  },

  async removeFromWishlist(userId, productId) {
    try {
      const wishlistRef = collection(db, 'wishlists');
      const q = query(wishlistRef, where('user_id', '==', userId), where('product_id', '==', productId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        await deleteDoc(snapshot.docs[0].ref);
      }
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message };
    }
  },

  async addCartHistory(userId, cartItem) {
    try {
      const historyRef = collection(db, 'cart_history');
      await addDoc(historyRef, {
        user_id: userId,
        product_id: cartItem.id,
        product_name: cartItem.name,
        product_price: cartItem.price,
        quantity: cartItem.quantity,
        created_at: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding cart history:', error);
      return { success: false, error: error.message };
    }
  },

  async getShippingCosts() {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'shipping_costs'));
      if (settingsDoc.exists()) {
        return { success: true, data: settingsDoc.data() };
      }
      return { success: true, data: {} };
    } catch (error) {
      console.error('Error fetching shipping costs:', error);
      return { success: false, error: error.message };
    }
  },

  async updateShippingCosts(costs) {
    try {
      const settingsRef = doc(db, 'settings', 'shipping_costs');
      await setDoc(settingsRef, {
        ...costs,
        updated_at: Timestamp.now()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating shipping costs:', error);
      return { success: false, error: error.message };
    }
  },

  async getShippingRates() {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'shipping_rates'));
      if (settingsDoc.exists()) {
        return { success: true, data: settingsDoc.data() };
      }
      // Return null if not found, shipping.js will use defaults
      return { success: true, data: null };
    } catch (error) {
      console.error('Error fetching shipping rates:', error);
      return { success: false, error: error.message };
    }
  },

  async updateShippingRates(rates) {
    try {
      const settingsRef = doc(db, 'settings', 'shipping_rates');
      await setDoc(settingsRef, {
        ...rates,
        updated_at: Timestamp.now()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating shipping rates:', error);
      return { success: false, error: error.message };
    }
  }
};
