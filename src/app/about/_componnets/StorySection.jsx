import React from 'react';
import storyImg from '../../../../public/assets/story.png';
import Image from 'next/image';

const StorySection = () => {
  return (
    <section id="story-sec" className="bg-[#F5E6D3] overflow-hidden">
      <div className="site-container flex flex-col md:flex-row items-stretch">
        <div className="content-col flex-1 py-16 md:py-24 space-y-6 md:pr-10 flex flex-col justify-center">
          <h2 className="heading-font text-[36px] md:text-[48px] text-primary leading-tight">
            Our <strong className="font-bold">Story</strong>
          </h2>
          <p className="text-gray-600 text-[16px] leading-relaxed max-w-[500px]">
            Seoul Mirage was born from a passion for Korean skincare innovation 
            and a commitment to creating luxury products that deliver exceptional results.
          </p>
        </div>

        <div className="image-col flex-1">
          <Image 
            src={storyImg} 
            alt="Our Story" 
            className="w-full h-full object-cover block"
            style={{ minHeight: '350px' }}
          />
        </div>

      </div>
    </section>
  );
};

export default StorySection;