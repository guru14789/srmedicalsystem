import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get('error') || 'unknown';

  const errorMessages = {
    missing_data: 'Payment information is missing. Please try again.',
    verification_failed: 'Payment verification failed. If money was deducted, please contact support.',
    verification_error: 'An error occurred while verifying your payment.',
    configuration: 'Payment system configuration error. Please contact support.',
    unknown: 'An unexpected error occurred. Please try again.'
  };

  const errorMessage = errorMessages[error] || errorMessages.unknown;

  return (
    <>
      <Helmet>
        <title>Payment Failed - SR Medical System</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> If money was deducted from your account but the payment shows as failed, 
                please contact our support team with your transaction details.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-#1e1b4b transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Contact Support
              </button>
              <button
                onClick={() => navigate('/store')}
                className="w-full text-gray-600 px-6 py-2 hover:text-gray-800 transition-colors"
              >
                Back to Store
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PaymentFailed;
