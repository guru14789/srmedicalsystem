import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Hi! I\'m here to help you learn about SR Medical System. Ask me about our products, policies, or company!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const knowledgeBase = {
    'about us': {
      keywords: ['about', 'company', 'who are you', 'sree meditec', 'what do you do'],
      response: '🏥 **About SR Medical System:**\n\nWe are a leading medical equipment supplier based in Chennai, India. We specialize in providing high-quality medical devices, diagnostic equipment, and healthcare solutions to hospitals, clinics, and healthcare professionals across the country.\n\nOur mission is to make advanced medical technology accessible and affordable.'
    },
    'products': {
      keywords: ['products', 'what do you sell', 'equipment', 'devices', 'catalog', 'items'],
      response: '🩺 **Our Products:**\n\nWe offer a wide range of medical equipment including:\n• Diagnostic devices (BP monitors, thermometers, pulse oximeters)\n• Surgical instruments\n• Patient monitoring systems\n• Laboratory equipment\n• Hospital furniture\n• Personal protective equipment (PPE)\n\nVisit our Store page to browse our complete catalog!'
    },
    'contact': {
      keywords: ['contact', 'phone', 'email', 'address', 'location', 'reach', 'call'],
      response: '📞 **Contact Information:**\n\n**Address:** No:18/2, Rajajinai Koli Street, Rajakipakkam, Chennai-73 Tamilnadu, India.\n\n**Email:** sr medical system@gmail.com\n\n**Phone:** +91 9884818398\n\n**Business Hours:** Monday - Saturday, 9:00 AM - 6:00 PM\n\nYou can also use our Contact Form on the Contact page!'
    },
    'shipping': {
      keywords: ['shipping', 'delivery', 'ship', 'courier', 'dispatch', 'how long'],
      response: '🚚 **Shipping & Delivery:**\n\n• We ship across all states in India\n• Shipping costs vary by location (calculated at checkout)\n• Most orders are dispatched within 1-2 business days\n• Delivery typically takes 3-7 business days depending on your location\n• You can track your order after purchase\n• Free shipping available on orders above ₹10,000 (select states)'
    },
    'payment': {
      keywords: ['payment', 'pay', 'razorpay', 'credit card', 'debit', 'upi', 'netbanking'],
      response: '💳 **Payment Methods:**\n\nWe accept secure payments through Razorpay:\n• Credit/Debit Cards (Visa, Mastercard, RuPay)\n• UPI (Google Pay, PhonePe, Paytm)\n• Net Banking\n• Wallets (Paytm, PhonePe, etc.)\n\nAll payments are 100% secure and encrypted. GST is included in product prices.'
    },
    'refund': {
      keywords: ['refund', 'return', 'money back', 'cancel', 'exchange'],
      response: '↩️ **Refund & Return Policy:**\n\n• 7-day return policy for eligible products\n• Product must be unused and in original packaging\n• Medical equipment must have intact seals\n• Refunds processed within 7-10 business days\n• Some products are non-returnable for hygiene reasons\n• Contact us within 48 hours of delivery for any issues\n\nPlease check product descriptions for specific return eligibility.'
    },
    'privacy': {
      keywords: ['privacy', 'data', 'personal information', 'secure', 'privacy policy'],
      response: '🔒 **Privacy & Security:**\n\n• Your personal data is encrypted and secure\n• We never share your information with third parties\n• Payment details are processed securely through Razorpay\n• Your data is used only for order processing and customer service\n• You can request data deletion anytime\n• We comply with Indian data protection regulations\n\nYour privacy is our priority!'
    },
    'terms': {
      keywords: ['terms', 'conditions', 'terms of service', 'legal', 'agreement'],
      response: '📋 **Terms of Service:**\n\n• By using our website, you agree to our terms and conditions\n• All products are genuine and come with manufacturer warranties\n• Prices are subject to change without notice\n• Product availability may vary\n• Medical advice should be sought from qualified professionals\n• We reserve the right to refuse service\n\nFor complete terms, please visit our Terms & Conditions page.'
    },
    'warranty': {
      keywords: ['warranty', 'guarantee', 'defect', 'broken', 'faulty'],
      response: '✅ **Warranty Information:**\n\n• All products come with manufacturer warranty\n• Warranty period varies by product (typically 6 months to 2 years)\n• Warranty details are mentioned on each product page\n• Covers manufacturing defects only\n• Does not cover physical damage or misuse\n• For warranty claims, contact us with order details and issue description'
    },
    'gst': {
      keywords: ['gst', 'tax', 'invoice', 'bill'],
      response: '💰 **GST & Invoices:**\n\n• All prices are inclusive of applicable GST\n• GST rates vary by product (displayed at checkout)\n• GST invoice will be sent via email after purchase\n• Invoice includes all order details and tax breakdown\n• We are a registered GST entity\n• Invoices can be downloaded from your Order History'
    },
    'account': {
      keywords: ['account', 'register', 'signup', 'login', 'password', 'profile'],
      response: '👤 **Account & Registration:**\n\n• Create a free account to place orders\n• Track your order history\n• Save items to your wishlist\n• Faster checkout with saved addresses\n• Secure password protection\n• Easy password reset via email\n\nClick "Register" to create your account in seconds!'
    },
    'help': {
      keywords: ['help', 'support', 'question', 'how', 'what can you do'],
      response: '❓ **How Can I Help You?**\n\nI can answer questions about:\n• About Us & Company Info\n• Products & Catalog\n• Shipping & Delivery\n• Payment Methods\n• Refund & Returns\n• Privacy & Security\n• Terms of Service\n• Warranty Information\n• GST & Invoices\n• Account & Registration\n• Contact Details\n\nJust type your question!'
    }
  };

  const quickReplies = [
    { label: '📦 Products', trigger: 'products' },
    { label: '🚚 Shipping', trigger: 'shipping' },
    { label: '💳 Payment', trigger: 'payment' },
    { label: '📞 Contact', trigger: 'contact' },
    { label: '↩️ Refund Policy', trigger: 'refund' },
    { label: '❓ Help', trigger: 'help' }
  ];

  const findBestMatch = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    for (const [key, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(keyword => input.includes(keyword))) {
        return data.response;
      }
    }
    
    return '🤔 I\'m not sure about that. Try asking about:\n• Products & Services\n• Shipping & Delivery\n• Payment Methods\n• Refund Policy\n• Contact Information\n• Privacy & Terms\n\nOr type "help" to see all topics I can help with!';
  };

  const handleSendMessage = (message = inputMessage) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const userMessage = {
      type: 'user',
      text: trimmedMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: findBestMatch(trimmedMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleQuickReply = (trigger) => {
    handleSendMessage(trigger);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-[#373086] hover:bg-[#373086] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Open chatbot"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Need help? Chat with us!
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-gradient-to-r from-[#373086] to-[#373086] text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">SR Medical System Assistant</h3>
                <p className="text-xs text-[#373086]-100">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-[#373086] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.type === 'user' ? 'text-[#373086]' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply.trigger)}
                  className="px-3 py-1 bg-[#373086]-50 hover:bg-blue-100 text-[#373086]-700 text-xs rounded-full transition-colors border border-[#373086]-200"
                >
                  {reply.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="bg-[#373086] hover:bg-[#373086] text-white p-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
