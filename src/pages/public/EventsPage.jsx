import React from 'react';
import { Calendar, MapPin, Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../../components/layout';
import { PageHead, HeroSection, MotionDiv, MotionSection } from '../../components/common';
import eventsData from '../../data/eventsData';

// Event Card component

// Event Card Component
const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
        </div>
      </div>
    </MotionDiv>
  );
};



const EventsPage = () => {
  // Initialize events directly from imported data
  const events = React.useMemo(() => {
    try {
      if (eventsData && typeof eventsData === 'object' && Array.isArray(eventsData.events)) {
        return eventsData.events;
      } else {
        console.warn('Events data structure is invalid:', eventsData);
        return [];
      }
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    }
  }, []);

  return (
    <>
      <PageHead 
        title="Events"
        description="Explore OpenLearn's journey through our events. Discover workshops, hackathons, guest lectures, and community gatherings that showcase our collaborative learning environment."
        keywords="events, workshops, hackathons, guest lectures, community gatherings, NIT Jalandhar, learning events"
      />
      
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-16">
        <HeroSection 
          title="Events"
          subtitle="Our Learning Journey"
          description="Explore our community's growth through <em>workshops, hackathons, and gatherings</em>. Each event represents a milestone in our journey of <strong style='color: #000000'> collaborative learning and innovation</strong>."
        />
      </div>
      
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