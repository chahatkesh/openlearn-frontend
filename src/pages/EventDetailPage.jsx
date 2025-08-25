import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Camera, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHead from '../components/common/PageHead';
import { MotionDiv, MotionSection } from '../components/common/MotionWrapper';
import eventsData from '../data/eventsData';
import { useFilteredImages } from '../utils/eventImageService';

// Image Modal Component
const ImageModal = ({ image, isOpen, onClose, onNext, onPrev, currentIndex, totalImages }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !image) return null;

  return (
    <MotionDiv
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 z-10"
      >
        <X size={20} />
      </button>

      {/* Navigation buttons */}
      {totalImages > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 z-10"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Image counter */}
      {totalImages > 1 && (
        <div className="absolute top-6 left-6 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentIndex + 1} / {totalImages}
        </div>
      )}

      <MotionDiv
        className="max-w-6xl max-h-[90vh] w-full mx-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.url}
          alt={image.alt}
          className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/800x600/f3f4f6/6b7280?text=${encodeURIComponent(image.alt || 'Event Image')}`;
          }}
        />
      </MotionDiv>
    </MotionDiv>
  );
};

// Image Gallery Component
const ImageGallery = ({ images, onImageClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => (
        <MotionDiv
          key={image.id}
          className="group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onImageClick(image, index)}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-[#FFDE59]/30">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(image.alt || 'Event Photo')}`;
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-400" />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
              <div className="w-12 h-12 rounded-full bg-[#FFDE59]/95 backdrop-blur-sm flex items-center justify-center shadow-xl scale-95 group-hover:scale-100 transition-transform duration-400">
                <Camera size={18} className="text-black" />
              </div>
            </div>
          </div>
        </MotionDiv>
      ))}
    </div>
  );
};

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debug logging
  useEffect(() => {
    // Silent operation - logs removed for production
  }, [eventId]);

  // Validate eventId parameter
  useEffect(() => {
    if (!eventId) {
      navigate('/events', { replace: true });
      return;
    }
  }, [eventId, navigate]);

  // Find the event by ID with error handling
  const event = React.useMemo(() => {
    try {
      if (!eventId || !eventsData?.events) {
        return null;
      }
      const foundEvent = eventsData.events.find(e => e.id === eventId);
      return foundEvent;
    } catch (error) {
      console.error('Error finding event:', error);
      return null;
    }
  }, [eventId]);

  // Filter images to only show existing ones
  const { images: filteredImages, loading: imagesLoading } = useFilteredImages(event?.images || []);

  // Redirect to events page if event not found
  useEffect(() => {
    if (!event && eventId) {
      navigate('/events', { replace: true });
    }
  }, [event, eventId, navigate]);

  // Show 404 if event not found
  if (!event) {
    return (
      <>
        <PageHead 
          title="Event Not Found"
          description="The requested event could not be found"
        />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or may have been moved.</p>
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Back to Events
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'workshop':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'hackathon':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'study group':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'guest lecture':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'showcase':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'accelerate program':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'cohort 1.0':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'cohort 1.5':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleNext = () => {
    if (filteredImages.length > 0) {
      const nextIndex = (currentIndex + 1) % filteredImages.length;
      setCurrentIndex(nextIndex);
      setSelectedImage(filteredImages[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (filteredImages.length > 0) {
      const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedImage(filteredImages[prevIndex]);
    }
  };

  return (
    <>
      <PageHead 
        title={`${event.title} - Events`}
        description={event.description}
        keywords={`${event.category}, ${event.title}, events, NIT Jalandhar, OpenLearn`}
      />
      
      <Navbar />

      {/* Hero Section */}
      <MotionSection 
        className="relative pt-32 pb-16"
        style={{ backgroundColor: '#FFDE59' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          {/* Back Button */}
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors duration-200 group bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Events</span>
            </button>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Category Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight leading-none">
              {event.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row gap-6 text-black/80 mb-8">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-black" />
                <span className="text-lg font-medium">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-black" />
                <span className="text-lg font-medium">{event.location}</span>
              </div>
              {filteredImages.length > 0 && (
                <div className="flex items-center gap-2">
                  <Camera size={20} className="text-black" />
                  <span className="text-lg font-medium">{filteredImages.length} photos</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xl text-black/80 max-w-4xl leading-relaxed font-medium">
              {event.description}
            </p>
          </MotionDiv>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-black/5 rounded-full blur-3xl"></div>
      </MotionSection>

      {/* Image Gallery Section */}
      {filteredImages.length > 0 && !imagesLoading && (
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Event Gallery
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore moments captured during this event
              </p>
            </MotionDiv>

            <ImageGallery images={filteredImages} onImageClick={handleImageClick} />
          </div>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal 
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNext={handleNext}
        onPrev={handlePrev}
        currentIndex={currentIndex}
        totalImages={filteredImages.length}
      />

      <Footer />
    </>
  );
};

export default EventDetailPage;
