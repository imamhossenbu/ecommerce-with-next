"use client"

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion'; 
import Image from 'next/image'; // Import Next.js Image component

// Import images (Next.js treats these as objects)
import hero1 from '@/../public/assets/hero.png'
import hero2 from '@/../public/assets/hero2.png'
import hero3 from '@/../public/assets/hero3.png'

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import Link from 'next/link';

export default function Hero() {
  const images = [hero1, hero2, hero3];

  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center overflow-hidden bg-black">
      
      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation]}
          effect="fade"
          speed={1000}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            prevEl: '.prev-btn',
            nextEl: '.next-btn',
          }}
          loop={true}
          className="h-full w-full"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full overflow-hidden">
                {/* Use Next.js Image component for automatic optimization */}
                <Image
                  src={img}
                  alt={`Hero slide ${index + 1}`}
                  fill // Makes image fill the container
                  priority={index === 0} // Loads first image faster
                  className="object-cover transition-transform duration-[7000ms] scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/45 z-10"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="site-container relative z-10 w-full">
        {/* Your Text Content remains the same */}
        <div className="max-w-[650px] text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.1] text-white">
              Discover your skin's <br /> true potential
            </h1>
            <p className="text-lg text-gray-100 mb-10 max-w-[500px]">
              Premium skincare that combines innovation with clean, effective 
              ingredients for all skin types.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href='/shop'>
              <button className="bg-white text-black px-10 py-4 rounded-full text-[14px] font-semibold hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                Shop Now
              </button>
              </Link>
              <Link href={'/about'}>
              <button className="bg-white/15 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full text-[14px] font-medium hover:bg-white/25 transition-all duration-300 shadow-lg transform hover:-translate-y-1 cursor-pointer">
                About Us
              </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="absolute bottom-10 right-10 z-20 hidden md:flex gap-4">
        <button className="prev-btn w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 cursor-pointer outline-none">
          <ChevronLeft size={24} />
        </button>
        <button className="next-btn w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 cursor-pointer outline-none">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}