import FAQSection from '@/components/Home/FAQSection'
import FeatureSection from '@/components/Home/FeatureSection'
import FruitsSection from '@/components/Home/FruitsSection'
import Hero from '@/components/Home/Hero'
import TodaySpecial from '@/components/Home/TodaySpecial'
import TopCategories from '@/components/Home/TopCategories'
import VegetableSection from '@/components/Home/VegetableSection'
import React from 'react'

export default function page() {
  return (
    <div className=''>
      <Hero/>
      <TopCategories/>
      <TodaySpecial/>
      <VegetableSection/>
      <FruitsSection/>
      <FeatureSection/>
      <FAQSection/>
    </div>
  )
}
