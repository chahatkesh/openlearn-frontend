import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../../components/layout';
import { PageHead, HeroSection } from '../../components/common';
import { Award, Users, BookOpen, Calendar, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.openlearn.org.in';

// Fetch cohorts structure from API
const fetchCohortsStructure = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/public/cohorts-structure`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error('Error fetching cohorts structure:', error);
    throw error;
  }
};

// League Card Component with Apple Design System
const LeagueCard = ({ league }) => {
  const modules = league.weeks || [];
  // Disabled leagues logic (match LeaguesPage)
  const disabledLeagues = ['ML League (1.0)', 'Finance League (1.0)'];
  // Try both name and title for robustness
  const isLeagueDisabled = disabledLeagues.includes(league.name) || disabledLeagues.includes(league.title);

  return (
    <div 
      className={`group relative rounded-3xl p-6 lg:p-8 h-full bg-white border border-gray-200/60 backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] opacity-0 animate-fade-in-up ${isLeagueDisabled ? 'opacity-60' : ''}`}
      style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
    >
      {/* Status Badge */}
      <div className={`absolute -top-3 right-6 px-4 py-2 rounded-full text-xs font-semibold border ${isLeagueDisabled ? 'bg-red-100 text-red-700 border-red-200' : 'bg-[#FFDE59] text-black border-black/10'}`}>
        <div className="flex items-center gap-2">
          {isLeagueDisabled ? (
            <>
              <AlertCircle size={14} className="text-red-500" />
              Expired / Not Available
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>
              Available Now
            </>
          )}
        </div>
      </div>

      {/* League Header */}
      <div 
        className="mb-6 opacity-0 animate-fade-in-left"
        style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
      >
        <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 leading-tight mb-2">
          {league.name}
        </h3>
      </div>

      {/* Description */}
      <p 
        className="mb-6 text-gray-600 leading-relaxed text-sm lg:text-base opacity-0 animate-fade-in"
        style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
      >
        {league.description}
      </p>

      {/* Duration Badge */}
      <div 
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/80 text-gray-700 border border-gray-200/50 opacity-0 animate-scale-in"
        style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
      >
        <Calendar size={16} className="text-gray-500" />
        <span>{modules.length} Module{modules.length !== 1 ? 's' : ''} Program</span>
      </div>

      {/* Curriculum Preview */}
      {modules.length > 0 && (
        <div 
          className="space-y-3 mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <h4 className="text-sm font-semibold text-gray-800 mb-3">
            Learning Path:
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {modules
              .sort((a, b) => a.order - b.order)
              .slice(0, 3)
              .map((module, index) => (
                <div 
                  key={module.id}
                  className="flex items-start gap-3 text-sm text-gray-600 group/item transition-transform duration-200 hover:translate-x-1 opacity-0 animate-fade-in-left"
                  style={{ animationDelay: `${0.7 + index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-[#FFDE59]" />
                  <span className="font-medium group-hover/item:text-gray-800 transition-colors duration-200">
                    {module.name}
                  </span>
                </div>
              ))}
            {modules.length > 3 && (
              <div className="text-xs text-gray-500 italic pl-5">
                +{modules.length - 3} more modules included
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      <div 
        className="flex items-center justify-between pt-4 border-t border-gray-100 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center gap-2 text-sm">
          <Users size={16} className="text-gray-500" />
          <span className="text-gray-600 font-medium">Community Access</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Award size={16} className="text-[#FFDE59]" />
          <span className="text-gray-700 font-medium">Certificate</span>
        </div>
      </div>
    </div>
  );
};

