"use client"
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, ShoppingBag, Users, CreditCard, 
  Loader2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

import { getAdminStats } from '@/lib/api'; 
import StatCard from './_components/StatCard';
import OrderRow from './_components/OrderRow';

const PIE_COLORS = ['#B0264F', '#D9A15B', '#631B31', '#F2C94C'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const statsData = await getAdminStats(); // api.js এর ফাংশনটি ব্যবহার করা হয়েছে
      if (statsData) {
        setData(statsData);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#B0264F] mb-4" size={48} />
        <p className="text-gray-500 font-medium">Syncing Dashboard Data...</p>
      </div>
    );
  }

  const hasSalesData = data?.salesData && data.salesData.length > 0;

  // ক্যাটাগরি ডাটা যদি ব্যাকএন্ড থেকে না আসে তবে এটি ফলব্যাক হিসেবে থাকবে
  const categoryData = data?.categoryStats || [
    { name: 'Category 1', value: 400 },
    { name: 'Category 2', value: 300 },
    { name: 'Category 3', value: 300 },
    { name: 'Category 4', value: 200 },
  ];

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen font-sans text-gray-900">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black tracking-tight">Dashboard Overview</h1>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Update: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Revenue" value={`$${data?.stats?.totalRevenue?.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Orders" value={data?.stats?.totalOrders} icon={ShoppingBag} />
        <StatCard title="Customers" value={data?.stats?.totalCustomers} icon={Users} />
        <StatCard title="Avg. Order Value" value={`$${data?.stats?.avgOrderValue?.toFixed(2)}`} icon={CreditCard} />
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Sales Overview */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-96 flex flex-col">
          <div className="mb-4">
            <h3 className="font-extrabold text-sm uppercase tracking-tighter">Sales Overview</h3>
            <p className="text-[10px] text-gray-400 font-bold">Monthly Revenue Distribution</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            {hasSalesData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={data.salesData} margin={{ left: -20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" width={40} />
                  <Tooltip cursor={{fill: '#f9fafb'}} />
                  <Bar dataKey="revenue" fill="#B0264F" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-300 text-xs mt-10">No Sales Data</p>}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-96 flex flex-col">
          <div className="mb-4">
            <h3 className="font-extrabold text-sm uppercase tracking-tighter">Revenue Trend</h3>
            <p className="text-[10px] text-gray-400 font-bold">Revenue Growth Over Time</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            {hasSalesData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.salesData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B0264F" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#B0264F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#B0264F" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-300 text-xs mt-10">No Trend Data</p>}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-96 flex flex-col">
          <div className="mb-4">
            <h3 className="font-extrabold text-sm uppercase tracking-tighter">Sales by Category</h3>
          </div>
          <div className="flex-1 relative min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                <span className="text-lg font-black text-[#B0264F]">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-10">
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black mb-8">Recent Orders</h2>
          <div className="space-y-2">
            {data?.recentOrders?.map((order) => (
              <OrderRow 
                key={order._id}
                orderId={order.transactionId?.toUpperCase().slice(-6)}
                customer={order.customerInfo ? `${order.customerInfo.firstName} ${order.customerInfo.lastName}` : "Guest"}
                amount={order.totalAmount}
                status={order.orderStatus}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black mb-8">Top Products</h2>
          <div className="space-y-6">
            {data?.topProducts?.map((product) => (
              <div key={product._id} className="flex justify-between items-center group">
                <div className="flex gap-4 items-center">
                   <img src={product.thumbnail || "/placeholder.png"} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-50" />
                   <div>
                      <p className="font-bold text-sm leading-tight">{product.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                         Top Seller
                      </p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-black text-sm">${product.salePrice}</p>
                   <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Price</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;