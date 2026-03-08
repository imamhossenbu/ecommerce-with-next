import React from 'react';
import Image from 'next/image';
import contactImg from '../../../../public/assets/contact1.png'; 

const ContactSection = () => {
  return (
    <section id="contact-form-sec" className="bg-white overflow-hidden">
      <div className="site-container flex flex-col md:flex-row items-end">
        
        <div className="flex-1 py-10 md:py-14 px-6 md:pr-16 w-full">
          <div className="max-w-[500px] space-y-8">
            <div className="space-y-2">
              <h3 className="font-bold text-[18px] text-primary">Get in Touch</h3>
              <p className="text-gray-500 text-[14px] leading-relaxed">
                Have a question or need assistance? Fill out the form below and our team will get back to you as soon as possible.
              </p>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-medium text-gray-700 uppercase tracking-wider">How can we help</label>
                <textarea 
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:border-black transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="inline-block border border-black rounded-full px-8 py-2.5 text-[13px] font-medium hover:bg-black hover:text-white transition-all duration-300"
              >
                Let Us Know
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1 w-full relative" style={{ height: '500px' }}>
          <Image 
            src={contactImg} 
            alt="Contact Product" 
            fill
            className="object-cover object-bottom"
          />
        </div>

      </div>
    </section>
  );
};

export default ContactSection;