import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MotionDiv, MotionSection } from '../common/MotionWrapper';
import SectionHeader from '../common/SectionHeader';
import leaguesData from '../../data/leaguesData';

const LeagueCard = ({ league, isActive }) => {
  const navigate = useNavigate();

  const handleLeagueClick = () => {
    navigate('/dashboard');
  };

  return (
    <MotionDiv
      className={`relative overflow-hidden rounded-2xl cursor-pointer border transition-all duration-700 ease-out bg-white ${
        isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
      }`}
      style={{ borderColor: `${league.color}` }}
      onClick={handleLeagueClick}
      whileHover={{ 
        scale: isActive ? 1.02 : 0.97,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Horizontal Layout */}
      <div className="flex min-h-72">
        {/* Left Side - Banner/Image */}
        <div className="relative w-2/5 overflow-hidden">
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
          <div className="absolute top-4 left-4">
            <div 
              className="px-3 py-1.5 rounded-full text-white text-sm font-semibold backdrop-blur-md"
              style={{ backgroundColor: `${league.color}` }}
            >
              {league.name}
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          {/* Header */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
              {league.title}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed font-light">
              {league.description}
            </p>
          </div>

          {/* Topics */}
          <div className="space-y-4">
            {/* CTA */}
            <div className="flex items-center justify-between">
              <div 
                className="inline-flex items-center gap-2 text-base font-semibold transition-all duration-300 hover:gap-3"
                style={{ color: league.color }}
              >
                <span>Explore League</span>
                <ArrowRight size={16} className="transition-transform duration-300" />
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

  // Auto-advance carousel
  useEffect(() => {
    if (leagues.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % leagues.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [leagues.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % leagues.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + leagues.length) % leagues.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <MotionSection className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFDE59] mb-4"></div>
            <p className="text-gray-600">Loading leagues...</p>
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
      className="py-20 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <SectionHeader 
          title="Explore Learning Leagues"
          description="Join specialized learning communities designed to accelerate your growth in various domains"
        />

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel */}
          <div className="relative py-8 overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {leagues.map((league, index) => (
                <div key={league.id} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-4xl mx-auto">
                    <LeagueCard 
                      league={league} 
                      isActive={index === currentIndex}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-105"
            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-105"
            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {leagues.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8' 
                  : 'hover:scale-110'
              }`}
              style={{ 
                backgroundColor: index === currentIndex ? '#FFDE59' : '#E5E7EB'
              }}
            />
          ))}
        </div>

        {/* CTA Button */}
        <MotionDiv
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button
            onClick={() => navigate('/cohorts')}
            className="inline-flex items-center gap-2 text-black px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-2 border-black hover:border-[#FFDE59] group"
            style={{ backgroundColor: '#FFDE59' }}
          >
            View All Leagues
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </MotionDiv>
      </div>
    </MotionSection>
  );
};

export default LeaguesCarousel;
