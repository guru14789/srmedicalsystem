import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MessageSquare,
  Star,
  ShieldCheck,
  Activity,
  Zap,
  Terminal,
  Settings,
  Bell
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/admin/DashboardStats';
import OrderList from '@/components/admin/OrderList';
import ProductList from '@/components/admin/ProductList';
import UserList from '@/components/admin/UserList';
import FormSubmissions from '@/components/admin/FormSubmissions';
import FeedbackList from '@/components/admin/FeedbackList';

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Clinical Command Center | SR Medical System</title>
        <meta name="description" content="Manage SR Medical System strategic operations, logistics, and data synchronization." />
      </Helmet>

      <div className="min-h-screen bg-gray-50/50 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Command Center Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-[#1e1b4b] rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full -mr-48 -mt-48" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em]">
                  <ShieldCheck size={14} /> Strategic Authorization Confirmed
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter">
                  Clinical Command Center
                </h1>
                <p className="text-blue-200/60 font-bold max-w-xl">
                  Operational oversight of medical logistics, user registry, and clinical data synchronization protocols.
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-4">
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-[#1e1b4b] bg-gray-200 overflow-hidden shadow-xl" />
                    ))}
                  </div>
                  <div>
                    <div className="text-white font-black text-lg tracking-tighter">14 Online</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-blue-300/40">Active Protocols</div>
                  </div>
                </div>
                <Button className="h-20 w-20 rounded-[2rem] bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20 transition-all active:scale-95">
                  <Bell size={28} />
                </Button>
              </div>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs defaultValue="dashboard" className="w-full">
              <div className="sticky top-24 z-30 mb-10 pb-2">
                <TabsList className="bg-white/80 backdrop-blur-xl p-2 h-auto rounded-[2rem] shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    { value: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                    { value: 'orders', label: 'Logistics', icon: ShoppingCart },
                    { value: 'products', label: 'Inventory', icon: Package },
                    { value: 'users', label: 'Registry', icon: Users },
                    { value: 'feedback', label: 'Signals', icon: Star },
                    { value: 'submissions', label: 'Submissions', icon: MessageSquare }
                  ].map(tab => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-2xl py-5 font-black uppercase tracking-widest text-[9px] data-[state=active]:bg-[#373086] data-[state=active]:text-white transition-all duration-500 flex flex-col items-center gap-2 group"
                    >
                      <tab.icon size={18} className="group-data-[state=active]:scale-110 transition-transform" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="dashboard" className="mt-0 outline-none">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                  <DashboardStats />
                </motion.div>
              </TabsContent>
              <TabsContent value="orders" className="mt-0 outline-none">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                    <div className="mb-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Supply Logistics</h3>
                        <p className="text-gray-500 font-bold">Global procurement and deployment records.</p>
                      </div>
                      <Button variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest border-2">Export Data Matrix</Button>
                    </div>
                    <OrderList />
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="products" className="mt-0 outline-none">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                    <div className="mb-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Inventory Core</h3>
                        <p className="text-gray-500 font-bold">Clinical device catalog and provisioning status.</p>
                      </div>
                      <Button className="bg-[#373086] rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl">+ Initialize New SKU</Button>
                    </div>
                    <ProductList />
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="users" className="mt-0 outline-none">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                    <div className="mb-10">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter">authorized Registry</h3>
                      <p className="text-gray-500 font-bold">Management of certified medical professionals and facilities.</p>
                    </div>
                    <UserList />
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="feedback" className="mt-0 outline-none">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                    <div className="mb-10">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Clinical Feedback Signals</h3>
                      <p className="text-gray-500 font-bold">Intercepted user satisfaction data and facility reviews.</p>
                    </div>
                    <FeedbackList />
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="submissions" className="mt-0 outline-none">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                    <div className="mb-10">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Inquiry Intercepts</h3>
                      <p className="text-gray-500 font-bold">Unprocessed clinical queries and collaboration requests.</p>
                    </div>
                    <FormSubmissions />
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Footer Terminal Style */}
            <div className="flex items-center justify-between px-10 py-6 bg-gray-100/50 rounded-3xl border border-gray-200/50 text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-[#373086]">
                  <Activity size={14} className="animate-pulse" /> System Nominal
                </span>
                <span className="opacity-40">|</span>
                <span>Protocol: v4.2.0-clinical</span>
              </div>
              <div className="flex items-center gap-4">
                <Terminal size={14} />
                <span>Secure Admin Session Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;