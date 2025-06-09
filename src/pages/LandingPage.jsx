import React from 'react'
import Hero from '../components/landingPage/Hero'
import Cohort from '../components/landingPage/Cohort'
import Team from '../components/landingPage/Team'
import About from '../components/landingPage/About'
import Cta from '../components/landingPage/Cta'
import Note from '../components/landingPage/Note'
import Footer from '../components/landingPage/Footer'


const LandingPage = () => {
  return (
    <>
      <Hero />
      <Cohort />
      <Team />
      <About />
      <Cta />
      <Note />
      <Footer />
    </>
  )
}

export default LandingPage