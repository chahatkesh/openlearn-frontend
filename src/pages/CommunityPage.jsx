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
      
      <div className="min-h-screen pt-16 bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden hero-pattern" style={{ backgroundColor: '#FFDE59' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight" style={{ color: '#000000' }}>
                  Community
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-medium" style={{ color: '#374151' }}>
                  Growing Together
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <p className="text-lg sm:text-xl leading-relaxed" style={{ color: '#374151' }}>
                  Connect with <em>motivated learners and innovators</em> in our vibrant community. 
                  Collaborate on projects, share knowledge, and grow together in a 
                  <strong style={{ color: '#000000' }}> supportive learning environment</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Community Features
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

export default CommunityPage;