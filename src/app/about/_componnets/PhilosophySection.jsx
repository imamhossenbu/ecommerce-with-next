import React from 'react';
import philImg from '../../../../public/assets/about-philosophy.png';
import Image from 'next/image';

const PhilosophySection = () => {
  const values = [
    { 
      title: "Purity", 
      desc: "We source the highest quality ingredients and maintain rigorous standards to ensure our products are free from harmful chemicals." 
    },
    { 
      title: "Innovation", 
      desc: "We continuously research and develop new formulations that harness the power of both traditional Korean ingredients and modern scientific breakthroughs." 
    },
    { 
      title: "Sustainability", 
      desc: "We are committed to ethical practices, from responsible sourcing to eco-friendly packaging, ensuring our beauty doesn't come at the expense of our planet." 
    }
  ];

  return (
    <section id="philosophy-sec" className=" overflow-hidden">
      <div className="site-container flex flex-col md:flex-row items-stretch">
        
        <div className="content-col flex-1 py-16 md:py-24 space-y-10 md:pr-16 px-6 flex flex-col justify-center">
          <div className="space-y-6">
            <h2 className="heading-font text-[36px] md:text-[42px] font-medium text-primary">
              Our <span className="font-bold">Philosophy</span>
            </h2>
            <p className="text-gray-600 text-[15px] leading-relaxed max-w-[500px]">
              Founded in 2018 by skincare enthusiast and biochemist Dr. Ji-Yoon Park, 
              Seoul Mirage began as a small laboratory in the heart of Seoul's beauty district.
            </p>
          </div>


          <div className="space-y-8">
            {values.map((v, i) => (
              <div key={i} className="border-l-[1.5px] border-black/30 pl-8 space-y-2 group transition-all duration-300 hover:border-black">
                <h4 className="font-bold text-[18px] uppercase tracking-wider text-primary">
                  {v.title}
                </h4>
                <p className="text-gray-500 text-[14px] leading-relaxed max-w-[420px]">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="image-col flex-1">
          <Image 
            src={philImg}
            alt="Philosophy" 
            className="w-full h-full object-cover block"
            style={{ minHeight: '500px' }} 
          />
        </div>

      </div>
    </section>
  );
};

export default PhilosophySection;