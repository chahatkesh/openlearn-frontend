import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MotionDiv, MotionSection, MotionButton, MotionH1, MotionH2, MotionLi, MotionUl, MotionSpan, MotionP } from '../common/MotionWrapper';

const Hero = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95,
      y: 0
    }
  };

  return (
      <MotionSection
        className="relative min-h-[100vh] flex flex-col justify-center hero-pattern"
        style={{ backgroundColor: '#FFDE59' }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
      <div className="container max-w-[80vw] mx-auto px-4 py-16 pt-32 md:pt-20">
        <div className="flex flex-col lg:flex-row items-center">
          <MotionDiv 
            className="lg:w-1/2 lg:pr-12"
            variants={containerVariants}
          >
            <div>
              <MotionH1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" 
                style={{color: '#000000'}}
                variants={itemVariants}
              >
                OpenLearn Cohort
              </MotionH1>
              <MotionP
                className="text-lg md:text-xl mb-8 max-w-lg"
                style={{ color: '#374151' }}
                variants={itemVariants}
              >
                OpenLearn Cohort 1.5 - Explore new fields, build real projects, and grow with passionate peers in a collaborative journey.
              </MotionP>
              <MotionDiv
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <MotionButton
                  className="px-6 py-3 text-lg text-white transition-all duration-200 rounded-md font-medium cursor-pointer"
                  style={{ backgroundColor: '#000000' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1F2937'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
                  onClick={() => navigate('/cohorts')}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Join Cohort 1.5{" "}
                  <ArrowRight size={18} className="ml-2 animate-pulse inline" />
                </MotionButton>
                <MotionButton
                  className="px-6 py-3 text-lg border-2 transition-all duration-200 rounded-md font-medium cursor-pointer"
                  style={{ borderColor: '#000000', color: '#000000' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  onClick={() => navigate('/about')}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Learn More
                </MotionButton>
              </MotionDiv>
            </div>
          </MotionDiv>
          <MotionDiv 
            className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center lg:justify-end"
            variants={cardVariants}
          >
            <div className="relative">
              <MotionDiv 
                className="absolute -top-4 -left-4 w-full h-full border-2 border-black rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              />
              <MotionDiv 
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 relative"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ duration: 0.3 }}
              >
                <MotionH2 
                  className="font-bold text-xl mb-4 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <span className="rounded-full p-1 mr-2" style={{backgroundColor: '#FFDE59'}}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
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
                <MotionUl 
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 1
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
                      className="flex items-start group"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { 
                          opacity: 1, 
                          x: 0,
                          transition: {
                            duration: 0.4,
                            ease: "easeOut"
                          }
                        }
                      }}
                    >
                      <MotionDiv 
                        className="p-1 rounded-full mr-3 mt-1 transition-all duration-300"
                        style={{backgroundColor: '#FFDE59'}}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M13.3334 4L6.00008 11.3333L2.66675 8"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </MotionDiv>
                      <MotionSpan 
                        className="group-hover:translate-x-1 transition-transform duration-200"
                        whileHover={{ x: 4 }}
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