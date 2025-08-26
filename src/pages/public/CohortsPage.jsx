import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHead from '../components/common/PageHead';
import HeroSection from '../components/common/HeroSection';

const CohortsPage = () => {
  return (
    <>
      <PageHead 
        title="Cohorts"
        description="Explore OpenLearn's cohort-based learning journey. Join structured learning phases with peer-driven education and real-world project outcomes."
        keywords="cohorts, peer learning, structured education, collaborative learning, NIT Jalandhar"
      />
      
      <Navbar />
      
      <div className="min-h-screen pt-16 bg-white">
        <HeroSection 
          title="Cohorts"
          subtitle="Structured Learning Journey"
          description="Join <em>cohort-based learning experiences</em> where students explore diverse fields together. From Machine Learning to Space Science, build real projects and connect with <strong style='color: #000000'> motivated peers and industry experts</strong>."
        />

        {/* Main Content */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Cohort Programs
              </h2>
              <p className="text-xl text-gray-600">Coming Soon...</p>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default CohortsPage;