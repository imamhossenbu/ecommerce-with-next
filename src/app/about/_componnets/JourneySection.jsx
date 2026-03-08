import React from 'react';
import journeyImg from '../../../../public/assets/journey.png';
import Image from 'next/image';

const JourneySection = () => (
  <section id="journey-sec" className="overflow-hidden">

    <div className="site-container flex flex-col md:flex-row items-stretch">
      
      
      <div className="image-col flex-1">
        <Image 
          src={journeyImg}
          alt="Our Journey"
          className="w-full h-full object-cover block"
          style={{ minHeight: '350px' }} 
        />
      </div>
      <div className="content-col flex-1 py-16 md:py-24 space-y-6 md:pl-16 px-6 flex flex-col justify-center">
        <h2 className="heading-font text-[32px] md:text-[42px] font-medium text-primary leading-tight">
          Our <strong className="font-bold">Journey</strong>
        </h2>
        <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed max-w-[500px]">
          <p>
            Founded in 2018 by skincare enthusiast and biochemist Dr. Ji-Yoon Park, 
            Seoul Mirage began as a small laboratory in the heart of Seoul's beauty district. 
            Frustrated by the prevalence of products with harsh chemicals and unfulfilled promises, 
            Dr. Park set out to create a line that combined traditional Korean ingredients with cutting-edge science.
          </p>
          <p>
            What started as a passion project quickly gained recognition for its exceptional quality 
            and remarkable results.
          </p>
        </div>
      </div>

    </div>
  </section>
);

export default JourneySection;