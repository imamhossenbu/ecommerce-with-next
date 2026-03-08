"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Users, UserPlus, UserX, DollarSign, ChevronLeft, ChevronRight, MoreVertical, Trash2, UserCog, Power, Filter } from 'lucide-react';
import { getManageCustomers, updateProfileByAdmin, deleteUser } from '../../../../lib/api'; 
import { Table, StatusBadge } from '../orders/_components/Table';
import toast from 'react-hot-toast';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null); 
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); 
  const [stats, setStats] = useState({ totalCustomers: 0, newCustomers: 0, inactiveCustomers: 0, avgOrderValue: 0 });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getManageCustomers({ page, limit, search, status: statusFilter, role: roleFilter });
      if (res.success) {
        setCustomers(res.data || []);
        setStats(res.stats || {});
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) { console.error("Fetch Error:", err); } 
    finally { setLoading(false); }
  }, [page, search, statusFilter, roleFilter, limit]);

  useEffect(() => {
    const delay = setTimeout(fetchData, 500);
    return () => clearTimeout(delay);
  }, [fetchData]);

  const handleUpdate = async (userId, data) => {
    setActiveMenu(null);
    try {
      setUpdatingId(userId);
      const res = await updateProfileByAdmin({ userId, ...data }); 
      if (res.success) {
        toast.success("Update successful");
        fetchData(); 
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) { toast.error("Update failed"); } 
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (userId) => {
    setActiveMenu(null);
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        setUpdatingId(userId);
        const res = await deleteUser(userId);
        if (res.success) {
          toast.success("User deleted");
          fetchData();
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) { toast.error("Delete failed"); } 
      finally { setUpdatingId(null); }
    }
  };

  console.log(stats)

  const headers = [
    { label: 'ID' }, { label: 'Customer' }, { label: 'Email' }, 
    { label: 'Role' }, { label: 'Total Spent' }, { label: 'Status' }, 
    { label: 'Action', align: 'center' }
  ];

  return (
    <div className="space-y-8 p-4 font-sans max-w-[1600px] mx-auto">
      {/* Header & Stats Cards */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-800">Manage Customers</h2>
        <div className="text-[10px] font-black bg-gray-100 px-4 py-2 rounded-full text-gray-400 uppercase tracking-widest">
            {stats.totalCustomers} Users Total
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Customers" value={stats.totalCustomers} icon={<Users size={20}/>} />
        <StatCard title="New Users" value={stats.newCustomers} icon={<UserPlus size={20}/>} />
        <StatCard title="Inactive" value={stats.inactiveCustomers} icon={<UserX size={20}/>} color="text-red-500" />
        <StatCard title="Avg Spent" value={`$${Math.round(stats.avgOrderValue || 0).toLocaleString()}`} icon={<DollarSign size={20}/>} color="text-green-600" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 flex flex-col lg:flex-row gap-4 shadow-sm items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-100 transition-all" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => {setSearch(e.target.value); setPage(1);}} 
          />
        </div>

        {/* Filter Dropdowns (Right Side) */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-gray-400 mr-2">
                <Filter size={16} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Filters:</span>
            </div>

            {/* Status Filter */}
            <select 
                className="flex-1 lg:w-36 bg-white border border-gray-100 px-4 py-3 rounded-2xl text-xs font-bold text-gray-500 outline-none focus:border-pink-200 cursor-pointer shadow-sm"
                value={statusFilter}
                onChange={(e) => {setStatusFilter(e.target.value); setPage(1);}}
            >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>

            {/* Role Filter */}
            <select 
                className="flex-1 lg:w-36 bg-white border border-gray-100 px-4 py-3 rounded-2xl text-xs font-bold text-gray-500 outline-none focus:border-pink-200 cursor-pointer shadow-sm"
                value={roleFilter}
                onChange={(e) => {setRoleFilter(e.target.value); setPage(1);}}
            >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" size={40} /></div>
        ) : (
          <>
            <Table headers={headers}>
              {customers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 border-b border-gray-50 transition-colors group relative">
                  <td className="px-4 py-6 text-[10px] font-black text-gray-300 uppercase">#{user._id.slice(-5)}</td>
                  <td className="px-4 py-6 text-sm font-bold text-gray-800 capitalize">{user.name || user.firstName} {user.lastName}</td>
                  <td className="px-4 py-6 text-sm text-gray-400">{user.email}</td>
                  <td className="px-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${user.role === 'admin' ? 'text-pink-500 bg-pink-50' : 'text-blue-500 bg-blue-50'}`}>
                        {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-6 text-sm font-black text-gray-900">${(user.totalSpent || 0).toLocaleString()}</td>
                  <td className="px-4 py-6 text-center"><StatusBadge status={user.status || 'Active'} /></td>

                  {/* Three Dot Action Menu */}
                  <td className="px-4 py-6 text-center">
                    {updatingId === user._id ? (
                        <Loader2 size={16} className="animate-spin mx-auto text-pink-500" />
                    ) : (
                        <div className="relative inline-block text-left">
                            <button 
                                onClick={() => setActiveMenu(activeMenu === user._id ? null : user._id)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900"
                            >
                                <MoreVertical size={20} />
                            </button>

                            {activeMenu === user._id && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 py-2 animate-in fade-in zoom-in duration-200">
                                        <button 
                                            onClick={() => handleUpdate(user._id, { role: user.role === 'admin' ? 'user' : 'admin' })}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            <UserCog size={16} /> Make {user.role === 'admin' ? 'User' : 'Admin'}
                                        </button>
                                        <button 
                                            onClick={() => handleUpdate(user._id, { status: user.status === 'Inactive' ? 'Active' : 'Inactive' })}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            <Power size={16} /> {user.status === 'Inactive' ? 'Activate' : 'Deactivate'} User
                                        </button>
                                        <hr className="my-1 border-gray-50" />
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={16} /> Delete Customer
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </Table>
            
            <div className="p-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white shadow-sm"><ChevronLeft size={18} /></button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white shadow-sm"><ChevronRight size={18} /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color = "text-gray-900" }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</span>
      <div className="p-2 bg-gray-50 rounded-lg text-gray-400">{icon}</div>
    </div>
    <h4 className={`text-3xl font-black ${color}`}>{value}</h4>
  </div>
);

export default ManageCustomers;