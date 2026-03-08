import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react'; // আইকন ব্যবহারের জন্য lucide-react ব্যবহার করা হয়েছে

const OtherWaysSection = () => {
  const contactInfo = [
    {
      icon: <Mail size={24} className="text-black" />,
      label: "Email",
      value: "seoulmirage@gmail.com"
    },
    {
      icon: <Phone size={24} className="text-black" />,
      label: "Phone",
      value: "+82 2 123 4567"
    },
    {
      icon: <MapPin size={24} className="text-black" />,
      label: "Address",
      value: "123 Beauty Lane, Gangnam, Seoul, South Korea"
    }
  ];

  return (
    <section className="bg-[#F5E6D3] py-10">
      <div className="site-container px-6">
        
        {/* Section Heading */}
        <h2 className="heading-font text-[32px] md:text-[36px] font-medium mb-16 text-primary">
          Other Ways to Reach Us
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex flex-col space-y-4">
              {/* Icon and Label Row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center">
                  {info.icon}
                </div>
                <h3 className="font-bold text-[18px] text-primary">
                  {info.label}
                </h3>
              </div>
              
              {/* Value Text */}
              <p className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed pl-10 md:pl-10">
                {info.value}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OtherWaysSection;