const CohortsPage = () => {
  const [cohortsData, setCohortsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCohortsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchCohortsStructure();
        if (response && response.data && response.data.length > 0) {
          setCohortsData(response);
        } else {
          setError('No cohort data available');
        }
      } catch (err) {
        console.error('Failed to fetch cohorts data:', err);
        setError(err.message || 'Failed to load cohort data');
      } finally {
        setLoading(false);
      }
    };

    loadCohortsData();
  }, []);

  // Loading State
  const LoadingState = () => (
    <section className="py-20 lg:py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 border-4 border-[#FFDE59] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Loading Learning Programs</h3>
          <p className="text-gray-600">Discovering the latest learning opportunities for you...</p>
        </div>
      </div>
    </section>
  );

  // Error State
  const ErrorState = () => (
    <section className="py-20 lg:py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50/80 border border-red-200/60 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-3">Unable to Load Programs</h3>
            <p className="text-red-600 mb-6 leading-relaxed">
              We're experiencing technical difficulties. Please try again.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // Empty State
  const EmptyState = () => (
    <section className="py-20 lg:py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-gray-50/80 border border-gray-200/60 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Programs Coming Soon</h3>
            <p className="text-gray-600 leading-relaxed">
              We're crafting exceptional learning experiences. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // Main Content
  const MainContent = () => {
    const cohort = cohortsData?.data?.[0];
    if (!cohort) return <EmptyState />;

    const leagues = cohort.leagues || [];

    return (
      <section 
        className="py-20 lg:py-32 bg-gray-50/50 relative overflow-hidden opacity-0 animate-fade-in"
        style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFDE59] rounded-full opacity-[0.03] blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-900 rounded-full opacity-[0.02] blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header Section */}
          <div 
            className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Cohort 1.5 Learning Programs
            </h2>
            
            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              {cohort.description}
            </p>

            {/* Stats Pills */}
            <div className="flex items-center justify-center flex-wrap gap-4 lg:gap-6">
              <div className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-[#FFDE59]/20 transition-all duration-300 px-5 lg:px-7 py-3 rounded-full border border-gray-200/60 cursor-default">
                <BookOpen size={18} className="text-gray-700 group-hover:text-black transition-colors duration-300" />
                <span className="font-semibold text-gray-800 group-hover:text-black transition-colors duration-300">
                  {leagues.length} Learning Path{leagues.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-[#FFDE59]/20 transition-all duration-300 px-5 lg:px-7 py-3 rounded-full border border-gray-200/60 cursor-default">
                <Award size={18} className="text-gray-700 group-hover:text-black transition-colors duration-300" />
                <span className="font-semibold text-gray-800 group-hover:text-black transition-colors duration-300">
                  Industry Certificates
                </span>
              </div>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="relative max-w-7xl mx-auto">
            <div 
              className={`grid gap-8 lg:gap-12 ${
                leagues.length === 1 
                  ? 'max-w-2xl mx-auto' 
                  : leagues.length === 2 
                  ? 'lg:grid-cols-2 lg:gap-16' 
                  : 'lg:grid-cols-2 xl:grid-cols-3'
              }`}
            >
              {leagues.map((league, index) => (
                <div 
                  key={league.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${0.6 + index * 0.15}s`, animationFillMode: 'forwards' }}
                >
                  <LeagueCard league={league} />
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div 
            className="text-center mt-16 lg:mt-24 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-gray-200/60 max-w-4xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Begin Your Learning Adventure
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Join a community of learners building skills that shape the future.
              </p>
              <button 
                className="group bg-[#FFDE59] hover:bg-[#FFD93D] text-black font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/signin')}
              >
                <span className="flex items-center gap-2">
                  Start Learning Today
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <PageHead 
        title="Learning Programs - OpenLearn"
        description="Explore OpenLearn's comprehensive learning programs. Join structured cohort-based courses with peer-driven education and industry-relevant skills development."
        keywords="learning programs, cohorts, peer learning, structured education, collaborative learning, NIT Jalandhar, skill development"
      />
      
      <Navbar />
      
      <div className="min-h-screen pt-16 bg-white">
        <HeroSection 
          title="Learning Programs"
          subtitle="Structured Skill Development"
          description="Join <em>comprehensive learning programs</em> designed for the modern learner. From emerging technologies to core fundamentals, build expertise through <strong style='color: #000000'>hands-on projects and peer collaboration</strong>."
          backgroundColor="#FFDE59"
          titleColor="#000000"
          subtitleColor="#374151"
          descriptionColor="#374151"
        />

        {loading && <LoadingState />}
        {error && !loading && <ErrorState />}
        {!loading && !error && <MainContent />}
      </div>
      
      <Footer />
    </>
  );
};

export default CohortsPage;