import FAQSection from '@/components/Home/FAQSection'
import FeatureSection from '@/components/Home/FeatureSection'
import Hero from '@/components/Home/Hero'
import TodaySpecial from '@/components/Home/TodaySpecial'
import TopCategories from '@/components/Home/TopCategories'
import React from 'react'
import NewArrivalsSection from '@/components/Home/NewArrivalsSection'
import FeaturedSection from '@/components/Home/FeaturedSection'

export default function page() {
  return (
    <div className=''>
      <Hero/>
      <TopCategories/>
      <TodaySpecial/>
      <NewArrivalsSection/>
      <FeaturedSection/>
      <FeatureSection/>
      <FAQSection/>
    </div>
  )
}
