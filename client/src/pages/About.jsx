import React from 'react';
import { Users, Award, TrendingUp, ArrowRight, ShieldCheck, Target, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  const stats = [
    { value: '20+', label: 'Years of Excellence', icon: <Award className="w-6 h-6" /> },
    { value: '400+', label: 'Hospitals Served', icon: <Users className="w-6 h-6" /> },
    { value: '2000+', label: 'Equipment Delivered', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '100%', label: 'Commitment', icon: <ShieldCheck className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <Target size={32} />,
      title: 'Precision Quality',
      description: 'We source only the most advanced diagnostic and surgical tools, ensuring surgical precision and diagnostic accuracy for every patient.',
      gradient: 'from-blue-500/10 to-[#373086]/5'
    },
    {
      icon: <Zap size={32} />,
      title: 'Rapid Support',
      description: 'Our technical response team is available 24/7, providing immediate assistance and maintenance to minimize clinical downtime.',
      gradient: 'from-indigo-500/10 to-[#373086]/5'
    },
    {
      icon: <Heart size={32} />,
      title: 'Patient-First Ethics',
      description: 'Beyond equipment, we care about life. Every solution we provide is vetted for its impact on patient safety and comfort.',
      gradient: 'from-[#373086]/10 to-indigo-500/5'
    }
  ];

  const milestones = [
    { year: '2005', title: 'The Genesis', desc: 'Founded in Chennai with a vision to revolutionize medical equipment supply chains.' },
    { year: '2012', title: 'Regional Expansion', desc: 'Became the authorized distributor for leading global medical brands across South India.' },
    { year: '2018', title: 'Diagnostic Excellence', desc: 'Launched specialized consulting for high-end MRI and CT setup installations.' },
    { year: '2024', title: 'Future-Ready', desc: 'Leading the digital transformation of hospitals with integrated smart-equipment systems.' }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Helmet>
        <title>About Us | SR Medical System - Our Heritage & Mission</title>
        <meta name="description" content="Discover the 20-year legacy of SR Medical System. Leading the healthcare technology revolution in South India with precision, trust, and excellence." />
        <link rel="canonical" href="https://srmedicalsystem.in/about" />
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
              <Award size={14} /> Established 2005
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter"
            >
              Empowering <br />
              <span className="text-blue-300">Healthcare Leaders</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              For two decades, we've bridged the gap between cutting-edge technology and clinical excellence, ensuring every patient receives world-class care.
            </motion.p>
          </div>
        </div>
      </section>

      {/* The Legacy Section */}
      <section className="py-24 md:py-32 relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(55,48,134,0.3)] border-8 border-white">
                <img src="/meet.webp" alt="Medical Team Collaboration" className="w-full h-auto transform hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#373086]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <div className="absolute bottom-10 -left-10 w-60 h-60 bg-blue-100 rounded-full blur-3xl -z-10"></div>

              <div className="absolute -bottom-8 right-8 bg-white p-8 rounded-3xl shadow-2xl z-20 border border-gray-100">
                <div className="flex items-center gap-5">
                  <div className="text-5xl font-black text-[#373086]">19+</div>
                  <div className="text-sm font-bold text-gray-500 uppercase leading-tight tracking-widest">Years of <br />Market Dominance</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-[#373086] font-black uppercase text-sm tracking-[0.3em] mb-6">Our Heritage</h4>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
                Two Decades of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#373086] to-[#4f46e5]">Unwavering Trust</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
                Since our inception in 2005, SR Medical System has been at the forefront of the medical technology revolution in South India. We don't just supply machines; we engineer environments where healthcare professionals can perform at their peak.
              </p>

              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">400+</div>
                  <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">Medical Institutions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">2000+</div>
                  <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">Units Delivered</div>
                </div>
              </div>

              <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-[#373086] text-white font-bold rounded-2xl hover:bg-[#1e1b4b] transition-all transform hover:-translate-y-1 shadow-xl">
                Partner With Us <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Purpose & Vision Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Our Guiding Light</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#373086] to-blue-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-all group"
            >
              <div className="w-16 h-16 bg-blue-50 text-[#373086] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#373086] group-hover:text-white transition-all duration-500">
                <Target size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                To empower medical professionals by providing the highest quality healthcare technology and unwavering technical support, ensuring that diagnostic precision and life-saving care are never compromised by outdated or failing equipment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-all group"
            >
              <div className="w-16 h-16 bg-indigo-50 text-[#373086] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#373086] group-hover:text-white transition-all duration-500">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                To be the undisputed leader in medical equipment solutions across India, recognized for our ethical standards, clinical expertise, and the transformative role we play in modernizing the nation's healthcare infrastructure.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Journey Timeline */}
      <section className="py-24 md:py-32">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Our Evolution</h2>
            <p className="text-gray-500 font-medium">A timeline of persistence and progress.</p>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 md:px-0">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>

            <div className="space-y-20">
              {milestones.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center justify-between md:justify-normal ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white border-4 border-[#373086] z-10"></div>
                  </div>

                  <div className="w-full md:w-[45%] bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all">
                    <div className="text-2xl font-black text-[#373086] mb-2">{m.year}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{m.title}</h4>
                    <p className="text-gray-600 font-light leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Redesigned */}
      <section className="py-24 bg-[#373086] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.05),transparent_40%)]"></div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our DNA</h2>
            <p className="text-blue-200/80 font-medium">What makes us the preferred choice for hospitals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[2.5rem] hover:bg-white/20 transition-all group"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <div className="text-white">{v.icon}</div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                <p className="text-white/70 leading-relaxed font-light">{v.description}</p>
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
              <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">Let's Build the Future <br />of Your Healthcare</h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Connect with our clinical consultants today for a comprehensive equipment audit and modernization plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/contact" className="px-12 py-5 bg-white text-[#373086] rounded-2xl font-bold text-lg hover:shadow-[0_20px_40px_-5px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1">
                  Connect with Sales
                </Link>
                <Link to="/services" className="px-12 py-5 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all transform hover:-translate-y-1">
                  View Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
