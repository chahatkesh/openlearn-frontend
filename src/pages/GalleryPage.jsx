import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHead from '../components/common/PageHead';

const GalleryPage = () => {
  return (
    <>
      <PageHead 
        title="Gallery"
        description="Explore moments from OpenLearn's journey. See our community events, student projects, workshops, and study group sessions that showcase our collaborative learning environment."
        keywords="gallery, community events, student projects, workshops, NIT Jalandhar, learning moments"
      />
      
      <Navbar />
      
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
            <p className="text-xl text-gray-600">Coming Soon...</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default GalleryPage;