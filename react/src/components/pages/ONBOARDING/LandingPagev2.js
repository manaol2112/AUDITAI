// import { CallToAction } from '@/components/CallToAction'
// import { Faqs } from '@/components/Faqs'
// import { Pricing } from '@/components/Pricing'

// import { SecondaryFeatures } from '@/components/SecondaryFeatures'
// import { Testimonials } from '@/components/Testimonials'


import { Footer } from '../../common/Footer';
import { Header } from '../../common/Header';
import { Hero } from '../../common/Hero';
import { PrimaryFeatures } from '../../common/PrimaryFeatures';


export default function LandingPagev2() {
  return (
    <>
      <Header />

        <Hero />
        <PrimaryFeatures/>

      <Footer />
    </>
  )
}
