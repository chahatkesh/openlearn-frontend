import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHead from '../components/common/PageHead';

const CohortsPage = () => {
  return (
    <>
      <PageHead 
        title="Cohorts"
        description="Explore OpenLearn's cohort-based learning journey. Join structured learning phases with peer-driven education and real-world project outcomes."
        keywords="cohorts, peer learning, structured education, collaborative learning, NIT Jalandhar"
      />
      
      <Navbar />
      
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cohorts</h1>
            <p className="text-xl text-gray-600">Coming Soon...</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CohortsPage;