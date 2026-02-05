
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1a1a1a] text-white pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 medical-pattern opacity-[0.03]"></div>
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <img src="/logo.png" alt="SR Medical System Logo" className="h-10 w-10 object-contain brightness-0 invert" />
              <span className="text-2xl font-bold tracking-tight">SR Medical System</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-8">
              Providing world-class medical equipment solutions with a commitment to excellence and reliability since 2005.
            </p>
            <div className="flex items-center space-x-5">
              {[Facebook, Twitter, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#373086] hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {['About Us', 'Services', 'Store', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-white transition-all flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#373086] opacity-0 group-hover:opacity-100 transition-all"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Support & Legal</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'FAQ', 'Sitemap'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-white transition-all">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Our Headquarters</h4>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#373086] flex-shrink-0" size={20} />
                <span>No:18/2, Bajanai Koil Street, Rajakilpakkam, Chennai-73</span>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-[#373086] flex-shrink-0" size={20} />
                <span>+91 72000 25642</span>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-[#373086] flex-shrink-0" size={20} />
                <span className="break-all">info.srmedicalsystem@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6 text-sm text-gray-500">
          <p>© {currentYear} SR Medical System. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#373086]" /> Secure Payments
            </span>
            <span>Design by SR Medical Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
