import React from 'react'
import Hero from '../components/landingPage/Hero'
import Cohort from '../components/landingPage/Cohort'
import Team from '../components/landingPage/Team'
import TwitterTestimonials from '../components/landingPage/TwitterTestimonials'
import About from '../components/landingPage/About'
import Cta from '../components/landingPage/Cta'
import Note from '../components/landingPage/Note'
import Footer from '../components/common/Footer'
import PageHead from '../components/common/PageHead'
import Navbar from '../components/common/Navbar';


const LandingPage = () => {
  return (
    <>
      <PageHead 
        title=""
        description="Join OpenLearn at NIT Jalandhar - Experience gamified cohort-based learning with competitive leagues, achievement badges, and collaborative programming education. Transform your learning journey today!"
        keywords="gamified learning, NIT Jalandhar, cohort learning, programming education, competitive learning, achievement badges, educational gaming"
      />
      <Navbar />
      <Hero />
      <Cohort />
      <Team />
      <TwitterTestimonials />
      <About />
      <Cta />
      <Note />
      <Footer />
    </>
  )
}

export default LandingPage