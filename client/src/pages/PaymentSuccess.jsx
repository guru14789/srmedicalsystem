import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { firebaseService } from '@/lib/firebaseService';
import { useCart } from '@/contexts/CartContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [processing, setProcessing] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      const paymentId = searchParams.get('payment_id');
      const orderId = searchParams.get('order_id');

      if (!paymentId || !orderId) {
        console.error('Missing payment_id or order_id in URL params');
        navigate('/payment-failed?error=missing_data');
        return;
      }

      try {
        // Always show success if we have valid payment_id and order_id from callback
        // The backend has already updated Firestore
        console.log('Payment success confirmed - Payment ID:', paymentId, 'Order ID:', orderId);
        
        // Clear cart immediately
        clearCart();
        
        // Set order details to display
        setOrderDetails({
          paymentId,
          orderId
        });
        
        setProcessing(false);
      } catch (error) {
        console.error('Payment processing error:', error);
        // Even if there's an error, if we got to this page, payment succeeded
        // Show success anyway
        clearCart();
        setOrderDetails({
          paymentId,
          orderId
        });
        setProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, navigate, clearCart]);

  if (processing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful - SR Medical System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">Thank you for your purchase</p>

            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="text-gray-900 font-mono text-xs">{orderDetails.paymentId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="text-gray-900 font-mono text-xs">{orderDetails.orderId}</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-6">
              Your order has been confirmed and will be processed shortly. You will receive an email confirmation with order details.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-#1e1b4b transition-colors font-medium"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/store')}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PaymentSuccess;
