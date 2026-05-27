import React from 'react'
import { Link } from 'react-router-dom'
import {
  Hero,
  LeaguesCarousel,
  FeaturedEvents,
  // Team,
  TwitterTestimonials,
  About,
  Cta,
  Note
} from '../../components/features/landing'
import { Footer, Navbar } from '../../components/layout'
import { PageHead } from '../../components/common'

const EndOfServiceBanner = () => (
  <div className="bg-red-700 text-white">
    <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <p className="font-medium">
        OpenLearn has reached end of service. Active platform features have been discontinued.
      </p>
      <Link
        to="/end-of-service"
        className="font-semibold text-white underline underline-offset-4 hover:text-red-100"
      >
        Read the notice
      </Link>
    </div>
  </div>
)

const LandingPage = () => {
  return (
    <>
      <PageHead 
        title=""
        description="OpenLearn has reached end of service. View the public archive of OpenLearn's community, events, cohorts, and learning initiatives at NIT Jalandhar."
        keywords="gamified learning, NIT Jalandhar, cohort learning, programming education, competitive learning, achievement badges, educational gaming"
      />
      <Navbar />
      <main className="pt-16 sm:pt-[72px] lg:pt-20">
        <EndOfServiceBanner />
        <Hero />
      </main>
      <LeaguesCarousel />
      <FeaturedEvents />
      {/* <Team /> */}
      <TwitterTestimonials />
      <About />
      <Cta />
      <Note />
      <Footer />
    </>
  )
}

export default LandingPage
