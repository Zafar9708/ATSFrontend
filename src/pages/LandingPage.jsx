import React from 'react'
import Navbar from '../components/Landing/Navbar'
import Hero from '../components/Landing/Hero'
import LogoStrip from '../components/Landing/LogoStrip'
import Features from '../components/Landing/Feature'
import HowItWorks from '../components/Landing/HowItWorks'

import UseCases from '../components/Landing/UseCases'
import CTA from '../components/Landing/Cta'
import Footer from '../components/Landing/Footer'

const LandingPage = () => {
  return (
    <div>
     <Navbar/>
      <Hero/>
      <LogoStrip/>
      <Features/>
      <HowItWorks/>
      <UseCases/>
      <CTA/>
      <Footer/>
    </div>
  )
}

export default LandingPage
