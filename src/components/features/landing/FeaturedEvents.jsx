import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MotionDiv, MotionSection } from '../../common/MotionWrapper';
import eventsData from '../../../data/eventsData';
import SectionHeader from '../../common/SectionHeader'; 

const FeaturedEvent = ({ event }) => {
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleEventClick}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ease-out border border-gray-100 hover:border-[#FFDE59]/30">
        {/* Event Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/640x400/f3f4f6/6b7280?text=${encodeURIComponent(event.title)}`;
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-400" />
          
          {/* Hover overlay with arrow */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
            <div className="w-14 h-14 rounded-full bg-[#FFDE59]/95 backdrop-blur-sm flex items-center justify-center shadow-sm scale-95 group-hover:scale-100 transition-transform duration-400">
              <ArrowRight size={20} className="text-black" />
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

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load featured events with error handling
  useEffect(() => {
    const loadFeaturedEvents = () => {
      try {
        // Defensive check for eventsData structure
        if (eventsData && typeof eventsData === 'object' && Array.isArray(eventsData.events)) {
          const filtered = eventsData.events.filter(event => event.featured).slice(0, 3);
          setFeaturedEvents(filtered);
        } else {
          console.warn('Events data structure is invalid for featured events:', eventsData);
          setFeaturedEvents([]);
        }
      } catch (error) {
        console.error('Error loading featured events:', error);
        setFeaturedEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure proper data loading
    const timer = setTimeout(loadFeaturedEvents, 30);
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything while loading or if no featured events
  if (isLoading || featuredEvents.length === 0) {
    return null;
  }

  return (
    <MotionSection 
      className="py-20 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <SectionHeader 
          title="Featured Events"
          description="Discover our most impactful learning experiences and community gatherings"
        />

        {/* Featured Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredEvents.map((event, index) => (
            <MotionDiv
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <FeaturedEvent event={event} />
            </MotionDiv>
          ))}
        </div>

        {/* View All Events CTA */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 text-black px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md border-2 border-black hover:border-[#FFDE59] group"
            style={{ backgroundColor: '#FFDE59' }}
          >
            View All Events
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </MotionDiv>
      </div>
    </MotionSection>
  );
};

export default FeaturedEvents;
