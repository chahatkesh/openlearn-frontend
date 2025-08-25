import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHead from '../components/common/PageHead';
import HeroSection from '../components/common/HeroSection';
import { ArrowRight, Users, BookOpen, Zap, Target, Globe, Mail, Instagram } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Structured",
      description: "Curated and well-organized content for focused learning"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Peer-Driven",
      description: "Learn alongside motivated students like you"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Focused",
      description: "End with tangible skills and real projects"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Truly Open",
      description: "No barriers, no costs - just learning and building"
    }
  ];

  const cohortTypes = [
    {
      title: "Summer Cohort (n.0)",
      period: "Summers every year",
      structure: "2 Exclusive Leagues",
      domains: "AI/ML & Finance/IoT/New Tech",
      intake: "108 students",
      advantage: "Direct entry into Accelerate Program",
      featured: true
    },
    {
      title: "Fall Cohort (n.5)",
      period: "Fall each year",
      structure: "Open leagues",
      domains: "Diverse categories with partnering teams",
      intake: "Open to all",
      advantage: "Lateral entry into Accelerate Program",
      featured: false
    }
  ];

  const programs = [
    {
      title: "Accelerate n.0",
      duration: "6 months",
      period: "Starting mid-August",
      focus: "Core research domains",
      description: "Work on research-standard problems and create state-of-the-art solutions",
      advantages: ["Research Internship", "Maximum student proprietorship"]
    },
    {
      title: "Accelerate n.5",
      duration: "3–4 months",
      period: "Sept end/Oct start",
      focus: "Open across domains",
      description: "UI/UX, Full Stack, App Dev, DevOps, AI, and more",
      advantages: ["Research Internship", "Maximum student proprietorship"]
    }
  ];

  const events = [
    {
      title: "OpenERA n.0",
      period: "January end",
      type: "World-class Hackathon",
      benefits: ["Talent showcase", "Product-building exposure", "Networking opportunities"]
    },
    {
      title: "OpenERA n.5",
      period: "March",
      type: "Tech Meetup & Expo",
      benefits: ["VC/Incubation connections", "Global product showcase platform"]
    }
  ];

  const teamRoles = [
    {
      role: "Core Leads",
      count: "4 members",
      responsibility: "Manage OpenLearn operations, onboarding, and marketing"
    },
    {
      role: "Chief Pathfinder",
      count: "1 per league",
      responsibility: "Leader for specific league, guiding its direction"
    },
    {
      role: "Pathfinders",
      count: "3–4 per league",
      responsibility: "Curate and prepare learning resources"
    },
    {
      role: "Pioneers",
      count: "Open to all",
      responsibility: "The learners - anyone and everyone can join"
    }
  ];

  return (
    <>
      <PageHead 
        title="About Us - OpenLearn"
        description="Learn about OpenLearn's mission to democratize learning and transform the future through student-driven innovation and community building."
        keywords="about openlearn, education platform, learning community, democratizing learning, student innovation"
      />
      
      <Navbar />
      
      <div className="min-h-screen pt-16 bg-white">
        <HeroSection 
          title="OpenLearn"
          subtitle="Democratizing Learning, Transforming Future"
          description="A student-run community, created <em>by students, for students</em>. More than just a study group - it's a self-sustaining ecosystem designed to foster <strong style='color: #000000'> learning, research, building, and development</strong>."
        />

        {/* Vision & Mission */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-black tracking-tight">
                Vision & Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our north star and the principles that guide everything we do
              </p>
            </div>
            
            {/* Vision & Mission Cards */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
              {/* Vision Card */}
              <div className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 h-full transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1">
                  <div className="mb-6">
                    <h3 className="text-2xl font-medium text-black mb-4">Our Vision</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-600 leading-relaxed text-lg">
                      To establish a <span className="font-medium text-black">pipeline for research, learning, building, and development</span>, bringing forth:
                    </p>
                    
                    <div className="space-y-4">
                      {['World-changing products', 'World-shaping individuals', 'A sustainable community'].map((item, index) => (
                        <div key={index} className="flex items-center group/item">
                          <div className="w-2 h-2 bg-gradient-to-r from-[#FFDE59] to-[#FFD700] rounded-full mr-4 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="text-gray-700 group-hover/item:text-black transition-colors duration-200">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mission Card */}
              <div className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 h-full transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1">
                  <div className="mb-6">
                    <h3 className="text-2xl font-medium text-black mb-4">Our Mission</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-600 leading-relaxed text-lg">
                      To foster a <span className="font-medium text-black">cultural shift</span> where learners:
                    </p>
                    
                    <div className="space-y-4">
                      {[
                        'Build freely without barriers',
                        'Connect seamlessly with peers and mentors', 
                        'Grow unhindered by external challenges'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center group/item">
                          <div className="w-2 h-2 bg-gradient-to-r from-[#FFDE59] to-[#FFD700] rounded-full mr-4 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="text-gray-700 group-hover/item:text-black transition-colors duration-200">{item}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-black font-medium text-lg">
                        The ultimate goal is to empower learners and contribute to a stronger Nation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Statement */}
            <div className="mt-20 text-center">
              <div className="bg-black rounded-3xl p-12 text-white max-w-4xl mx-auto">
                <h3 className="text-2xl font-medium mb-4">
                  Building Tomorrow's Innovators
                </h3>
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  Every learner in our community becomes part of a movement that's reshaping education, 
                  fostering innovation, and creating lasting impact on the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-black tracking-tight">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A structured journey from learning to building, designed to nurture innovation and excellence
              </p>
            </div>

            {/* Cohorts Section */}
            <div className="mb-24">
              <div className="text-center mb-16">
                <h3 className="text-2xl font-medium mb-4 text-black">
                  Cohorts
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Two distinct pathways to join our learning ecosystem
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {cohortTypes.map((cohort, index) => (
                  <div 
                    key={index}
                    className={`group relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-black/10 ${
                      cohort.featured 
                        ? 'bg-gradient-to-br from-[#FFDE59] to-[#FFD700] border border-[#FFDE59]' 
                        : 'bg-white border border-gray-100'
                    }`}
                  >
                    {cohort.featured && (
                      <div className="absolute top-6 right-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                          Featured
                        </span>
                      </div>
                    )}
                    
                    <div className="p-8">
                      <div className="mb-6">
                        <h4 className="text-2xl font-medium mb-2 text-black">
                          {cohort.title}
                        </h4>
                        <p className="text-gray-600 text-lg">{cohort.period}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white/50 rounded-2xl p-4">
                            <span className="text-sm font-medium text-gray-700 block mb-1">Structure</span>
                            <span className="text-gray-900">{cohort.structure}</span>
                          </div>
                          <div className="bg-white/50 rounded-2xl p-4">
                            <span className="text-sm font-medium text-gray-700 block mb-1">Intake</span>
                            <span className="text-gray-900">{cohort.intake}</span>
                          </div>
                          <div className="bg-white/50 rounded-2xl p-4">
                            <span className="text-sm font-medium text-gray-700 block mb-1">Domains</span>
                            <span className="text-gray-900">{cohort.domains}</span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200/50">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            <span className="font-medium text-black">{cohort.advantage}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accelerate Program Section */}
            <div className="mb-24">
              <div className="text-center mb-16">
                <h3 className="text-2xl font-medium mb-4 text-black">
                  Accelerate Program
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Where learners transition from structured learning to <span className="font-medium text-black">research and product development</span>
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {programs.map((program, index) => (
                  <div 
                    key={index} 
                    className="group bg-white rounded-3xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
                  >
                    <div className="mb-6">
                      <h4 className="text-2xl font-medium mb-3 text-black">{program.title}</h4>
                      <div className="flex gap-3">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-700">
                          {program.duration}
                        </span>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black text-white">
                          {program.period}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-2">Focus</span>
                        <p className="text-gray-900">{program.focus}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-2">Description</span>
                        <p className="text-gray-600 leading-relaxed">{program.description}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-2">Key Benefits</span>
                        <div className="space-y-2">
                          {program.advantages.map((advantage, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                              <span className="text-gray-900">{advantage}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OpenERA Section */}
            <div>
              <div className="text-center mb-16">
                <h3 className="text-2xl font-medium mb-4 text-black">
                  OpenERA
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  A premier platform for <span className="font-medium text-black">networking, showcasing, and product exposure</span>
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {events.map((event, index) => (
                  <div 
                    key={index} 
                    className="group bg-white rounded-3xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1"
                  >
                    <div className="mb-6">
                      <h4 className="text-2xl font-medium mb-3 text-black">{event.title}</h4>
                      <div className="flex gap-3">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-700">
                          {event.period}
                        </span>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black text-white">
                          {event.type}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-3">Key Benefits</span>
                      <div className="space-y-2">
                        {event.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                            <span className="text-gray-900">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Structure */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-black tracking-tight">
                Team Structure
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                A passionate group of innovators building the future of learning
              </p>
            </div>

            {/* Organizational Structure */}
            <div className="mb-24">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamRoles.map((role, index) => (
                  <div 
                    key={index} 
                    className="group relative"
                  >
                    {/* Card */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1">
                      {/* Role Title */}
                      <div className="mb-6">
                        <h4 className="text-xl font-medium text-black mb-2 leading-tight">
                          {role.role}
                        </h4>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 text-sm font-medium text-gray-600">
                          {role.count}
                        </div>
                      </div>
                      
                      {/* Responsibility */}
                      <p className="text-gray-600 leading-relaxed text-base">
                        {role.responsibility}
                      </p>
                      
                      {/* Subtle accent line */}
                      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Join the Team CTA */}
            <div className="mt-20 text-center">
              <div className="bg-gray-50 rounded-3xl p-12 border border-gray-100">
                <h3 className="text-2xl font-medium text-black mb-4">
                  Want to join our team?
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-lg mx-auto">
                  We're always looking for passionate individuals who want to make a difference in education.
                </p>
                <button className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Get in touch
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-black tracking-tight">
                Why Join OpenLearn?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience a new way of learning that's designed for the modern world
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group relative"
                >
                  {/* Feature Card */}
                  <div className="text-center bg-white rounded-3xl p-8 border border-gray-100 h-full transition-all duration-300">
                    {/* Icon Container */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-black group-hover:from-[#FFDE59] group-hover:to-[#FFD700] transition-all duration-300">
                        {feature.icon}
                      </div>
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br from-[#FFDE59]/20 to-[#FFD700]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-medium text-black group-hover:text-black transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default AboutPage;
