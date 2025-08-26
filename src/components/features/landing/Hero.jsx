import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MotionDiv, MotionSection, MotionButton, MotionH1, MotionH2, MotionLi, MotionUl, MotionSpan, MotionP } from '../../common/MotionWrapper';

const Hero = () => {
  const navigate = useNavigate();

  // Enhanced Apple-style animation variants with smooth easing curves
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // Apple's signature easing
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.96
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: 60,
      scale: 0.9,
      rotateY: 15
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 1,
        delay: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      y: -3,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    tap: {
      scale: 0.98,
      y: 0
    }
  };

  return (
      <MotionSection
        className="relative min-h-screen flex mt-16 flex-col justify-center hero-pattern overflow-hidden"
        style={{ backgroundColor: '#FFDE59' }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
      {/* Subtle decorative elements for depth */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-black/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-32 w-60 h-60 bg-black/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-12 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-32 xl:pb-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left Content Section */}
          <MotionDiv 
            className="space-y-8 sm:space-y-10 lg:space-y-12"
            variants={containerVariants}
          >
            <div className="space-y-6 sm:space-y-8">
              <MotionH1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight" 
                style={{
                  color: '#000000',
                  fontFeatureSettings: '"liga" 1, "kern" 1',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}
                variants={itemVariants}
              >
                OpenLearn Cohort
              </MotionH1>
              <MotionP
                className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl max-w-lg lg:max-w-xl xl:max-w-2xl leading-relaxed font-light"
                style={{ 
                  color: '#374151',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}
                variants={itemVariants}
              >
                OpenLearn Cohort 1.5 - Explore new fields, build real projects, and grow with passionate peers in a collaborative journey.
              </MotionP>
            </div>
            
            {/* Enhanced Button Group */}
            <MotionDiv
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
              variants={itemVariants}
            >
              <MotionButton
                className="group relative px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white rounded-xl sm:rounded-2xl transition-all duration-300 overflow-hidden"
                style={{ backgroundColor: '#000000' }}
                onClick={() => navigate('/cohorts')}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Join Cohort 1.5
                  <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </MotionButton>
              
              <MotionButton
                className="group px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border-2 rounded-xl sm:rounded-2xl transition-all duration-300 backdrop-blur-sm"
                style={{ 
                  borderColor: '#000000', 
                  color: '#000000',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => navigate('/about')}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                  e.target.style.borderColor = '#1F2937';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = '#000000';
                }}
              >
                Learn More
              </MotionButton>
            </MotionDiv>
          </MotionDiv>
          
          {/* Right Content - Enhanced Program Highlights Card */}
          <MotionDiv 
            className="mt-12 lg:mt-0 flex justify-center lg:justify-end"
            variants={cardVariants}
          >
            <div className="relative max-w-md lg:max-w-lg xl:max-w-xl w-full">
              {/* Card shadow/border effect */}
              <MotionDiv 
                className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 lg:-top-6 lg:-left-6 w-full h-full border-2 border-black/20 rounded-2xl sm:rounded-3xl"
                initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: -1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
              
              {/* Main card */}
              <MotionDiv 
                className="bg-white/95 backdrop-blur-md p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 relative"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)'
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
              >
                {/* Card Header */}
                <MotionH2 
                  className="font-bold text-xl sm:text-2xl lg:text-3xl mb-6 sm:mb-8 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <span className="rounded-full p-2 sm:p-3 mr-3 sm:mr-4 transition-transform duration-300 hover:scale-110" style={{backgroundColor: '#FFDE59'}}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 sm:w-5 sm:h-5">
                      <path
                        d="M8 1V15M1 8H15"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Program Highlights
                </MotionH2>
                
                {/* Enhanced Program List */}
                <MotionUl 
                  className="space-y-4 sm:space-y-5 lg:space-y-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 1.2
                      }
                    }
                  }}
                >
                  {[
                    "Hands-on projects across multiple domains",
                    "Expert-led sessions from mentors & industry leaders",
                    "Networking opportunities with students & professionals",
                    "Certificate upon successful completion",
                    "1:1 mentorship sessions",
                  ].map((item, index) => (
                    <MotionLi 
                      key={index} 
                      className="flex items-start group cursor-default"
                      variants={{
                        hidden: { opacity: 0, x: -30, scale: 0.95 },
                        visible: { 
                          opacity: 1, 
                          x: 0,
                          scale: 1,
                          transition: {
                            duration: 0.6,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }
                        }
                      }}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    >
                      <MotionDiv 
                        className="p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4 mt-1 transition-all duration-300 flex-shrink-0"
                        style={{backgroundColor: '#FFDE59'}}
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: 5,
                          backgroundColor: '#FFD700'
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 sm:w-4 sm:h-4">
                          <path
                            d="M13.3334 4L6.00008 11.3333L2.66675 8"
                            stroke="black"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </MotionDiv>
                      <MotionSpan 
                        className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                        style={{
                          fontFeatureSettings: '"liga" 1, "kern" 1',
                          WebkitFontSmoothing: 'antialiased'
                        }}
                      >
                        {item}
                      </MotionSpan>
                    </MotionLi>
                  ))}
                </MotionUl>
              </MotionDiv>
            </div>
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  );
};

export default Hero;