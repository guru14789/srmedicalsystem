import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ChevronRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      toast({
        title: 'Authentication Protocol Failed',
        description: result.error || 'Invalid clinical credentials. Verification denied.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <Helmet>
        <title>Secure Login | SR Medical System Gateway</title>
        <meta name="description" content="Secure access to the SR Medical System clinical inventory and professional dashboard." />
      </Helmet>

      {/* Aesthetic Side Panel - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1e1b4b]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
            alt="Medical Technology"
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#373086]/90 to-[#4f46e5]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#1e1b4b_100%)] opacity-60" />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-20">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#373086] shadow-2xl">
                <Activity size={28} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">SR MEDICAL</span>
            </Link>
            <Link to="/" className="text-blue-200/60 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2">
              Exit to Marketplace <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <ShieldCheck size={14} /> Secure Access Gateway
              </div>
              <h1 className="text-6xl xl:text-7xl font-black text-white leading-[0.95] tracking-tighter text-balance">
                Professional <br />
                <span className="text-blue-300">Clinical Sync</span>
              </h1>
            </motion.div>
            <p className="text-xl text-blue-100/60 font-medium leading-relaxed max-w-lg">
              Access the world's most advanced clinical inventory hub. Secure, synchronized, and certified for excellence.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="space-y-1">
              <div className="text-white font-black text-2xl tracking-tighter">256-bit</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60">Encryption Standard</div>
            </div>
            <div className="space-y-1">
              <div className="text-white font-black text-2xl tracking-tighter">99.9%</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60">Uptime Protocol</div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-hidden bg-gray-50/30">
        <div className="lg:hidden absolute top-12 left-12 flex items-center gap-2">
          <div className="w-10 h-10 bg-[#373086] rounded-xl flex items-center justify-center text-white">
            <Activity size={24} />
          </div>
          <span className="text-lg font-black text-gray-900 tracking-tighter">SR MEDICAL</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Verify your clinical credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Professional Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@medical.com"
                    className="pl-14 h-16 bg-white border-none rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Security Password</Label>
                  <Link to="/forgot-password" size="sm" className="text-xs font-black uppercase tracking-widest text-[#373086] hover:underline">Reset Code</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
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
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                id="remember"
                type="checkbox"
                className="w-5 h-5 rounded-lg border-gray-200 text-[#373086] focus:ring-[#373086] transition-all"
              />
              <label htmlFor="remember" className="text-sm font-bold text-gray-500">Enable Session Persistence</label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-[#373086] hover:bg-[#1e1b4b] text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all transform active:scale-95 group overflow-hidden"
            >
              {isLoading ? 'Verifying Protocol...' : (
                <span className="flex items-center justify-center gap-3">
                  Initiate Secure Sync <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-500 font-bold">
              New to the system?{' '}
              <Link to="/register" className="text-[#373086] hover:underline decoration-2 underline-offset-4">
                Obtain Access Key
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
