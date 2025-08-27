import React from 'react';
import { Navbar, Footer } from '../../components/layout';
import { PageHead, HeroSection } from "../../components/common";
import communityData from '../../data/communityData';
import { Users, Crown, Calendar, Building } from 'lucide-react';

// Helper component for member avatar (image or initials)
const MemberAvatar = ({ member, className = "" }) => {
  const initials = member.name.split(' ').map(n => n.charAt(0)).join('');

  if (member.imageUrl) {
    return (
      <div className={`rounded-xl overflow-hidden ${className}`}>
        <img 
          src={member.imageUrl} 
          alt={member.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className={`w-full h-full rounded-xl flex items-center justify-center text-white font-medium ${className}`}
          style={{ backgroundColor: member.color, display: 'none' }}
        >
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-xl flex items-center justify-center text-white font-medium ${className}`}
      style={{ backgroundColor: member.color }}
    >
      {initials}
    </div>
  );
};

// Chief Pathfinder Card Component
const ChiefPathfinderCard = ({ chiefPathfinder }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-300">
    <div className="aspect-square">
      <MemberAvatar 
        member={chiefPathfinder} 
        className="w-full h-full text-4xl"
      />
    </div>
    <div className="p-6">
      <h4 className="font-semibold text-gray-900 text-lg mb-1">
        {chiefPathfinder.name}
      </h4>
      <p className="text-gray-500 text-sm font-medium">
        {chiefPathfinder.role}
      </p>
    </div>
  </div>
);

// Pathfinder Card Component
const PathfinderCard = ({ pathfinder }) => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-300 flex">
    <div className="w-28 h-28 flex-shrink-0">
      <MemberAvatar 
        member={pathfinder} 
        className="w-full h-full text-lg"
      />
    </div>
    <div className="flex-1 p-4 flex flex-col justify-center">
      <h4 className="font-medium text-gray-900 text-sm mb-1 leading-tight">
        {pathfinder.name}
      </h4>
      <p className="text-gray-500 text-xs">
        {pathfinder.role}
      </p>
    </div>
  </div>
);

const CommunityPage = () => {
  return (
    <>
      <PageHead 
        title="Team of Cohort 1.5 - OpenLearn"
        description="Meet the dedicated team behind Cohort 1.5 at OpenLearn NIT Jalandhar. Our passionate pathfinders and mentors guide and support every learner in their journey."
        keywords="cohort 1.5, team, pathfinders, mentors, OpenLearn, NIT Jalandhar, learning community, student support"
      />
      
      <Navbar />
      
      <div className="min-h-screen pt-16 bg-white">
        <HeroSection 
          title="Team of Cohort 1.5"
          subtitle="Growing Together"
          description="Meet the dedicated team behind <em>Cohort 1.5</em> at OpenLearn. Our passionate <strong style='color: #000000'>pathfinders and mentors</strong> are here to guide, support, and grow together with every learner."
        />

        {/* Team Stats */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-1 sm:mb-2">
                  {communityData.stats.activeLeagues}
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-1">
                  Active Leagues
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Learning Communities
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-1 sm:mb-2">
                  {communityData.stats.chiefPathfinders}
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-1">
                  Chief Pathfinders
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Team Leaders
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-1 sm:mb-2">
                  {communityData.stats.pathfinders}
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-1">
                  Pathfinders
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Dedicated Mentors
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-1 sm:mb-2">
                  {communityData.stats.activeStudents}
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-1">
                  Students
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Active Learners
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team of Cohort 1.5 */}
        <section className="py-16 sm:py-20 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 sm:mb-20 lg:mb-24">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 sm:mb-6 text-black tracking-tight">
                Team of Cohort 1.5
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Meet our dedicated team members who guide and support every learner in their journey
              </p>
            </div>

            {/* Team Members */}
            <div className="space-y-20">
              {/* Chief Pathfinders Section */}
              <div>
                <div className="flex items-center justify-center gap-3 mb-10">
                  <Crown className="w-6 h-6 text-black" />
                  <h3 className="text-3xl font-semibold text-black">Chief Pathfinders</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {communityData.chiefPathfinders.map((chiefPathfinder) => (
                    <ChiefPathfinderCard 
                      key={`chief-${chiefPathfinder.id}`}
                      chiefPathfinder={chiefPathfinder}
                    />
                  ))}
                </div>
              </div>

              {/* Pathfinders Section - Grouped by League */}
              <div>
                <div className="flex items-center justify-center gap-3 mb-10">
                  <Users className="w-6 h-6 text-black" />
                  <h3 className="text-3xl font-semibold text-black">Pathfinders</h3>
                </div>
                
                {/* Group pathfinders by league */}
                {Object.entries(
                  communityData.pathfinders.reduce((groups, pathfinder) => {
                    const league = pathfinder.league;
                    if (!groups[league]) groups[league] = [];
                    groups[league].push(pathfinder);
                    return groups;
                  }, {})
                ).map(([league, pathfinders]) => (
                  <div key={league} className="mb-12">
                    <h4 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                      {league} League
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pathfinders.map((pathfinder) => (
                        <PathfinderCard 
                          key={`pathfinder-${pathfinder.id}`}
                          pathfinder={pathfinder}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default CommunityPage;