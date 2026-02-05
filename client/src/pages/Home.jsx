import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, CheckCircle, Code, PenTool, Settings, Cloud,
  Phone, Mail, MapPin, Award, Users, ThumbsUp, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  const stats = [
    { value: '20+', label: 'Years of Excellence', icon: <Award className="w-6 h-6" /> },
    { value: '400+', label: 'Hospitals Served', icon: <Users className="w-6 h-6" /> },
    { value: '2000+', label: 'Equipment Delivered', icon: <Settings className="w-6 h-6" /> },
    { value: '99%', label: 'Client Satisfaction', icon: <ThumbsUp className="w-6 h-6" /> }
  ];

  const serviceItems = [
    {
      id: 'software',
      icon: <Settings size={32} />,
      title: "Medical Equipment Supply",
      description: "Advanced diagnostic and surgical equipment from world-leading manufacturers.",
      link: '/store'
    },
    {
      id: 'design',
      icon: <PenTool size={32} />,
      title: "Installation & Setup",
      description: "Expert installation and calibration services by certified medical technicians.",
      link: '/services'
    },
    {
      id: 'consulting',
      icon: <ShieldCheck size={32} />,
      title: "Maintenance & Support",
      description: "Comprehensive Annual Maintenance Contracts (AMC) and prompt repair services.",
      link: '/services'
    },
    {
      id: 'cloud',
      icon: <Cloud size={32} />,
      title: "Healthcare Consulting",
      description: "Strategic planning and procurement advice for modernizing healthcare facilities.",
      link: '/services'
    }
  ];

  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Medical Director, City Hospital",
      content: "SR Medical System has been our primary equipment partner for over a decade. Their commitment to quality and after-sales support is unmatched.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
    },
    {
      name: "Dr. Anita Sharma",
      role: "Senior Surgeon, Apollo Speciality",
      content: "The precision of the surgical equipment they provide is exceptional. Their technical team is always available for immediate assistance.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita"
    }
  ];

  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>SR Medical System | Leading Medical Equipment Solutions in Chennai</title>
        <meta name="description" content="SR Medical System – premium medical equipment supplier in Chennai. Providing cutting-edge hospital devices, expert installation, and reliable technical support." />
        <link rel="canonical" href="https://srmedicalsystem.in/" />
      </Helmet>

      {/* Hero Section - Premium Immersive */}
      <section className="relative min-h-[90vh] flex items-center pt-40">

        <div className="absolute inset-0 z-0">
          <img
            src="/hero-modern.png"
            alt="Modern Medical Facility"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e1b4b]/80 via-[#373086]/90 to-[#373086]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8">
                Redefining Healthcare Technology
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 text-balance">
                Precision Equipment for <br className="hidden md:block" />
                <span className="text-blue-300">Better Patient Outcomes</span>
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Empowering healthcare providers with world-class medical technology, expert installation, and dedicated service across South India.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/store" className="inline-flex items-center justify-center bg-white text-[#373086] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  Explore Products <ArrowRight size={22} className="ml-2" />
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all transform hover:-translate-y-1">
                  Schedule Consultation
                </Link>
              </div>

              {/* Floating Stats - Integrated into flow to prevent overlap */}
              <div className="mt-20 lg:mt-32">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="glass-card p-10 md:p-14 rounded-[3rem] grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 max-w-6xl mx-auto border-white/40 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-white/5"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                  {stats.map((stat, idx) => (
                    <div key={idx} className="relative z-10 text-center group">
                      <div className="text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tighter drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
                        {stat.value}
                      </div>
                      <div className="text-[10px] md:text-xs text-blue-100 font-bold uppercase tracking-[0.25em] opacity-80 group-hover:opacity-100 transition-opacity">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="h-24 md:h-32"></div> {/* Extra space for transition */}
      </section>



      {/* Features/About Section */}
      <section className="section-padding bg-gray-50 overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img src="/inventory-showcase.png" alt="Medical Equipment Showroom" className="w-full h-auto" />
              </div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#373086]/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>

              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Certified Quality</div>
                    <div className="text-sm text-gray-500">ISO 9001:2015 Standards</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <span className="text-[#373086] font-bold tracking-widest uppercase text-sm mb-4 block">Our Commitment</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Two Decades of Trust in <span className="text-gradient">Medical Excellence</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Since 2005, SR Medical System has been dedicated to bridging the gap between advanced medical technology and healthcare providers. We don't just supply equipment; we provide end-to-end solutions that ensure your facility operates at its peak potential.
              </p>

              <div className="space-y-6 mb-10">
                {[
                  "Global standard medical equipment sourcing",
                  "24/7 technical support and maintenance",
                  "Comprehensive training for medical staff",
                  "Transparent pricing and flexible financing"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 text-[#373086] flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/about" className="inline-flex items-center text-[#373086] font-bold hover:gap-4 transition-all">
                Learn more about our heritage <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white relative">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-display">Integrated Solutions</h2>
            <p className="text-lg text-gray-600">Comprehensive services designed to support every aspect of your healthcare facility's equipment lifecycle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceItems.map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="group p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-100"
              >
                <div className="w-16 h-16 bg-white text-[#373086] rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-[#373086] group-hover:text-white transition-all duration-500 mb-8">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">{service.description}</p>
                <Link to={service.link} className="flex items-center text-[#373086] font-bold group-hover:gap-2 transition-all">
                  Details <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - New Section */}
      <section className="section-padding bg-[#373086] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-[0.03] transform skew-x-12 translate-x-20"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Why Healthcare Leaders <span className="text-blue-300">Choose Us</span></h2>
              <p className="text-xl text-white/70 mb-12">We combine technical expertise with a clinical understanding of your needs.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: "Direct Factory Partnerships", desc: "No middleman, ensuring best prices and genuine parts." },
                  { title: "Certified Technicians", desc: "Our team is factory-trained for every device we sell." },
                  { title: "Quick Turnaround", desc: "Strategic warehouses ensure rapid delivery and service." },
                  { title: "Custom Solutions", desc: "We tailor equipment packages to your specific clinical needs." }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-lg mb-2 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      {item.title}
                    </div>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="w-full max-w-md aspect-square rounded-full border border-white/10 animate-spin-slow absolute"></div>
              <div className="w-[85%] aspect-square rounded-full border border-white/20 animate-spin-slow-reverse absolute top-[7.5%]"></div>
              <div className="relative z-10 bg-white/10 backdrop-blur-xl p-12 rounded-3xl border border-white/20 shadow-2xl">
                <div className="text-5xl font-bold mb-4">98%</div>
                <div className="text-xl font-medium text-blue-200 mb-6">Uptime Guaranteed</div>
                <p className="text-white/70 italic">"Our priority is ensuring your equipment stays operational, so you can focus on what matters most: saving lives."</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest">Authorized Distributor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quotes / Testimonials */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Voice of Our Clients</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-8">
                  <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full bg-gray-200" />
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-blue-600">{t.role}</div>
                  </div>
                </div>
                <p className="text-lg text-gray-600 italic leading-relaxed">"{t.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-[#373086] to-[#4f46e5] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 medical-pattern opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-balance">Ready to Modernize Your <br />Healthcare Facility?</h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Consult with our experts for a customized medical equipment solution that fits your budget and clinical goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/contact" className="bg-white text-[#373086] px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                  Contact Sales Team
                </Link>
                <Link to="/quote" className="bg-transparent border-2 border-white/50 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all transform hover:-translate-y-1">
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="container-custom flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-3">
            <Phone className="text-[#373086]" />
            <span className="font-medium text-gray-600">+91 72000 25642</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-[#373086]" />
            <span className="font-medium text-gray-600">info.srmedicalsystem@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-[#373086]" />
            <span className="font-medium text-gray-600">Chennai, Tamil Nadu</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
