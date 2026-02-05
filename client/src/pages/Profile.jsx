import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Save, Edit, Home, Building2, MapPinned, ShieldCheck, Activity, ChevronRight, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/FirebaseAuthContext';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.street || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    address: user?.address || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setIsEditing(false);
        toast({
          title: "Registry Updated",
          description: "Your professional clinical record has been synchronized.",
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Protocol failure during record synchronization.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Key Mismatch",
        description: "New security codes do not match. Verification failed.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast({
        title: "Access Key Updated",
        description: "New security protocol has been established.",
      });
    } catch (error) {
      toast({
        title: "Protocol Error",
        description: "Failed to update security credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <Activity className="w-16 h-16 text-[#373086] mb-6 animate-pulse" />
        <h2 className="text-2xl font-black tracking-tighter text-gray-900 mb-2 text-center uppercase">Awaiting Authorization</h2>
        <p className="text-gray-500 font-bold text-center">Please verify your credentials to access the clinical dashboard.</p>
        <Button className="mt-8 bg-[#373086] rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-xl">Initiate Login</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Clinical Dashboard | SR Medical System</title>
        <meta name="description" content="Manage your professional medical account and secure clinical credentials." />
      </Helmet>

      <div className="min-h-screen bg-gray-50/50 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Sidebar Profile Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#1e1b4b] rounded-[3rem] p-10 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#373086] to-[#4f46e5] opacity-90" />
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-white flex items-center justify-center text-[#373086] mb-6 shadow-2xl transform transition-transform group-hover:scale-105 duration-500 relative">
                    <User size={48} className="absolute" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#1e1b4b] flex items-center justify-center">
                      <ShieldCheck size={14} className="text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tighter mb-1 uppercase line-clamp-1">{profileData.name}</h2>
                  <p className="text-blue-200/60 font-black uppercase text-[10px] tracking-[0.2em] mb-4">Certified Account</p>

                  <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1">
                      <Activity size={10} /> Active
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-300 text-[#1e1b4b] text-[9px] font-black uppercase tracking-widest">
                      {user.role || 'Customer'}
                    </span>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-white font-black text-xl tracking-tighter line-clamp-1">32</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-blue-200/40">Sync Order</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-black text-xl tracking-tighter line-clamp-1">₹4.2k</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-blue-200/40">Expended</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hidden lg:block">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#373086] mb-6">Device Inventory Status</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Synchronized Units', val: '86%', color: 'bg-green-500' },
                    { label: 'Warranty Coverage', val: '100%', color: 'bg-[#373086]' },
                    { label: 'Security Verification', val: '92%', color: 'bg-blue-400' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>{item.label}</span>
                        <span className="text-gray-900">{item.val}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: item.val }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Tabs Area */}
            <div className="lg:col-span-8">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-white p-2 h-auto rounded-3xl shadow-sm border border-gray-100 mb-8 grid grid-cols-2">
                  <TabsTrigger value="profile" className="rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-[#373086] data-[state=active]:text-white transition-all">
                    Clinical Registry
                  </TabsTrigger>
                  <TabsTrigger value="password" className="rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-[#373086] data-[state=active]:text-white transition-all">
                    Security Protocol
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0 outline-none">
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditing(!isEditing)}
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${isEditing ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-50 text-[#373086] hover:bg-blue-100'}`}
                      >
                        {isEditing ? <Activity size={24} className="animate-pulse" /> : <Edit size={24} />}
                      </Button>
                    </div>

                    <div className="mb-10">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Clinical Registry</h3>
                      <p className="text-sm text-gray-500 font-medium">Verify and update your facility's registered professional credentials.</p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Professional Entity</Label>
                          <div className="relative group">
                            <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                            <Input
                              name="name"
                              value={profileData.name}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              placeholder="Full Entity Name"
                              className="pl-14 h-16 bg-gray-50/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold disabled:opacity-70 disabled:bg-gray-50"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Verification Signal</Label>
                          <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                            <Input
                              name="email"
                              type="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              placeholder="Entity Email Address"
                              className="pl-14 h-16 bg-gray-50/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold disabled:opacity-70 disabled:bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Secure Comms Line</Label>
                          <div className="relative group">
                            <Phone className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                            <Input
                              name="phone"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              placeholder="+91 Contact Signal"
                              className="pl-14 h-16 bg-gray-50/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold disabled:opacity-70 disabled:bg-gray-50"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Security Access Level</Label>
                          <div className="relative group">
                            <Fingerprint className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                            <Input
                              value={user.role === 'admin' ? 'Strategic Administrator' : 'Standard Clinical User'}
                              disabled
                              className="pl-14 h-16 bg-gray-50/20 border-none rounded-2xl text-[#373086] font-black italic shadow-inner"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Primary Grid Location (Street)</Label>
                        <div className="relative group">
                          <Home className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                          <Input
                            name="street"
                            value={profileData.street}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            placeholder="Facility Physical Address"
                            className="pl-14 h-16 bg-gray-50/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold disabled:opacity-70 disabled:bg-gray-50"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Grid Sector (City)</Label>
                          <div className="relative group">
                            <Building2 className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                            <Input
                              name="city"
                              value={profileData.city}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              placeholder="City"
                              className="pl-14 h-16 bg-gray-50/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold disabled:opacity-70 disabled:bg-gray-50"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Regional Matrix (State)</Label>
                          <div className="relative group">
                            <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                            <Input
                              name="state"
                              value={profileData.state}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              placeholder="State"
                              className="pl-14 h-16 bg-gray-50/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold disabled:opacity-70 disabled:bg-gray-50"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Zone Code</Label>
                          <div className="relative group">
                            <MapPinned className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                            <Input
                              name="pincode"
                              value={profileData.pincode}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              placeholder="Pincode"
                              maxLength={6}
                              className="pl-14 h-16 bg-gray-50/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold disabled:opacity-70 disabled:bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="pt-6 border-t border-gray-50">
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 bg-[#373086] hover:bg-[#1e1b4b] text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all transform active:scale-95 group overflow-hidden"
                          >
                            {isLoading ? 'Synchronizing Registry...' : (
                              <span className="flex items-center justify-center gap-3">
                                Commit Data Updates <Save size={20} className="group-hover:rotate-12 transition-transform" />
                              </span>
                            )}
                          </Button>
                        </div>
                      )}
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="password" className="mt-0 outline-none">
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                    <div className="mb-10 text-center">
                      <div className="w-16 h-16 bg-blue-50 text-[#373086] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} />
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Security Protocol</h3>
                      <p className="text-sm text-gray-500 font-medium">Re-initialize your professional access key for enhanced protection.</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto space-y-8">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Current Validation Key</Label>
                          <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                            <Input
                              name="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              required
                              placeholder="Verify Current Identity"
                              className="pl-14 h-16 bg-gray-50/50 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">New Access Signal</Label>
                          <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                            <Input
                              name="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              required
                              placeholder="Establish New Protocol"
                              className="pl-14 h-16 bg-gray-50/50 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Confirm Signal Matrix</Label>
                          <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-[#373086] transition-colors w-5 h-5" />
                            <Input
                              name="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                              placeholder="Verify Signal Match"
                              className="pl-14 h-16 bg-gray-50/50 border-none rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-[#373086] transition-all text-gray-700 font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-16 bg-[#373086] hover:bg-[#1e1b4b] text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all transform active:scale-95 group overflow-hidden"
                      >
                        {isLoading ? 'Updating Protocol...' : (
                          <span className="flex items-center justify-center gap-3">
                            Reset Security Hub <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;