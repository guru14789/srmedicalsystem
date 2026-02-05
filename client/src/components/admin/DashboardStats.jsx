import { firebaseService } from '@/lib/firebaseService';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, TrendingUp, CreditCard, Wallet, MapPin, Activity, Zap, ArrowUpRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';

const StatCard = ({ title, value, icon, description, trend }) => {
  return (
    <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-[#373086]/60">{title}</CardTitle>
        <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#373086] group-hover:bg-[#373086] group-hover:text-white transition-all">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-gray-900 tracking-tighter mb-1">{value}</div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ArrowUpRight size={10} /> +12%
          </span>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await firebaseService.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-white rounded-[2rem] animate-pulse border border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
        <Activity className="w-16 h-16 text-gray-200 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Awaiting Matrix Synchronization...</p>
      </div>
    );
  }

  const chartData = stats.monthly_revenue?.map(item => {
    const date = new Date(item.month + '-01');
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const label = item.is_current ? `${monthName}` :
      item.is_future ? `${monthName}` : monthName;

    return {
      name: label,
      revenue: parseFloat(item.revenue),
      isFuture: item.is_future || false
    };
  }) || [];

  const paymentMethodsData = stats.payment_methods ? Object.entries(stats.payment_methods).map(([method, count]) => ({
    name: method.toUpperCase(),
    value: count
  })) : [];

  const COLORS = ['#373086', '#4f46e5', '#818cf8', '#c7d2fe'];

  return (
    <div className="space-y-10">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Liquidity"
          value={`₹${stats.total_revenue?.toLocaleString() || '0'}`}
          icon={<DollarSign size={20} />}
          description="Global Revenue Matrix"
        />
        <StatCard
          title="Daily Signal"
          value={`₹${stats.today_revenue?.toLocaleString() || '0'}`}
          icon={<TrendingUp size={20} />}
          description="Cycle 24h Revenue"
        />
        <StatCard
          title="Deployment Count"
          value={stats.total_orders?.toLocaleString() || '0'}
          icon={<ShoppingCart size={20} />}
          description="Active Logistics Threads"
        />
        <StatCard
          title="Clinical Unit Value"
          value={`₹${stats.avg_order_value?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || '0'}`}
          icon={<Zap size={20} />}
          description="Mean Requisition Scale"
        />
      </div>

      <div className="grid gap-10 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-10 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Revenue Matrix</CardTitle>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Monthly Procurement Trend</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#373086]" />
                  <span className="text-[10px] font-black uppercase text-gray-500">Live Stream</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#373086" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#373086" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e1b4b',
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                      labelStyle={{ display: 'none' }}
                      formatter={(value) => [`₹${parseFloat(value).toLocaleString()}`, 'Signal']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#373086"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden h-full">
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Payment Mix</CardTitle>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Transaction Protocol Distribution</p>
            </CardHeader>
            <CardContent className="p-10">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3">
                {paymentMethodsData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-gray-900">{item.value} Units</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {stats.recent_orders && stats.recent_orders.length > 0 && (
        <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">live Order Intercepts</CardTitle>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time procurement stream</p>
            </div>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[#373086] hover:bg-blue-50">View Registry <ArrowUpRight size={14} className="ml-1" /></Button>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.recent_orders.slice(0, 6).map((order) => {
                const shippingAddr = order.shippingAddress || order.shipping_address || {};
                const city = typeof shippingAddr === 'object' ? shippingAddr.city : null;
                const status = order.status || order.orderStatus || 'pending';

                return (
                  <div key={order.id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-[#373086]/20 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#373086] group-hover:scale-110 transition-transform">
                        <Package size={24} />
                      </div>
                      <Badge className={`text-[8px] font-black uppercase tracking-widest rounded-full px-3 py-1 ${status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-gray-900 tracking-tight text-lg uppercase truncate">#{String(order.id || order.orderId).substring(0, 8)}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{order.user_name || order.customer_name}</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-lg font-black text-[#373086] tracking-tighter">₹{parseFloat(order.total_amount || order.totalAmount || 0).toLocaleString()}</div>
                      <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                        <MapPin size={10} /> {city || 'Global'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardStats;
