import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHead from '../components/common/PageHead';

const AboutPage = () => {
  return (
    <>
      <PageHead 
        title="About Us - OpenLearn"
        description="Learn about OpenLearn's mission to create an innovative learning platform where every learner's journey matters and every achievement is celebrated together."
        keywords="about openlearn, education platform, learning community, team, supporters, mission"
      />
      
      <Navbar />
      
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Page</h1>
            <p className="text-xl text-gray-600">Coming Soon...</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default AboutPage;
