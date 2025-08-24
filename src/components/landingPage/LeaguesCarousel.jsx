import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MotionDiv, MotionSection } from '../common/MotionWrapper';
import SectionHeader from '../common/SectionHeader';
import leaguesData from '../../data/leaguesData';
import './LeaguesCarousel.module.css';

const LeagueCard = ({ league, isActive, isMobile }) => {
  const navigate = useNavigate();

  const handleLeagueClick = () => {
    navigate('/dashboard');
  };

  return (
    <MotionDiv
      className={`relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer border transition-all duration-700 ease-out bg-white ${
        isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
      }`}
      style={{ borderColor: `${league.color}` }}
      onClick={handleLeagueClick}
      whileHover={{ 
        scale: isActive ? (isMobile ? 1.01 : 1.02) : (isMobile ? 0.98 : 0.97),
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Responsive Layout */}
      <div className={`flex ${isMobile ? 'flex-col min-h-64' : 'min-h-72'}`}>
        {/* Image Section */}
        <div className={`relative overflow-hidden ${isMobile ? 'w-full h-48' : 'w-2/5'}`}>
          <img
            src={league.cover}
            alt={league.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop&q=80`;
            }}
          />
          
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: `linear-gradient(135deg, ${league.color}40 0%, ${league.color}20 100%)`
            }}
          />
          
          {/* League Badge */}
          <div className={`absolute ${isMobile ? 'top-3 left-3' : 'top-4 left-4'}`}>
            <div 
              className={`px-3 py-1.5 rounded-full text-white ${isMobile ? 'text-xs' : 'text-sm'} font-semibold backdrop-blur-md`}
              style={{ backgroundColor: `${league.color}` }}
            >
              {league.name}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} flex flex-col justify-between`}>
          {/* Header */}
          <div className={`space-y-${isMobile ? '2' : '3'}`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900 leading-tight tracking-tight`}>
              {league.title}
            </h3>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed font-light ${isMobile ? 'line-clamp-3' : ''}`}>
              {league.description}
            </p>
            
            {/* League Details */}
            <div className={`league-details ${isMobile ? 'space-y-1' : 'space-y-2'} ${isMobile ? 'pt-2' : 'pt-3'}`}>
              <div className={`league-info-item ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <span className="starting-date label">Starts:</span>
                <span className="value" style={{ color: league.color }}>
                  {" "}{league.startingDate}
                </span>
              </div>
              <div className={`league-info-item ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <span className="facilitated-by label">By:</span>
                <span className="value text-gray-700">
                  {" "}{league.facilitatedBy}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div 
                className={`inline-flex items-center gap-2 ${isMobile ? 'text-sm pt-6' : 'text-base'} font-semibold transition-all duration-300 hover:gap-3`}
                style={{ color: league.color }}
              >
                <span>Join Now</span>
                <ArrowRight size={isMobile ? 14 : 16} className="transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

const LeaguesCarousel = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load leagues data
  useEffect(() => {
    const loadLeagues = () => {
      try {
        if (leaguesData && typeof leaguesData === 'object' && Array.isArray(leaguesData.leagues)) {
          setLeagues(leaguesData.leagues);
        } else {
          console.warn('Leagues data structure is invalid:', leaguesData);
          setLeagues([]);
        }
      } catch (error) {
        console.error('Error loading leagues:', error);
        setLeagues([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(loadLeagues, 30);
    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % leagues.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + leagues.length) % leagues.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    if (leagues.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % leagues.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [leagues.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + leagues.length) % leagues.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % leagues.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [leagues.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        nextSlide(); // Swipe left - next slide
      } else {
        prevSlide(); // Swipe right - previous slide
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (isLoading) {
    return (
      <MotionSection className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-[#FFDE59] mb-4 loading-spinner"></div>
            <p className="text-gray-600 text-sm md:text-base">Loading leagues...</p>
          </div>
        </div>
      </MotionSection>
    );
  }

  if (leagues.length === 0) {
    return null;
  }

  return (
    <MotionSection 
      className="py-12 md:py-20 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <SectionHeader 
          title="Explore Learning Leagues"
          description="Join specialized learning communities designed to accelerate your growth in various domains"
        />

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel */}
          <div 
            className="relative py-4 md:py-8 overflow-hidden rounded-xl md:rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {leagues.map((league, index) => (
                <div key={league.id} className="w-full flex-shrink-0 px-2 md:px-4">
                  <div className="max-w-4xl mx-auto">
                    <LeagueCard 
                      league={league} 
                      isActive={index === currentIndex}
                      isMobile={isMobile}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Hidden on mobile, shown on tablet+ */}
          {!isMobile && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous league"
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-105 carousel-button"
                style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              >
                <ChevronLeft size={isMobile ? 18 : 20} className="text-gray-700" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next league"
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-105 carousel-button"
                style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              >
                <ChevronRight size={isMobile ? 18 : 20} className="text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center mt-6 md:mt-8 gap-1.5 md:gap-2" role="tablist" aria-label="League navigation">
          {leagues.map((league, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to ${league.name} league`}
              role="tab"
              aria-selected={index === currentIndex}
              className={`${isMobile ? 'w-1 h-1' : 'w-3 h-3'} rounded-full transition-all duration-300 dot-indicator ${
                index === currentIndex 
                  ? (isMobile ? 'w-3' : 'w-8') 
                  : 'hover:scale-110'
              }`}
              style={{ 
                backgroundColor: index === currentIndex ? '#FFDE59' : '#E5E7EB'
              }}
            />
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        {isMobile && leagues.length > 1 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 swipe-hint">
              ← Swipe to explore more leagues →
            </p>
          </div>
        )}

        {/* CTA Button */}
        <MotionDiv
          className="text-center mt-8 md:mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button
            onClick={() => navigate('/cohorts')}
            className={`inline-flex items-center gap-2 text-black ${
              isMobile ? 'px-6 py-3 text-sm' : 'px-8 py-4'
            } rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-2 border-black hover:border-[#FFDE59] group`}
            style={{ backgroundColor: '#FFDE59' }}
          >
            View All Leagues
            <ArrowRight size={isMobile ? 16 : 18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </MotionDiv>
      </div>
    </MotionSection>
  );
};

export default LeaguesCarousel;
