"use client"

import  { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Mail, BellRing, BellOff, Send } from 'lucide-react'; 
export default function JoinCommunity() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const savedStatus = localStorage.getItem('isSubscribed');
    if (savedStatus === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSubscribed(true);
    }
  }, []);

  const handleAction = (e) => {
    e.preventDefault();

    if (!isSubscribed) {
      localStorage.setItem('isSubscribed', 'true');
      setIsSubscribed(true);
      toast.success('Successfully subscribed to our newsletter!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#A68B7C',
          color: '#fff',
        },
      });
    } else {
      localStorage.removeItem('isSubscribed');
      setIsSubscribed(false);
      toast('You have unsubscribed.', {
        icon: <BellOff size={20} className="text-white" />, 
        style: {
          background: '#333',
          color: '#fff',
        },
      });
      setEmail('');
    }
  };

  return (
    <section className="bg-white py-8 ">
      <div className="site-container px-4 text-center">
        {/* Lucide Mail Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-accent/10 rounded-full text-accent">
            <Mail size={32} />
          </div>
        </div>

        <h2 className="text-[28px] md:text-[36px] font-semibold text-neutral-800 mb-4">
          Join Our Community
        </h2>

        <p className="text-secondary text-[14px] md:text-[16px] max-w-[650px] mx-auto leading-relaxed mb-10">
          Subscribe to our newsletter for exclusive offers, skincare tips, and new product announcements.
        </p>

        <form onSubmit={handleAction} className="max-w-[550px] mx-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-1">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={isSubscribed}
              className={`w-full px-6 py-3.5 pl-12 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-accent/50 text-neutral-800 transition-all ${isSubscribed ? 'bg-gray-100 opacity-60' : 'bg-white'}`}
            />
            {/* Input prefix icon */}
            <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <button 
            type="submit" 
            className={`w-full sm:w-auto px-10 py-3.5 font-medium rounded-full transition-all duration-300 text-white shadow-sm flex items-center justify-center gap-2 ${
              isSubscribed 
              ? 'bg-gray-400 hover:bg-gray-500' 
              : 'bg-accent hover:bg-accent/90 active:scale-95'
            }`}
          >
            {isSubscribed ? (
              <>
                <BellOff size={18} />
                Unsubscribe
              </>
            ) : (
              <>
                <BellRing size={18} />
                Subscribe
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}