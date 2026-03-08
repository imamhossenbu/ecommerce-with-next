"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import faqSideImg from '../../../../public/assets/contact2.png'; 
import Image from 'next/image';

const FAQSection = () => {

  const [activeIndex, setActiveIndex] = useState(1); 

  const faqs = [
    {
      question: "Figma ipsum component variant main layer.?",
      answer: "Figma ipsum component variant main layer. Line ellipse object list undo rectangle duplicate editor distribute overflow. Arrow pen union device share scrolling style. Ipsum arrow flows shadow horizontal inspect resizing arranging arrange. Figma layer slice bold invite outline polygon rotate library."
    },
    {
      question: "Figma ipsum component variant main layer.?",
      answer: "Figma ipsum component variant main layer. Line ellipse object list undo rectangle duplicate editor distribute overflow. Arrow pen union device share scrolling style. Ipsum arrow flows shadow horizontal inspect resizing arranging arrange. Figma layer slice bold invite outline polygon rotate library. Arrange shadow outline plugin undo. Invite distribute draft plugin pencil scale polygon invite pencil pixel."
    },
    {
      question: "Figma ipsum component variant main layer.?",
      answer: "Figma ipsum component variant main layer. Line ellipse object list undo rectangle duplicate editor distribute overflow. Arrow pen union device share scrolling style."
    },
    {
      question: "Figma ipsum component variant main layer.?",
      answer: "Figma ipsum component variant main layer. Line ellipse object list undo rectangle duplicate editor distribute overflow. Arrow pen union device share scrolling style."
    },
    {
      question: "Figma ipsum component variant main layer.?",
      answer: "Figma ipsum component variant main layer. Line ellipse object list undo rectangle duplicate editor distribute overflow. Arrow pen union device share scrolling style."
    },
    {
      question: "Figma ipsum component variant main layer.?",
      answer: "Figma ipsum component variant main layer. Line ellipse object list undo rectangle duplicate editor distribute overflow. Arrow pen union device share scrolling style."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq-sec" className="bg-white overflow-hidden">
      <div className="site-container flex flex-col md:flex-row items-stretch">
        
        <div className="flex-1 hidden md:block relative min-h-[600px]">
          <Image 
            src={faqSideImg} 
            alt="Skin Care Products" 
            fill
            className="object-cover object-center" 
          />
        </div>

        <div className="flex-1 py-16 md:py-24 px-6 md:pl-16 flex flex-col justify-center">
          <div className="max-w-[600px] space-y-8">
            <div className="space-y-4">
              <h2 className="heading-font text-[32px] md:text-[42px] font-medium leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 text-[14px] leading-relaxed">
                Find answers to our most commonly asked questions. If you can't find what you're looking for, please contact us.
              </p>
            </div>

            <div className="space-y-0 border-t border-gray-300">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-300">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full py-5 flex justify-between items-center text-left hover:text-gray-600 transition-colors"
                  >
                    <span className="text-[16px] font-medium text-primary">
                      {faq.question}
                    </span>
                    {activeIndex === index ? (
                      <ChevronUp size={20} className="text-black" />
                    ) : (
                      <ChevronDown size={20} className="text-black" />
                    )}
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      activeIndex === index ? 'max-h-[500px] pb-5' : 'max-h-0'
                    }`}
                  >
                    <p className="text-gray-500 text-[14px] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;