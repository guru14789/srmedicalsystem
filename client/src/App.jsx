
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/FirebaseAuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import ScrollToTop from '@/components/ScrollToTop';

// Layout Components
import Navbar from '@/components/Navbar';

// Lazy Load Components
const Chatbot = React.lazy(() => import('@/components/Chatbot'));
const Footer = React.lazy(() => import('@/components/Footer'));

// Route Components
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import AdminRoute from '@/components/routes/AdminRoute';

// Lazy Load Pages
const Home = React.lazy(() => import('@/pages/Home'));
const About = React.lazy(() => import('@/pages/About'));
const Services = React.lazy(() => import('@/pages/Services'));
const Store = React.lazy(() => import('@/pages/Store'));
const ProductDetails = React.lazy(() => import('@/pages/ProductDetails'));
const Cart = React.lazy(() => import('@/pages/Cart'));
const Checkout = React.lazy(() => import('@/pages/Checkout'));
const PaymentSuccess = React.lazy(() => import('@/pages/PaymentSuccess'));
const PaymentFailed = React.lazy(() => import('@/pages/PaymentFailed'));
const OrderConfirmation = React.lazy(() => import('@/pages/OrderConfirmation'));
const OrderHistory = React.lazy(() => import('@/pages/OrderHistory'));
const TrackOrder = React.lazy(() => import('@/pages/TrackOrder'));
const OrderDetails = React.lazy(() => import('@/pages/OrderDetails'));
const Wishlist = React.lazy(() => import('@/pages/Wishlist'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const QuoteRequest = React.lazy(() => import('@/pages/QuoteRequest'));
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <ScrollToTop />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/store" element={<Store />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/quote" element={<QuoteRequest />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />

                      {/* Protected Routes */}
                      <Route path="/checkout" element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      } />
                      <Route path="/payment-success" element={
                        <ProtectedRoute>
                          <PaymentSuccess />
                        </ProtectedRoute>
                      } />
                      <Route path="/payment-failed" element={
                        <ProtectedRoute>
                          <PaymentFailed />
                        </ProtectedRoute>
                      } />
                      <Route path="/order-confirmation" element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      } />
                      <Route path="/order-history" element={
                        <ProtectedRoute>
                          <OrderHistory />
                        </ProtectedRoute>
                      } />
                      <Route path="/track-order/:orderId" element={
                        <ProtectedRoute>
                          <TrackOrder />
                        </ProtectedRoute>
                      } />
                      <Route path="/order-details/:orderId" element={
                        <ProtectedRoute>
                          <OrderDetails />
                        </ProtectedRoute>
                      } />
                      <Route path="/wishlist" element={
                        <ProtectedRoute>
                          <Wishlist />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />

                      {/* Admin Routes */}
                      <Route path="/admin/*" element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } />
                      <Route path="/admin-dashboard" element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } />
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <OrderHistory />
                        </ProtectedRoute>
                      } />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Suspense fallback={null}>
                  <Footer />
                </Suspense>
              </div>
              <Toaster />
              <Suspense fallback={null}>
                <Chatbot />
              </Suspense>
            </CartProvider>
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
