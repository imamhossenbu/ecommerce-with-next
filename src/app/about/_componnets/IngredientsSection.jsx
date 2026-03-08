import React from 'react';
import ingredient1 from '../../../../public/assets/ingredient1.jpg'
import ingredient2 from '../../../../public/assets/ingredient2.jpg'
import ingredient3 from '../../../../public/assets/ingredient3.jpg'
import Image from 'next/image';


const IngredientsSection = () => {
  const ingredients = [
    {
      title: "Botanical Extracts",
      desc: "From ginseng to green tea, our products harness the power of traditional Korean botanicals known for their skin-enhancing properties.",
      image:ingredient1
    },
    {
      title: "Fermented Ingredients",
      desc: "We utilize the ancient Korean practice of fermentation to enhance the potency and bioavailability of our active ingredients.",
      image: ingredient2
    },
    {
      title: "Scientific Compounds",
      desc: "Our formulations incorporate cutting-edge compounds like peptides, antioxidants, and hyaluronic acid for maximum efficacy.",
      image: ingredient3
    },
  ];

  return (
    <section id="ingredients-sec" className="bg-[#F5E6D3] py-24">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto px-4">
          <h2 className="heading-font text-[42px] md:text-[52px] text-primary">
            Our Ingredients
          </h2>
          <p className="text-gray-600 text-[16px] md:text-[18px] leading-relaxed">
            We believe in the power of nature enhanced by science. Our formulations combine time-honored Korean botanical ingredients with advanced scientific compounds to create products that deliver visible results.
          </p>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ingredients.map((item, index) => (
            <div 
              key={index} 
              className="relative group overflow-hidden rounded-sm aspect-[4/5] cursor-pointer shadow-lg"
            >
              {/* Image Background */}
              <Image 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

              {/* Text Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="text-[24px] font-medium mb-3">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-relaxed opacity-90">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default IngredientsSection;