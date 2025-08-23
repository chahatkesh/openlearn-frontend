import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHead from '../components/common/PageHead';
import { MotionDiv, MotionSection } from '../components/common/MotionWrapper';
import eventsData from '../data/eventsData';

// Modern Hero section
const EventsHero = () => {
  return (
    <MotionSection 
      className="relative pt-32 pb-16"
      style={{ backgroundColor: '#FFDE59' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-6 tracking-tight leading-none">
            Events
          </h1>
          
          <p className="text-xl text-gray-800 max-w-2xl mx-auto font-medium leading-relaxed">
            Explore our learning journey through workshops, hackathons, and community gatherings
          </p>
        </MotionDiv>
      </div>
      
      {/* Decorative elements to match website style */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-black/5 rounded-full blur-3xl"></div>
    </MotionSection>
  );
};

// Modern Event Card Component
const EventCard = ({ event }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const truncateDescription = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const handleEventClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <MotionDiv
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleEventClick}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out border border-gray-100 hover:border-[#FFDE59]/30">
        {/* Event Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodeURIComponent(event.title)}`;
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-400" />
          
          {/* Hover overlay with arrow */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
            <div className="w-12 h-12 rounded-full bg-[#FFDE59]/95 backdrop-blur-sm flex items-center justify-center shadow-xl scale-95 group-hover:scale-100 transition-transform duration-400">
              <ArrowRight size={18} className="text-black" />
            </div>
          </div>
        </div>

        {/* Event Content */}
        <div className="p-6">
          {/* Category Badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-black transition-colors duration-300">
            {event.title}
          </h3>

          {/* Description with truncation */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {truncateDescription(event.description)}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span className="truncate max-w-[120px]">{event.location}</span>
            </div>
          </div>

          {/* Images Count */}
          {event.images.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Camera size={12} className="text-[#FFDE59]" />
                <span>{event.images.length} {event.images.length === 1 ? 'photo' : 'photos'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};





const EventsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);

  // Load events data with error handling
  useEffect(() => {
    const loadEvents = () => {
      try {
        // Defensive check for eventsData structure
        if (eventsData && typeof eventsData === 'object' && Array.isArray(eventsData.events)) {
          setEvents(eventsData.events);
        } else {
          console.warn('Events data structure is invalid:', eventsData);
          setEvents([]);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure proper data loading
    const timer = setTimeout(loadEvents, 50);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <>
        <PageHead 
          title="Events - Loading..."
          description="Loading events from OpenLearn's journey"
          keywords="events, workshops, hackathons, guest lectures, community gatherings, NIT Jalandhar, learning events"
        />
        
        <Navbar />
        
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFDE59' }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-black text-lg font-medium">Loading events...</p>
          </div>
        </div>
        
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageHead 
        title="Events"
        description="Explore OpenLearn's journey through our events. Discover workshops, hackathons, guest lectures, and community gatherings that showcase our collaborative learning environment."
        keywords="events, workshops, hackathons, guest lectures, community gatherings, NIT Jalandhar, learning events"
      />
      
      <Navbar />
      
      {/* Hero Section */}
      <EventsHero />
      
      {/* Events Grid */}
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          
          {/* Modern Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                />
              ))
            ) : (
              <MotionDiv 
                className="col-span-full text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Calendar size={48} className="mx-auto text-[#FFDE59] mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500">Check back soon for updates</p>
              </MotionDiv>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default EventsPage;