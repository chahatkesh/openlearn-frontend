import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHead from '../components/common/PageHead';

const CommunityPage = () => {
  return (
    <>
      <PageHead 
        title="Community"
        description="Join the OpenLearn community at NIT Jalandhar. Connect with motivated learners, collaborate on projects, and grow together in a supportive environment."
        keywords="community, student collaboration, peer learning, NIT Jalandhar, open learning, study groups"
      />
      
      <Navbar />
      
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Community</h1>
            <p className="text-xl text-gray-600">Coming Soon...</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CommunityPage;