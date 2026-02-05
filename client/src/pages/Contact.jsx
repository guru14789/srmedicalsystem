import { firebaseService } from "@/lib/firebaseService";
import React, { useState } from "react";
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Headphones, ShieldCheck, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Direct Hotline",
      content: "+91 72000 25642",
      description: "Urgent clinical or technical support.",
      gradient: "from-blue-500/10 to-[#373086]/5"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      content: "info.srmedicalsystem@gmail.com",
      description: "For detailed inquiries and quotations.",
      gradient: "from-indigo-500/10 to-[#373086]/5"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "HQ Location",
      content: "No: 18/2, Bajanai Koli Street, Rajakilpakkam, Chennai-600073.",
      description: "Corporate office and distribution hub.",
      gradient: "from-[#373086]/10 to-indigo-500/5"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Service Hours",
      content: "Mon - Sat | 9:00 AM - 6:00 PM",
      description: "24/7 emergency line for key accounts.",
      gradient: "from-blue-500/10 to-indigo-500/5"
    },
  ];

  const services = [
    "Medical Equipment Supply",
    "Installation & Maintenance",
    "Consultation & Procurement",
    "After-Sales Support",
    "General Inquiry",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      service: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.service) {
      toast({
        title: "Selection Required",
        description: "Please select a service category.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await firebaseService.createContact(formData);

      if (response.success) {
        toast({
          title: "Transmission Successful",
          description: "Our consultants will contact you within 24 hours.",
        });

        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          message: "",
        });
      } else {
        toast({
          title: "Protocol Error",
          description: response.errors?.join(", ") || "Please verify your input.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error.message || "Please check your network.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Helmet>
        <title>Contact Us | SR Medical System - Get Expert Clinical Support</title>
        <meta name="description" content="Connect with SR Medical System. Our clinical consultants and technical support team are ready to modernize your healthcare infrastructure." />
        <link rel="canonical" href="https://srmedicalsystem.in/contact" />
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
              <Headphones size={14} /> 24/7 Technical Response Available
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter"
            >
              Connect with <br />
              <span className="text-blue-300">Expert Care</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Whether you're looking for a specific diagnostic tool or planning a hospital-wide infrastructure overhaul, our consultants are here to guide you.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-24 md:py-32 relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${info.gradient} p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all group`}
              >
                <div className="w-14 h-14 bg-white shadow-lg text-[#373086] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#373086] group-hover:text-white transition-all duration-500">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-semibold mb-2 text-sm">{info.content}</p>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-white p-12 md:p-16 rounded-[3.5rem] shadow-2xl border border-gray-100 relative"
            >
              <div className="mb-12">
                <h4 className="text-[#373086] font-black uppercase text-sm tracking-[0.3em] mb-4">Inquiry Protocol</h4>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Transmission Hub</h2>
                <p className="text-lg text-gray-500 font-light leading-relaxed">
                  Provide your requirements below. Our clinical response team will analyze your needs and provide a tailored proposal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="h-16 bg-gray-50 border-none rounded-2xl px-6 focus-visible:ring-2 focus-visible:ring-[#373086] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Corporate Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@hospital.com"
                      className="h-16 bg-gray-50 border-none rounded-2xl px-6 focus-visible:ring-2 focus-visible:ring-[#373086] transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="h-16 bg-gray-50 border-none rounded-2xl px-6 focus-visible:ring-2 focus-visible:ring-[#373086] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="company" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Medical Institution</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Hospital/Clinic Name"
                      className="h-16 bg-gray-50 border-none rounded-2xl px-6 focus-visible:ring-2 focus-visible:ring-[#373086] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="service" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Subject of Interest *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={handleServiceChange}
                    required
                  >
                    <SelectTrigger className="h-16 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-[#373086] transition-all">
                      <SelectValue placeholder="Select a service category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                      {services.map((service) => (
                        <SelectItem key={service} value={service} className="rounded-xl py-3">
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Detailed Requirements *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe the medical equipment or service you are interested in..."
                    rows={5}
                    className="bg-gray-50 border-none rounded-3xl px-6 py-4 focus-visible:ring-2 focus-visible:ring-[#373086] transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-20 bg-[#373086] hover:bg-[#1e1b4b] text-white text-xl font-bold rounded-[2rem] shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-b-2 border-white rounded-full"
                    />
                  ) : (
                    <>
                      Secure Transmission <Send className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Map Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3.5rem] overflow-hidden shadow-2xl h-full min-h-[500px] border-8 border-white"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.099789230672!2d80.1512151!3d12.9220849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525ee620305369%3A0x2b56ef6ecf6642d3!2sSree%20Meditec!5e0!3m2!1sen!2sin!4v1712569900000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SR Medical System HQ"
                className="grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#373086] rounded-2xl flex items-center justify-center text-white">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Visit Our HQ</h5>
                    <p className="text-sm text-gray-500 text-balance">Get in-person consultation at our Chennai regional hub.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-3">
              <ShieldCheck size={40} className="text-[#373086]" />
              <span className="text-2xl font-black tracking-tighter text-gray-900">QUALITY ASSURED</span>
            </div>
            <div className="flex items-center gap-3">
              <Award size={40} className="text-[#373086]" />
              <span className="text-2xl font-black tracking-tighter text-gray-900">20+ YEARS EXP</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare size={40} className="text-[#373086]" />
              <span className="text-2xl font-black tracking-tighter text-gray-900">DIRECT SUPPORT</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
