import React from 'react'
import ContactSection from './_components/ContactSection'
import OtherWaysSection from './_components/OtherWayssection'
import FAQSection from './_components/FAQSection'
import JoinCommunity from '@/components/JoinCommunity'


export default function ContactPage() {
  return (
    <div>
        <h2 className="heading-font site-container pt-10 text-[36px] md:text-[48px] font-medium">Contact Us</h2>
        <ContactSection/>
        <OtherWaysSection/>
        <FAQSection/>
        <JoinCommunity/>
    </div>
  )
}
