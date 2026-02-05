import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Zap, CheckCircle, ArrowRight, X, Settings, Activity, Truck, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { firebaseService } from '@/lib/firebaseService';

const Services = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const tabs = [
    { id: 'equipment', label: 'Equipment', icon: <Activity className="w-5 h-5" /> },
    { id: 'furniture', label: 'Furniture', icon: <Shield className="w-5 h-5" /> },
    { id: 'pipeline', label: 'Pipeline', icon: <Zap className="w-5 h-5" /> }
  ];

  const tabContent = {
    equipment: {
      title: 'Precision Medical Equipment',
      description:
        'We bridge the gap between innovation and patient care. Our curated selection of advanced medical devices ensures that your facility is equipped with tools that offer surgical precision and diagnostic absolute.',
      image: '/Maria Parham Med.webp',
      features: ['Advanced Patient Monitors', 'Precision Surgical Tools', 'Next-Gen Diagnostic Sets', 'Interoperable Smart Systems'],
      tag: 'Critical Care'
    },
    furniture: {
      title: 'Adaptive Hospital Furniture',
      description:
        'Healing begins with comfort. Our ergonomic hospital furniture is designed for durability and patient ease, creating environments that promote recovery and professional efficiency.',
      image: '/hospital.webp',
      features: ['Smart-Drive ICU Beds', 'Ergonomic Patient Seating', 'Integrated Medical Trolleys', 'Sanitary Grade Storage'],
      tag: 'Ward Excellence'
    },
    pipeline: {
      title: 'Lifeline Gas Infrastructure',
      description:
        'Safety isn\'t just a requirement; it\'s our foundation. We design and install high-integrity medical gas pipeline systems that meet the most stringent international safety standards.',
      image: '/pipeline.webp',
      features: ['High-Purity Oxygen & Vacuum', 'Automated Monitoring Systems', 'Redundant Safety Protocols', '24/7 Technical Compliance'],
      tag: 'Technical Infrastructure'
    }
  };

  const servicePortfolio = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Global Procurement',
      description: 'Sourcing the world\'s most dependable medical technologies for local excellence.',
      gradient: 'from-blue-500/10 to-[#373086]/5'
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Precision Installation',
      description: 'Expert engineers ensuring every piece of equipment is calibrated for peak performance.',
      gradient: 'from-indigo-500/10 to-[#373086]/5'
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Preventive Maintenance',
      description: 'Proactive servicing to minimize clinical downtime and extend equipment lifespan.',
      gradient: 'from-[#373086]/10 to-indigo-500/5'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: '24/7 Clinical Support',
      description: 'Immediate technical assistance whenever your medical team needs it most.',
      gradient: 'from-blue-500/10 to-indigo-500/5'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await firebaseService.createContact({
        ...formData,
        subject: 'Service Support Request'
      });

      if (response.success) {
        alert('Service request submitted successfully! We will contact you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setShowModal(false);
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Helmet>
        <title>Our Services | SR Medical System - Healthcare Infrastructure</title>
        <meta name="description" content="Explore SR Medical System's comprehensive services: Medical equipment supply, hospital furniture solutions, and advanced gas pipeline installations." />
        <link rel="canonical" href="https://srmedicalsystem.in/services" />
      </Helmet>

      {/* Immersive Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-40 pb-24 border-b border-gray-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e1b4b]/95 via-[#373086]/90 to-[#373086]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(79,70,229,0.15),transparent_50%)]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-[0.2em] mb-8"
            >
              <Settings size={14} className="animate-spin-slow" /> Comprehensive Care
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter"
            >
              Excellence in <br />
              <span className="text-blue-300">Medical Service</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
            >
              From equipment procurement to complex infrastructure installation, we provide the backbone for modern healthcare excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                onClick={() => setShowModal(true)}
                className="px-10 py-5 bg-white text-[#373086] rounded-2xl font-bold text-lg hover:shadow-[0_20px_40px_-5px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1 inline-flex items-center gap-3"
              >
                Get Service Support <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs / Dynamic Content Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="container-custom relative z-10">
          <div className="flex flex-col items-center mb-16">
            <h4 className="text-[#373086] font-black uppercase text-sm tracking-[0.3em] mb-6">Our Specializations</h4>
            <div className="inline-flex p-1.5 bg-white rounded-3xl shadow-xl border border-gray-100 mb-8 overflow-x-auto max-w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-[#373086] text-white shadow-lg'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#373086]'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
              >
                <div className="relative">
                  <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(55,48,134,0.3)] border-8 border-white">
                    <img
                      src={tabContent[activeTab].image}
                      alt={tabContent[activeTab].title}
                      className="w-full h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#373086]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                  <div className="absolute bottom-10 -left-10 w-60 h-60 bg-blue-100 rounded-full blur-3xl -z-10"></div>

                  <div className="absolute -bottom-8 right-8 bg-white p-8 rounded-3xl shadow-2xl z-20 border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#373086] flex items-center justify-center rounded-2xl text-white">
                        <CheckCircle size={24} />
                      </div>
                      <div className="text-sm font-bold text-gray-900 uppercase leading-tight tracking-widest">
                        ISO Certified <br /> Standards
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#373086] text-xs font-bold uppercase tracking-widest mb-6">
                    {tabContent[activeTab].tag}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
                    {tabContent[activeTab].title}
                  </h2>
                  <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
                    {tabContent[activeTab].description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {tabContent[activeTab].features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[#373086]">
                          <CheckCircle size={14} />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-[#373086] text-white font-bold rounded-2xl hover:bg-[#1e1b4b] transition-all transform hover:-translate-y-1 shadow-xl">
                    Inquire About {tabContent[activeTab].label} <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Service Portfolio Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h4 className="text-[#373086] font-black uppercase text-sm tracking-[0.3em] mb-6">End-to-End Excellence</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Comprehensive Portfolio</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#373086] to-blue-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicePortfolio.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${service.gradient} p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all group`}
              >
                <div className="w-16 h-16 bg-white shadow-lg text-[#373086] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#373086] group-hover:text-white transition-all duration-500 transform group-hover:-rotate-12">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-[#373086] to-[#4f46e5] rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_-20%,_rgba(255,255,255,0.2),transparent_60%)]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">Ready to Modernize <br />Your Healthcare?</h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Connect with our technical consultants today for a comprehensive service audit and infrastructure plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-12 py-5 bg-white text-[#373086] rounded-2xl font-bold text-lg hover:shadow-[0_20px_40px_-5px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1"
                >
                  Get Service Support
                </button>
                <Link to="/contact" className="px-12 py-5 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all transform hover:-translate-y-1">
                  Connect with Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal - Redesigned */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#373086]/20 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Service Support</h2>
                <p className="text-gray-500 font-light leading-relaxed">
                  Fill out the details below and our technical response team will contact you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-4">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#373086] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-4">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#373086] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-4">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@hospital.com"
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#373086] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-4">Issue Description</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Briefly describe the equipment issue or service requirement..."
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 resize-none focus:ring-2 focus:ring-[#373086] transition-all"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-[#373086] text-white rounded-2xl font-bold text-lg hover:bg-[#1e1b4b] shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Request...' : 'Submit Support Request'} <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;
