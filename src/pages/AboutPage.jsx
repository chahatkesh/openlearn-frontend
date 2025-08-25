import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHead from '../components/common/PageHead';
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
      responsibility: "Manage OpenLearn operations, onboarding, and league management"
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
        {/* Hero Section */}
        <section className="relative overflow-hidden hero-pattern" style={{ backgroundColor: '#FFDE59' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight" style={{ color: '#000000' }}>
                  OpenLearn
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-medium" style={{ color: '#374151' }}>
                  Democratizing Learning, Transforming Future
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <p className="text-lg sm:text-xl leading-relaxed" style={{ color: '#374151' }}>
                  A student-run community, created <em>by students, for students</em>. 
                  More than just a study group - it's a self-sustaining ecosystem designed to foster 
                  <strong style={{ color: '#000000' }}> learning, research, building, and development</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-black">
                Vision & Mission
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-black">Our Vision</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  To establish a <strong className="text-black">pipeline for research, learning, building, and development</strong>, bringing forth:
                </p>
                <ul className="space-y-2 text-gray-700">
                  {['World-changing products', 'World-shaping individuals', 'A sustainable community'].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-black rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-black">Our Mission</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  To foster a <strong className="text-black">cultural shift</strong> where learners:
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  {[
                    'Build freely without barriers',
                    'Connect seamlessly with peers and mentors', 
                    'Grow unhindered by external challenges'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-black rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-black font-medium">
                  The ultimate goal is to empower learners and contribute to a stronger Nation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-black">
                How It Works
              </h2>
            </div>

            {/* Cohorts */}
            <div className="mb-16">
              <h3 className="text-xl font-semibold mb-8 text-center text-black">Cohorts</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {cohortTypes.map((cohort, index) => (
                  <div 
                    key={index}
                    className={`p-6 border rounded-lg ${
                      cohort.featured 
                        ? 'bg-[#FFDE59] border-[#FFDE59]' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <h4 className="text-lg font-semibold mb-2 text-black">
                      {cohort.title}
                    </h4>
                    <p className="text-gray-600 mb-4">{cohort.period}</p>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Structure: </span>
                        <span className="text-gray-600">{cohort.structure}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Intake: </span>
                        <span className="text-gray-600">{cohort.intake}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Domains: </span>
                        <span className="text-gray-600">{cohort.domains}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <span className="font-medium text-black">{cohort.advantage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accelerate Program */}
            <div className="mb-16">
              <h3 className="text-xl font-semibold mb-8 text-center text-black">Accelerate Program</h3>
              <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
                Where learners move from structured learning to <strong className="text-black">research and product development</strong>.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {programs.map((program, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 border border-gray-200 rounded-lg"
                  >
                    <h4 className="text-lg font-semibold mb-3 text-black">{program.title}</h4>
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {program.duration}
                      </span>
                      <span className="px-3 py-1 text-xs bg-black text-white rounded">
                        {program.period}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Focus: </span>
                        <span className="text-gray-600">{program.focus}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Description: </span>
                        <span className="text-gray-600">{program.description}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Advantages: </span>
                        <span className="text-gray-600">{program.advantages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OpenERA */}
            <div className="mb-16">
              <h3 className="text-xl font-semibold mb-8 text-center text-black">OpenERA</h3>
              <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
                A platform for <strong className="text-black">networking, showcasing, and product exposure</strong>.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {events.map((event, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 border border-gray-200 rounded-lg"
                  >
                    <h4 className="text-lg font-semibold mb-3 text-black">{event.title}</h4>
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {event.period}
                      </span>
                      <span className="px-3 py-1 text-xs bg-black text-white rounded">
                        {event.type}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Benefits: </span>
                      <span className="text-gray-600 text-sm">{event.benefits.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Structure */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-black">
                Team Structure
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamRoles.map((role, index) => (
                <div 
                  key={index} 
                  className="bg-white p-4 border border-gray-200 rounded-lg"
                >
                  <h4 className="text-lg font-semibold mb-1 text-black">{role.role}</h4>
                  <p className="text-sm text-gray-500 mb-3">{role.count}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {role.responsibility}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-black">
                Why Join OpenLearn?
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center bg-white p-6 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-4 bg-[#FFDE59] rounded-lg flex items-center justify-center text-black">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-black">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
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
