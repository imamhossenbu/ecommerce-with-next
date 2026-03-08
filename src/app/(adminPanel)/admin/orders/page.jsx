"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Package, AlertTriangle, CheckCircle, TrendingUp, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../../../lib/api'; 
import { Table, StatusBadge } from './_components/Table';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  // API Query & Pagination States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    revenue: 0
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllOrders({ 
        page, 
        limit, 
        search, 
        status: statusFilter 
      });
      
      if (result?.success) {
        setOrders(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalOrders(result.totalProducts || 0);

        if (result.stats) {
          setStats({
            total: result.stats.totalOrders || 0,
            pending: result.stats.pendingOrders || 0,
            delivered: result.data?.filter(o => o.orderStatus === 'Delivered').length || 0,
            revenue: result.stats.totalRevenue || 0
          });
        }
      }
    } catch (error) {
      console.error("Order Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, limit]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchOrders]);


  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders(); 
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const orderHeaders = [
    { label: 'Order ID' },
    { label: 'Customer' },
    { label: 'Date' },
    { label: 'Total' },
    { label: 'Payment', align: 'center' },
    { label: 'Status', align: 'center' },
    { label: 'Action', align: 'center' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 font-sans p-2 md:p-4 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Manage Orders</h2>
        <div className="text-xs font-bold text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
          Total: {totalOrders} Results
        </div>
      </div>

      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Orders" value={stats.total} icon={<Package size={20} />} />
        <StatCard title="Pending Payment" value={stats.pending} icon={<AlertTriangle size={20} />} color="text-orange-500" />
        <StatCard title="Delivered" value={stats.delivered} icon={<CheckCircle size={20} />} color="text-green-500" />
        <StatCard 
          title="Total Revenue" 
          value={`$${(Number(stats.revenue) || 0).toLocaleString()}`} 
          icon={<TrendingUp size={20} />} 
          color="text-blue-600" 
          isRevenue 
        />
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white p-3 md:p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Search transaction or customer..." 
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            className="w-full sm:w-44 bg-white border border-gray-100 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 outline-none cursor-pointer hover:bg-gray-50"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">Payment Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* 3. Table Section */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="h-64 md:h-96 flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" size={40} /></div>
        ) : (
          <>
            <Table headers={orderHeaders}>
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50">
                  <td className="px-4 py-6 text-[11px] font-black text-gray-400">
                    #{order?.transactionId?.slice(-6).toUpperCase() || "N/A"}
                  </td>
                  <td className="px-4 py-6 text-sm font-bold text-gray-800">
                    {order?.customerInfo?.firstName}
                  </td>
                  <td className="px-4 py-6 text-sm font-bold text-gray-400 text-nowrap">
                    {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : "N/A"}
                  </td>
                  <td className="px-4 py-6 text-sm font-black text-gray-900">
                    ${(Number(order?.totalAmount) || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-6 text-center">
                    <StatusBadge status={order?.paymentStatus} />
                  </td>
                  <td className="px-4 py-6 text-center">
                    <StatusBadge status={order?.orderStatus || 'Processing'} />
                  </td>
                  <td className="px-4 py-6 text-center">
                    {updatingId === order._id ? (
                      <Loader2 size={16} className="animate-spin mx-auto text-pink-500" />
                    ) : (
                      <select 
                        className="bg-gray-50 border border-gray-200 text-[10px] font-black uppercase py-1.5 px-2 rounded-lg cursor-pointer focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                        value={order.orderStatus || "Processing"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Processing">Process</option>
                        <option value="Shipped">Ship</option>
                        <option value="Delivered">Deliver</option>
                        <option value="Cancelled">Cancel</option>
                      </select>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={orderHeaders.length} className="px-4 py-20 text-center text-gray-400 font-bold">No orders found.</td></tr>
              )}
            </Table>

            {/* 4. Pagination */}
            <div className="px-6 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-gray-400">
                Showing {totalOrders > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalOrders)} of {totalOrders}
              </p>
              <div className="flex items-center gap-1.5">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-50"
                ><ChevronLeft size={18} /></button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${page === i + 1 ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100 text-gray-400'}`}
                  >{i + 1}</button>
                ))}

                <button 
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-50"
                ><ChevronRight size={18} /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color = "text-gray-900", isRevenue = false }) => (
  <div className="bg-white p-5 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</span>
        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">{icon}</div>
    </div>
    <div className="flex items-baseline justify-between">
        <h4 className={`text-2xl md:text-3xl font-black tracking-tight ${color}`}>{value}</h4>
        {isRevenue && <span className="text-[9px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full ring-1 ring-green-100">Live</span>}
    </div>
  </div>
);

export default AdminOrders;