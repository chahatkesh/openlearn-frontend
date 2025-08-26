import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHead from '../components/common/PageHead';
import HeroSection from '../components/common/HeroSection';
import communityData from '../data/communityData';
import { Linkedin, Users, Crown, Calendar, Building } from 'lucide-react';

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
            <div className="space-y-12 sm:space-y-16 lg:space-y-20">
              {/* Chief Pathfinders Section */}
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-6 sm:mb-8 lg:mb-10">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-black">Chief Pathfinders</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {communityData.chiefPathfinders.map((chiefPathfinder) => (
                    <div 
                      key={`chief-${chiefPathfinder.id}`}
                      className="group bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div 
                          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl"
                          style={{ backgroundColor: chiefPathfinder.color }}
                        >
                          {chiefPathfinder.name.split(' ').map(n => n.charAt(0)).join('')}
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg leading-tight">
                            {chiefPathfinder.name}
                          </h4>
                          <p className="text-gray-500 text-xs sm:text-sm font-medium">
                            {chiefPathfinder.role}
                          </p>
                        </div>
                        
                        <a
                          href={chiefPathfinder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 hover:bg-blue-50 rounded-full transition-all duration-200 group-hover:scale-110"
                        >
                          <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-blue-600" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pathfinders Section */}
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-6 sm:mb-8 lg:mb-10">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-black">Pathfinders</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {communityData.pathfinders.map((pathfinder) => (
                    <div 
                      key={`pathfinder-${pathfinder.id}`}
                      className="group bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div 
                          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl"
                          style={{ backgroundColor: pathfinder.color }}
                        >
                          {pathfinder.name.split(' ').map(n => n.charAt(0)).join('')}
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg leading-tight">
                            {pathfinder.name}
                          </h4>
                          <p className="text-gray-500 text-xs sm:text-sm font-medium">
                            {pathfinder.role}
                          </p>
                        </div>
                        
                        <a
                          href={pathfinder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 hover:bg-blue-50 rounded-full transition-all duration-200 group-hover:scale-110"
                        >
                          <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-blue-600" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
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