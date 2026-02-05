import { firebaseService } from '@/lib/firebaseService';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';
import { validateEmail, validatePhone, validatePincode, validateAddress, validateState, validateName, validateCity } from '@/lib/validations';
import { calculateCartShippingCost } from '@/lib/shipping';
import ContactInfo from '@/components/checkout/ContactInfo';
import ShippingInfo from '@/components/checkout/ShippingInfo';
import OrderSummary from '@/components/checkout/OrderSummary';

const Checkout = () => {
  const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const paymentFormRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  useEffect(() => {
    if (formData.state && cartItems.length > 0) {
      loadShippingCost(formData.state);
    }
  }, [formData.state, cartItems]);

  const loadShippingCost = async (state) => {
    try {
      const cost = await calculateCartShippingCost(cartItems, state);
      setShippingCost(cost);
    } catch (error) {
      console.error('Failed to load shipping cost:', error);
      setShippingCost(0);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        address: user.address || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing) {
      navigate('/store');
    }
  }, [cartItems, navigate, isProcessing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to place an order.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      toast({
        title: "Invalid Email",
        description: emailValidation.error,
        variant: "destructive",
      });
      return;
    }

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      toast({
        title: "Invalid Phone Number",
        description: phoneValidation.error,
        variant: "destructive",
      });
      return;
    }

    const nameValidation = validateName(formData.firstName);
    if (!nameValidation.valid) {
      toast({
        title: "Invalid Name",
        description: nameValidation.error,
        variant: "destructive",
      });
      return;
    }

    const addressValidation = validateAddress(formData.address);
    if (!addressValidation.valid) {
      toast({
        title: "Invalid Address",
        description: addressValidation.error,
        variant: "destructive",
      });
      return;
    }

    const cityValidation = validateCity(formData.city);
    if (!cityValidation.valid) {
      toast({
        title: "Invalid City",
        description: cityValidation.error,
        variant: "destructive",
      });
      return;
    }

    const stateValidation = validateState(formData.state);
    if (!stateValidation.valid) {
      toast({
        title: "Invalid State",
        description: stateValidation.error,
        variant: "destructive",
      });
      return;
    }

    const pincodeValidation = validatePincode(formData.zipCode, formData.state);
    if (!pincodeValidation.valid) {
      toast({
        title: "Invalid Pincode",
        description: pincodeValidation.error,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    await initiatePayment();
  };

  const parsePrice = (price) => {
    const parsed = Number.parseFloat(price);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const calculateTotalGst = () => {
    return cartItems.reduce((total, item) => {
      const price = parsePrice(item.price);
      const itemTotal = price * item.quantity;
      const gstPercentage = item.gst_percentage !== undefined ? parsePrice(item.gst_percentage) : 18;
      const finalGstPercentage = Number.isNaN(gstPercentage) ? 18 : gstPercentage;
      const itemGst = itemTotal * (finalGstPercentage / 100);
      return total + itemGst;
    }, 0);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parsePrice(item.price);
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const totalGst = calculateTotalGst();
    const rawTotal = subtotal + totalGst + shippingCost;
    return Math.round(rawTotal * 100) / 100;
  };

  const initiatePayment = async () => {
    try {
      const subtotal = Math.round(calculateSubtotal() * 100) / 100;
      const totalGst = Math.round(calculateTotalGst() * 100) / 100;
      const grandTotal = calculateGrandTotal();

      const orderData = {
        user_id: user.uid,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        items: cartItems,
        subtotal: subtotal,
        gst_amount: totalGst,
        shipping_cost: Math.round(shippingCost * 100) / 100,
        total_amount: grandTotal,
        shipping_address: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.zipCode,
          phone: formData.phone
        },
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString()
      };

      const orderResponse = await firebaseService.createOrder(orderData);

      if (!orderResponse.success) {
        throw new Error(orderResponse.error || 'Failed to create order');
      }

      const paymentOrderResponse = await firebaseService.createPaymentOrder({
        amount: grandTotal,
        order_id: orderResponse.order_id,
        user_id: user.uid,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_contact: formData.phone
      });

      if (!paymentOrderResponse.success) {
        throw new Error(paymentOrderResponse.error || 'Failed to create payment order');
      }

      redirectToRazorpay(paymentOrderResponse);

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Could not initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const redirectToRazorpay = (paymentData) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://api.razorpay.com/v1/checkout/embedded';

    const fields = {
      key_id: paymentData.razorpay_key_id,
      amount: paymentData.amount * 100,
      currency: paymentData.currency,
      order_id: paymentData.razorpay_order_id,
      name: 'SR Medical System',
      description: 'Medical Equipment Purchase',
      callback_url: paymentData.callback_url,
      cancel_url: `${window.location.origin}/checkout`,
      prefill: {
        name: paymentData.prefill.name,
        email: paymentData.prefill.email,
        contact: paymentData.prefill.contact
      },
      theme: {
        color: '#373086'
      },
      modal: {
        confirm_close: true
      }
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = `${key}[${subKey}]`;
          input.value = subValue;
          form.appendChild(input);
        });
      } else {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      <Helmet>
        <title>Checkout - Complete Your Order | SR Medical System</title>
        <meta name="description" content="Complete your medical equipment purchase with secure checkout and fast delivery options." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Complete your order securely</p>
            </div>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <div className="bg-white rounded-lg p-8 text-center max-w-md">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Your Order</h3>
                  <p className="text-gray-600">Please wait while we redirect you to the secure payment gateway...</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
                <div className="space-y-5 sm:space-y-6">
                  <ContactInfo formData={formData} handleInputChange={handleInputChange} />
                  <ShippingInfo formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} />
                </div>

                <div className="lg:sticky lg:top-24">
                  <OrderSummary cartItems={cartItems} getCartTotal={getCartTotal} isProcessing={isProcessing} shippingCost={shippingCost} />
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
