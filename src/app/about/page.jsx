import React from 'react';
import StorySection from './_componnets/StorySection';
import JourneySection from './_componnets/JourneySection';
import PhilosophySection from './_componnets/PhilosophySection';
import IngredientsSection from './_componnets/IngredientsSection';
import JoinCommunity from '@/components/JoinCommunity';



export default function AboutPage() {
  return (
    <main className="overflow-x-hidden">
      <div className="">
        
        <StorySection />
        
        <JourneySection />
        
        <PhilosophySection />
        <IngredientsSection/>
        <JoinCommunity/>
        
      </div>
    </main>
  );
}