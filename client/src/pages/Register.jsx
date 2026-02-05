import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ShieldCheck, ChevronRight, Activity, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/FirebaseAuthContext";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Security Mismatch",
        description: "Passwords protocols do not match. Verification failed.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      address: formData.address,
    };

    const result = await register(userData);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Welcome to Excellence",
        description: "Your professional clinical account has been provisioned.",
      });
      navigate("/");
    } else {
      toast({
        title: "Provisioning Failed",
        description: result.error || "An error occurred during account sync.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <Helmet>
        <title>Account Provisioning | SR Medical System</title>
        <meta
          name="description"
          content="Obtain your secure clinical credentials and join the SR Medical System professional community."
        />
      </Helmet>

      {/* Aesthetic Side Panel - Desktop Only */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-[#1e1b4b]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80"
            alt="Modern Lab"
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#373086]/90 to-[#4f46e5]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#1e1b4b_100%)] opacity-60" />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 xl:p-20">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#373086] shadow-2xl">
                <Activity size={28} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">SR MEDICAL</span>
            </Link>
            <Link to="/" className="text-blue-200/60 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2">
              Exit <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Globe size={14} /> Global Clinical Network
              </div>
              <h1 className="text-5xl xl:text-6xl font-black text-white leading-[0.95] tracking-tighter">
                Join the <br />
                <span className="text-blue-300">Elite Protocol</span>
              </h1>
            </motion.div>

            <div className="space-y-6">
              {[
                { icon: <ShieldCheck size={18} />, title: "Secure Data Sourcing", desc: "Enterprise-grade clinical data encryption." },
                { icon: <Heart size={18} />, title: "Patient-First Tools", desc: "Prioritizing outcomes through technology." },
                { icon: <Globe size={18} />, title: "Supply Chain Sync", desc: "Real-time global inventory management." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-300 group-hover:bg-white group-hover:text-[#373086] transition-all duration-300 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-blue-100/40 text-xs font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 border-t border-white/10">
            <p className="text-xs font-bold text-blue-100/30 uppercase tracking-[0.2em]">Trusted by 400+ Healthcare Facilities</p>
          </div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-gray-50/30 overflow-y-auto no-scrollbar relative">
        <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 transition-opacity hover:opacity-70 group">
          <div className="w-10 h-10 bg-[#373086] rounded-xl flex items-center justify-center text-white shadow-xl">
            <Activity size={24} />
          </div>
          <span className="text-lg font-black text-gray-900 tracking-tighter">Exit Marketplace</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Account Provisioning</h2>
            <p className="text-gray-500 font-medium tracking-tight">Register your professional credentials to join our clinical infrastructure.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">Full Legal Name</Label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Dr. Clinical Name"
                  className="pl-14 h-16 bg-white border-none rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">Professional Email</Label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="name@facility.com"
                  className="pl-14 h-16 bg-white border-none rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">Secure Contact</Label>
              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="pl-14 h-16 bg-white border-none rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">Facility Location</Label>
              <div className="relative group">
                <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Hospital/Clinic Address"
                  className="pl-14 h-16 bg-white border-none rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">Access Password</Label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className="pl-14 pr-14 h-16 bg-white border-none rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">Verify Password</Label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className="pl-14 pr-14 h-16 bg-white border-none rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-8 mt-4">
              <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="w-5 h-5 mt-1 rounded-lg border-blue-200 text-[#373086] focus:ring-[#373086]"
                />
                <label htmlFor="terms" className="text-xs font-bold text-blue-900/60 leading-relaxed">
                  I acknowledge and agree to the
                  <button onClick={(e) => { e.preventDefault(); setShowTermsDialog(true); }} className="text-[#373086] hover:underline mx-1">Clinical Service Protocols</button>
                  and the
                  <button onClick={(e) => { e.preventDefault(); setShowPrivacyDialog(true); }} className="text-[#373086] hover:underline mx-1">Biological Data Privacy Standards</button>.
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-16 bg-[#373086] hover:bg-[#1e1b4b] text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all transform active:scale-95 group"
                >
                  {isLoading ? "Provisioning..." : (
                    <span className="flex items-center justify-center gap-3">
                      Obtain Credentials <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
                <Link
                  to="/login"
                  className="h-16 bg-white border-2 border-gray-100 hover:border-[#373086] hover:bg-gray-50 text-[#373086] rounded-2xl font-black text-sm flex items-center justify-center tracking-widest uppercase transition-all"
                >
                  Sign in Here Instead
                </Link>
              </div>
            </div>
          </form>

          <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Compliance Standard ISO 27001 Certified Interface
          </p>
        </motion.div>
      </div>

      <TermsAndPrivacyDialogs
        showTerms={showTermsDialog}
        setShowTerms={setShowTermsDialog}
        showPrivacy={showPrivacyDialog}
        setShowPrivacy={setShowPrivacyDialog}
      />
    </div>
  );
};

const TermsAndPrivacyDialogs = ({ showTerms, setShowTerms, showPrivacy, setShowPrivacy }) => (
  <>
    <Dialog open={showTerms} onOpenChange={setShowTerms}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-[3rem] p-12 border-none shadow-2xl">
        <DialogHeader className="mb-8">
          <div className="w-16 h-16 bg-blue-50 text-[#373086] rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck size={32} />
          </div>
          <DialogTitle className="text-4xl font-black tracking-tighter text-gray-900">
            Terms of Medical Service
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-xs pt-2">
            Updated Protocols: Nov 2025
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 text-sm text-gray-600 font-medium leading-relaxed">
          <section>
            <h3 className="font-black text-[#373086] uppercase tracking-widest text-xs mb-3">01. Professional Use</h3>
            <p>SR Medical System is a professional clinical tool. Users represent and warrant that they possess necessary authority to procure medical inventory and follow clinical safety standards.</p>
          </section>
          <section>
            <h3 className="font-black text-[#373086] uppercase tracking-widest text-xs mb-3">02. Inventory Compliance</h3>
            <p>All devices listed must be operated only by certified medical staff. Use of equipment beyond its intended specifications is strictly prohibited under clinical safety regulations.</p>
          </section>
          <section>
            <h3 className="font-black text-[#373086] uppercase tracking-widest text-xs mb-3">03. Secure Transmissions</h3>
            <p>You are responsible for maintaining the confidentiality of your clinical access key. Unauthorized sharing of credentials may result in immediate suspension of facility access.</p>
          </section>
        </div>
        <div className="mt-12">
          <Button onClick={() => setShowTerms(false)} className="w-full h-14 bg-[#373086] rounded-2xl font-black uppercase tracking-widest">Acknowledge Policy</Button>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-[3rem] p-12 border-none shadow-2xl">
        <DialogHeader className="mb-8">
          <div className="w-16 h-16 bg-blue-50 text-[#373086] rounded-2xl flex items-center justify-center mb-6">
            <Activity size={32} />
          </div>
          <DialogTitle className="text-4xl font-black tracking-tighter text-gray-900">
            Data Privacy Matrix
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-xs pt-2">
            GDPR & Clinical Standards Compliant
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 text-sm text-gray-600 font-medium leading-relaxed">
          <section>
            <h3 className="font-black text-[#373086] uppercase tracking-widest text-xs mb-3">I. Information Sourcing</h3>
            <p>We source only essential professional data including facility location, clinical credentials, and contact protocols to ensure seamless inventory logistics.</p>
          </section>
          <section>
            <h3 className="font-black text-[#373086] uppercase tracking-widest text-xs mb-3">II. Clinical Integrity</h3>
            <p>Your procurement history is encrypted and utilized only for inventory syncing, warranty tracking, and regulatory audit purposes.</p>
          </section>
        </div>
        <div className="mt-12">
          <Button onClick={() => setShowPrivacy(false)} className="w-full h-14 bg-[#373086] rounded-2xl font-black uppercase tracking-widest">Confirm Privacy Sync</Button>
        </div>
      </DialogContent>
    </Dialog>
  </>
);

export default Register;
