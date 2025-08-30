import React from 'react';
import { Navbar, Footer } from '../../components/layout';
import { PageHead, HeroSection } from "../../components/common";
import { ArrowRight, Target, Users, Zap, Rocket, CheckCircle, Calendar, Globe } from 'lucide-react';

const AcceleratePage = () => {
  const phases = [
    {
      phase: 1,
      title: "Product & Team Identification",
      subtitle: "Identification Phase",
      period: "August",
      description: "Foundation setting for innovation",
      activities: [
        "Finalize domains",
        "Domain-based team formation",
        "Splitting efficient teams on products",
        "Identifying products to be built"
      ],
      icon: <Target className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      phase: 2,
      title: "Pathfinder Meet",
      subtitle: "Research Phase",
      period: "September",
      description: "Structured guidance and progress tracking",
      activities: [
        "Predefined meetings with proper minutes recorded",
        "Establish checkpoints",
        "Supervisors assigned",
        "Pre-defined meet days to solve hurdles, track progress",
        "Agreed timeline to work out progress on products"
      ],
      icon: <Users className="w-6 h-6" />,
      color: "from-green-500 to-green-600"
    },
    {
      phase: 3,
      title: "MVP Demo Days",
      subtitle: "Development Phase",
      period: "October - November",
      description: "Iterative development with continuous feedback",
      activities: [
        "MVP demo days → attached feedback loops",
        "Incorporation of feedback to refine product",
        "Cycle: MVP → User Needs → Feedback → Changes → back to MVP"
      ],
      icon: <Zap className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      phase: 4,
      title: "Resources & Manpower",
      subtitle: "Resourcing Phase",
      period: "December",
      description: "Scaling teams and resources",
      activities: [
        "Identify resources required",
        "Identify manpower required",
        "Lateral intakes: Accelerate n.5",
        "Cohort n.5 integration"
      ],
      icon: <Users className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600"
    },
    {
      phase: 5,
      title: "Testing",
      subtitle: "Testing Phase",
      period: "January",
      description: "Scale testing and user validation",
      activities: [
        "β-Testing starts on scale levels",
        "100 users loop testing",
        "1000 users loop testing",
        "Final step → Launch the product"
      ],
      icon: <CheckCircle className="w-6 h-6" />,
      color: "from-red-500 to-red-600"
    },
    {
      phase: 6,
      title: "Product Launch",
      subtitle: "Launch Phase",
      period: "February",
      description: "Market entry and industry connection",
      activities: [
        "Incubators reach out",
        "VC connect (for funding)",
        "Market/Industry feedback & entry",
        "Institutional support"
      ],
      icon: <Rocket className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const domains = [
    {
      name: "Healthcare + AI Integration",
      description: "Revolutionizing healthcare through intelligent AI solutions",
      icon: "🏥"
    },
    {
      name: "Finance (FinTech)",
      description: "Building the future of financial technology and services",
      icon: "💰"
    },
    {
      name: "Defense Tech",
      description: "Advanced technology solutions for national security",
      icon: "🛡️"
    },
    {
      name: "AgriTech",
      description: "Transforming agriculture through innovative technology",
      icon: "🌱"
    },
    {
      name: "IoT",
      description: "Connecting the world through Internet of Things",
      icon: "🌐"
    },
    {
      name: "Quantum Tech",
      description: "Exploring the frontiers of quantum computing",
      icon: "⚛️"
    },
    {
      name: "Open Ecosystem",
      description: "Building collaborative and open innovation platforms",
      icon: "🔗"
    }
  ];

  const stats = [
    { number: "6", label: "Months", description: "Intensive Program" },
    { number: "6", label: "Phases", description: "Structured Approach" },
    { number: "7", label: "Domains", description: "Focus Areas" },
    { number: "∞", label: "Impact", description: "Potential Reach" }
  ];

  return (
    <>
      <PageHead 
        title="Accelerate 1.0 Program - OpenLearn"
        description="Transform your ideas into world-changing products through our comprehensive 6-month Accelerate program. From concept to launch with structured guidance."
        keywords="accelerate program, innovation, product development, startup incubation, tech entrepreneurship"
      />
      
      <Navbar />
      
      <div className="min-h-screen pt-16 bg-white">
        <HeroSection 
          title="Accelerate 1.0"
          subtitle="From Idea to Market Reality"
          description="A comprehensive <em>6-month journey</em> that transforms innovative ideas into <strong style='color: #000000'> world-changing products</strong> through structured mentorship, industry connections, and systematic development phases."
        />

        {/* Stats Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Program Phases */}
        <section className="py-16 sm:py-20 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20 lg:mb-24">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6 text-black tracking-tight">
                Program Structure
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Six carefully designed phases that guide you from initial concept to successful product launch
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {phases.map((phase, index) => (
                <div 
                  key={index}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:-translate-y-2">
                    {/* Phase Header */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-base sm:text-lg font-bold">
                          {phase.phase}
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Phase {phase.phase}
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-400 text-lg sm:text-xl">
                        {phase.icon}
                      </div>
                    </div>

                    {/* Phase Title */}
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black mb-2 sm:mb-3 leading-tight">
                        {phase.title}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                        {phase.description}
                      </p>
                    </div>

                    {/* Phase Activities */}
                    <div className="space-y-2 sm:space-y-3">
                      {phase.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-black rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></div>
                          <span className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Focus Domains */}
        <section className="py-16 sm:py-20 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-black tracking-tight">
                Focus Domains
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl lg:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                Choose from cutting-edge domains that are shaping the future of technology and society
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {domains.map((domain, index) => (
                <div 
                  key={index}
                  className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">
                      {domain.icon}
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-xl font-medium text-black mb-2 sm:mb-3 leading-tight">
                      {domain.name}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                      {domain.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-black rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 text-white">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4">
                Ready to Accelerate Your Innovation?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Join the next cohort of innovators and transform your ideas into products that change the world.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default AcceleratePage;
