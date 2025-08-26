import React from 'react'
import {
  Hero,
  LeaguesCarousel,
  FeaturedEvents,
  Team,
  TwitterTestimonials,
  About,
  Cta,
  Note
} from '../../components/features/landing'
import { Footer, Navbar } from '../../components/layout'
import { PageHead } from '../../components/common'


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
      <LeaguesCarousel />
      <FeaturedEvents />
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