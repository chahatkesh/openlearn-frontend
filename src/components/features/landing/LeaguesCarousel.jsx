import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MotionDiv, MotionSection } from '../../common/MotionWrapper';
import SectionHeader from '../../common/SectionHeader';
import leaguesData from '../../../data/leaguesData';

const LeagueCard = ({ league, isActive, isMobile }) => {
  const navigate = useNavigate();

  const handleLeagueClick = () => {
    navigate('/cohorts');
  };

  const cardStyles = {
    transform: isActive ? 'scale(1)' : 'scale(0.95)',
    opacity: isActive ? 1 : 0.7,
    transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
    cursor: 'pointer',
  };

  const imageStyles = {
    transition: 'transform 1s cubic-bezier(0.23, 1, 0.32, 1)',
  };

  const overlayStyles = {
    background: `linear-gradient(135deg, ${league.color}60 0%, ${league.color}30 50%, transparent 100%)`,
    opacity: 0.4,
    transition: 'opacity 0.7s ease',
  };

  const badgeStyles = {
    backgroundColor: league.color,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  };

  const playButtonStyles = {
    opacity: 0,
    transform: 'scale(0.75)',
    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
  };

  return (
    <MotionDiv
      className="league-card group py-8 relative overflow-hidden cursor-pointer"
      style={cardStyles}
      onClick={handleLeagueClick}
      whileHover={{ 
        scale: isActive ? (isMobile ? 1.02 : 1.05) : (isMobile ? 0.98 : 1.02),
        transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main Card Container with Apple-style rounded corners */}
      <div 
        className={`
          relative bg-white rounded-3xl overflow-hidden
          ${isMobile ? 'h-[420px]' : 'h-[500px] lg:h-[520px]'}
          transition-all duration-700
          border border-gray-100/50
        `}
        style={{
          ...cardStyles,
          borderRadius: '24px',
        }}
      >
        
        {/* Hero Image Section */}
        <div className={`relative overflow-hidden ${isMobile ? 'h-48' : 'h-56 lg:h-64'}`}>
          <img
            src={league.cover}
            alt={league.title}
            className="w-full h-full object-cover"
            style={imageStyles}
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop&q=80`;
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          />
          
          {/* Sophisticated Gradient Overlay */}
          <div 
            className="absolute inset-0 group-hover:opacity-30"
            style={overlayStyles}
          />
          
          {/* Apple-style floating badge */}
          <div className="absolute top-4 left-4">
            <div 
              className={`
                px-3 py-1.5 rounded-full text-white font-semibold
                ${isMobile ? 'text-xs' : 'text-sm'}
                border border-white/20
              `}
              style={badgeStyles}
            >
              {league.name}
            </div>
          </div>

          {/* Play Button Overlay for Apple-style interaction */}
          <div 
            className="absolute inset-0 flex items-center justify-center group-hover:opacity-100"
            style={playButtonStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0';
              e.currentTarget.style.transform = 'scale(0.75)';
            }}
          >
            <div 
              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            >
              <ArrowRight className="w-6 h-6 text-gray-800" />
            </div>
          </div>
        </div>

        {/* Content Section with Apple-style spacing */}
        <div className={`relative ${isMobile ? 'p-5' : 'p-6 lg:p-8'} flex flex-col justify-between flex-1`}>
          
          {/* Header Content */}
          <div className="space-y-4">
            <h3 
              className={`
                font-bold text-gray-900 leading-tight tracking-tight
                ${isMobile ? 'text-lg' : 'text-xl lg:text-2xl'}
                group-hover:text-gray-800 transition-colors duration-300
              `}
            >
              {league.title}
            </h3>
            
            <p 
              className={`
                text-gray-600 leading-relaxed font-light
                ${isMobile ? 'text-sm' : 'text-base lg:text-lg'}
                group-hover:text-gray-700 transition-colors duration-300
              `}
              style={{
                display: '-webkit-box',
                WebkitLineClamp: isMobile ? 3 : 2,
                lineClamp: isMobile ? 3 : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {league.description}
            </p>
          </div>

          {/* Apple-style Info Cards */}
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Starts</p>
                  <p 
                    className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`} 
                    style={{ color: league.color }}
                  >
                    {league.startingDate}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">By</p>
                  <p className={`font-semibold text-gray-700 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {league.facilitatedBy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

const HighlightCard = () => {
  const navigate = useNavigate();

  const handleHighlightClick = () => {
    navigate('/accelerate');
  };

  return (
    <MotionSection 
      className="py-8 md:py-16 lg:py-20 bg-white"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <MotionDiv 
          className="group cursor-pointer relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl sm:bg-gradient-to-br sm:from-gray-900 sm:via-gray-800 sm:to-black"
          onClick={handleHighlightClick}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Background Image with Overlay - Maintaining original aspect ratio */}
          <div className="relative overflow-hidden">
            <img
              src="/leagues/highlight/accelerate.png"
              alt="Accelerate Program Highlight"
              className="w-full h-auto transition-all duration-1000 group-hover:scale-105 opacity-100 sm:opacity-60"
              style={{
                display: 'block',
                maxWidth: '100%',
                height: 'auto',
              }}
              onError={(e) => {
                e.target.src = `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop&q=80`;
              }}
            />
            
            {/* Sophisticated Gradient Overlay - Hidden on mobile */}
            <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content Overlay - Hidden on mobile */}
          <div className="hidden sm:flex absolute inset-0 items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                Ready to <span style={{ color: '#ffde59' }}>Accelerate</span>?
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl font-light mb-8 opacity-90">
                Transform your learning journey with our flagship program
              </p>
              
              {/* Apple-style CTA Button */}
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all duration-500 group-hover:scale-105">
                <span className="text-lg font-semibold">Explore Accelerate</span>
                <div className="w-8 h-8 rounded-full bg-[#ffde59] flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </MotionSection>
  );
};

const LeaguesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Add keyframes for spinner animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); opacity: 1; }
        50% { opacity: 0.8; }
        100% { transform: rotate(360deg); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
              <div 
                className="inline-block animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-[#FFDE59] mb-4"
                style={{
                  borderTopColor: '#ffde59',
                  animation: 'spin 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              ></div>
              <p className="text-gray-600 text-sm md:text-base">Loading leagues...</p>
            </div>
          </div>
        </MotionSection>
      );
    }  if (leagues.length === 0) {
    return null;
  }

  return (
    <>
      <HighlightCard />
      <MotionSection 
        className="py-12 md:py-20 lg:py-24 bg-gray-50"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Section Header */}
          <SectionHeader 
            title="Explore Learning Leagues"
            description="Join specialized learning communities designed to accelerate your growth in various domains"
          />
          {/* Carousel Container */}
          <div className="relative">
            
            {/* Main Carousel */}
            <div 
              className="relative overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {leagues.map((league, index) => (
                  <div key={league.id} className="w-full flex-shrink-0 px-3 md:px-6 lg:px-8">
                    <div className="max-w-2xl lg:max-w-3xl mx-auto">
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

            {/* Apple-style Navigation Arrows */}
            {!isMobile && leagues.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  aria-label="Previous league"
                  className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/80 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200/50"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>

                <button
                  onClick={nextSlide}
                  aria-label="Next league"
                  className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/80 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200/50"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Apple-style Dot Indicators */}
          <div className="flex justify-center mt-8 md:mt-12 gap-2" role="tablist" aria-label="League navigation">
            {leagues.map((league, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to ${league.name} league`}
                role="tab"
                aria-selected={index === currentIndex}
                className={`
                  rounded-full transition-all duration-500 hover:scale-110
                  ${index === currentIndex 
                    ? (isMobile ? 'w-8 h-2 bg-[#ffde59]' : 'w-10 h-3 bg-[#ffde59]') 
                    : (isMobile ? 'w-2 h-2 bg-gray-300 hover:bg-gray-400' : 'w-3 h-3 bg-gray-300 hover:bg-gray-400')
                  }
                `}
              />
            ))}
          </div>

          {/* Mobile Swipe Hint with Apple-style animation */}
          {isMobile && leagues.length > 1 && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500 font-medium animate-pulse">
                ← Swipe to explore more leagues →
              </p>
            </div>
          )}
        </div>
      </MotionSection>
    </>
  );
};

export default LeaguesCarousel;
