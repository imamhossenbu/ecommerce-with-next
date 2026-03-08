import Image from "next/image";
import Hero from "./_components/Hero";
import Bestsellers from "./_components/BestSeller";
import CategorySection from "./_components/CategorySection";
import NewArrivals from "./_components/NewArrivals";
import Philosophy from "./_components/Philosophy";
import Testimonials from "./_components/Testimonials";
import JoinCommunity from "@/components/JoinCommunity";

export default function Home() {
  return (
     <div>
      <Hero/>
      <Bestsellers/>
      <CategorySection/>
      <NewArrivals/>
      <Philosophy/>
      <Testimonials/>
      <JoinCommunity/>
    </div>
  )
}
