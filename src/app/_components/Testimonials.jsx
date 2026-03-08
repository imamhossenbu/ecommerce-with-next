"use client"
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star } from 'lucide-react';
import { getHomeReviews } from '../../lib/api';
import TestimonialSkeleton from '../../components/skeletons/TestimonialSkeleton';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getHomeReviews();
        if (res.success) {
          setReviews(res.data);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);



  return (
    <section className="py-20 bg-white relative">
      <div className="site-container text-center">
        {/* Header Section */}
        <p className="text-accent text-[14px] font-medium mb-2">3940+ Happy Users</p>
        <h2 className="text-[32px] md:text-[40px] font-semibold text-[#A68B7C] mb-12">
          Don't just take our words
        </h2>

        {loading ? (
          <TestimonialSkeleton />
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ 
              clickable: true,
            }}
            breakpoints={{
              1024: { slidesPerView: 2 } 
            }}
            className="testimonial-swiper !pb-28" 
          >
            {reviews.map((rev) => (
              <SwiperSlide key={rev._id}>
                <div className="flex flex-col md:flex-row items-center gap-8 text-left p-6 bg-white rounded-2xl">
                  {/* User Image Area */}
                  <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-md border border-gray-100">
                    <img 
                      src={rev.userID?.profileImage || "/assets/user-placeholder.png"} 
                      alt={rev.userID?.name || "User"} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Review Content Area */}
                  <div className="w-full md:w-2/3">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={i < rev.rating ? "fill-accent text-accent" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <p className="text-secondary text-[16px] leading-relaxed mb-6 italic min-h-17.5">
                      "{rev.comment}"
                    </p>
                    <h4 className="text-primary font-bold text-[18px]">
                      {rev.userID?.name || "Verified User"} 
                    </h4>
                    <p className="text-[12px] text-muted mt-1">Verified Buyer</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Custom Styles for Pagination */}
      <style jsx global>{`
        .testimonial-swiper .swiper-pagination {
          bottom: 10px !important; 
        }
        
        .testimonial-swiper .swiper-pagination-bullet {
          background: #E5E5E5;
          opacity: 1;
          width: 8px;
          height: 8px;
          margin: 0 6px !important;
          transition: all 0.3s ease;
        }

        .testimonial-swiper .swiper-pagination-bullet-active {
          background: #d06f8b !important; /* আপনার থিম কালার */
          width: 24px;
          border-radius: 5px;
        }
      `}</style>
    </section>
  );
}