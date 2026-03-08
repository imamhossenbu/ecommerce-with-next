"use client"

import React, { useState, useEffect, useContext } from 'react';
import { User, Package, Camera, Loader2 } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { updateProfile, getUserOrders, changePassword } from '../../lib/api';
import { toast } from 'react-hot-toast';

// Reusable Components
import InputField from './_components/InputField';
import SelectField from './_components/SelectField';
import { handleLogout } from '../../lib/axiosInstance';
import { useRouter } from 'next/navigation';

const MyAccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout, setUser } = useContext(AuthContext);


  return (
    <div className="bg-white min-h-screen pb-20 pt-16">
      <div className="site-container">
        <h1 className="text-[42px] font-medium text-[#1A1A1A] mb-10 tracking-tight">My Account</h1>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-16">
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={<User size={16} />} 
            label="Profile" 
          />
          <TabButton 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')} 
            icon={<Package size={16} />} 
            label="Order History" 
          />
        </div>

        {activeTab === 'profile' ? (
          <ProfileTab user={user} setUser={setUser} logout={logout} />
        ) : (
          <OrderHistoryTab />
        )}
      </div>
    </div>
  );
};

// --- Sub-component: Profile Tab ---
const ProfileTab = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  
  // States for Forms
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'Bangladesh'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update form fields when user data changes (after update)
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'Bangladesh'
      });
      setImagePreview(user.profileImage);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      data.append('name', fullName);
      
      // Append other fields except name splits
      Object.keys(formData).forEach(key => {
        if(key !== 'firstName' && key !== 'lastName' && key !== 'email') {
          data.append(key, formData[key] || "");
        }
      });
      
      if (selectedFile) data.append('image', selectedFile);

      const res = await updateProfile(data);
      if (res && res.success) {
        setUser(res.data); // Update AuthContext
        toast.success(res.message || "Profile updated successfully!");
        setSelectedFile(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

 const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // ১. ভ্যালিডেশন
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      return toast.error("Please fill all password fields");
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }

    if (passwordData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      // ২. এপিআই কল
      const res = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (res.success) {
        toast.success("Password updated successfully!");
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-250">
       {/* User Information Section */}
       <section className="mb-16">
          <h2 className="text-[20px] font-medium mb-8">User Information</h2>
          <div className="relative w-[110px] h-[110px] mb-10 group">
            <img 
               src={imagePreview || "/default-avatar.png"} 
               className="w-full h-full rounded-full object-cover border border-gray-200 shadow-sm" 
               alt="Profile" 
            />
            <label className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <Camera size={14} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <InputField label="First name" value={formData.firstName} onChange={(v)=>setFormData({...formData, firstName: v})} />
            <InputField label="Last name" value={formData.lastName} onChange={(v)=>setFormData({...formData, lastName: v})} />
            <InputField label="Email" value={formData.email} disabled />
            <InputField label="Phone" value={formData.phone} onChange={(v)=>setFormData({...formData, phone: v})} />
            <div className="md:col-span-2">
               <button disabled={loading} className="bg-black text-white px-8 py-2.5 text-[13px] font-medium rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity">
                 {loading && <Loader2 size={14} className="animate-spin" />} Update Profile
               </button>
            </div>
          </form>
       </section>

       {/* Shipping Address Section */}
       <section className="mb-16">
          <h2 className="text-[20px] font-medium mb-8">Shipping Address</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <InputField label="Apartment, suite, etc. (optional)" value={formData.address} onChange={(v)=>setFormData({...formData, address: v})} full />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="City" value={formData.city} onChange={(v)=>setFormData({...formData, city: v})} />
              <SelectField 
                label="State/Province" 
                options={['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal']} 
                value={formData.state} 
                onChange={(v)=>setFormData({...formData, state: v})} 
              />
              <InputField label="Postal Code" value={formData.zipCode} onChange={(v)=>setFormData({...formData, zipCode: v})} />
            </div>
            <SelectField 
                label="Country" 
                options={['Bangladesh', 'USA', 'UK', 'Canada']} 
                value={formData.country} 
                onChange={(v)=>setFormData({...formData, country: v})} 
                full 
            />
            <button disabled={loading} className="bg-black text-white px-8 py-2.5 text-[13px] font-medium rounded-full">
              Update Shipping Address
            </button>
          </form>
       </section>

       {/* Change Password Section */}
       <section className="mb-16">
          <h2 className="text-[20px] font-medium mb-8">Change Password</h2>
          <form onSubmit={handlePasswordUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <InputField 
    label="Current Password" 
    type="password"  
    value={passwordData.currentPassword} 
    onChange={(v) => setPasswordData({...passwordData, currentPassword: v})} 
/>
                <InputField 
                    label="New Password" 
                    type="password" 
                    value={passwordData.newPassword} 
                    onChange={(v) => setPasswordData({...passwordData, newPassword: v})} 
                />
                <InputField 
                    label="Confirm New Password" 
                    type="password" 
                    value={passwordData.confirmPassword} 
                    onChange={(v) => setPasswordData({...passwordData, confirmPassword: v})} 
                />
            </div>
            <button 
  disabled={loading} 
  className="bg-black text-white px-8 py-2.5 text-[13px] font-medium rounded-full mb-12 flex items-center gap-2"
>
  {loading && <Loader2 size={14} className="animate-spin" />}
  Change Password
</button>
          </form>
          
          <div className="pt-8 border-t">
            <button onClick={handleLogout} className="text-[#FF4D4D] border border-[#FF4D4D] px-8 py-2 rounded-full text-[13px] font-medium hover:bg-red-50 transition-colors">
              Log Out
            </button>
          </div>
       </section>
    </div>
  );
};

// --- Sub-component: Order History Tab ---
const OrderHistoryTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getUserOrders().then(res => {
      if (res?.success) setOrders(res.data);
    
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
    console.log(orders)

  if (loading) return <div className="py-20 text-center font-medium">Loading orders...</div>;

  return (
    <div className="space-y-6 max-w-[1000px]">
      {orders.length === 0 ? (
        <p className="text-gray-500 py-10">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border border-[#E5E5E5] rounded-lg p-8 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-[18px] font-medium text-[#1A1A1A] mb-1">Order #{order.transactionId?.toUpperCase().slice(-8)}</h4>
                <p className="text-[#757575] text-[14px]">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-bold text-green-600 uppercase mb-1">Delivered</p>
                <p className="text-[#1A1A1A] font-medium">৳{order.totalAmount}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-8 border-t pt-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-[14px] text-[#757575]">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="text-[#1A1A1A]">৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <button
            onClick={() => router.push(`/order-details/${order._id}`)}
            className="w-full py-2.5 border border-[#1A1A1A] rounded-md text-[13px] font-medium hover:bg-black hover:text-white transition-all">
              View Order Details
            </button>
          </div>
        ))
      )}
    </div>
  );
};

// Helper Component: Tab Button
const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-medium transition-all ${
      active ? 'bg-black text-white' : 'border border-[#E5E5E5] text-[#1A1A1A]'
    }`}
  >
    {icon} {label}
  </button>
);

export default MyAccountPage;