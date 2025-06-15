import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";

const Hero = () => {
  const { isAuthenticated } = useAuth();

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

  const badgeVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8 
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
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
    <motion.section 
      className="relative min-h-[100vh] flex flex-col justify-center hero-pattern" 
      style={{backgroundColor: '#FFDE59'}}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="absolute top-0 right-0 flex items-center py-4 px-6"
        variants={itemVariants}
      >
        {isAuthenticated() ? (
          <Link 
            to="/dashboard"
            className="flex items-center px-4 py-2 text-white font-medium rounded-md shadow-sm transition duration-300 ease-in-out"
            style={{ backgroundColor: '#000000' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1F2937'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
          >
            <LayoutDashboard size={16} className="mr-2" />
            Dashboard
          </Link>
        ) : (
          <>
            <Link 
              to="/signin"
              className="mr-4 text-black hover:text-gray-800 font-medium transition duration-150 ease-in-out"
            >
              Sign In
            </Link>
            <Link 
              to="/signup"
              className="px-4 py-2 text-white font-medium rounded-md shadow-sm transition duration-300 ease-in-out"
              style={{ backgroundColor: '#000000' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1F2937'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
            >
              Sign Up
            </Link>
          </>
        )}
      </motion.div>
      <div className="container max-w-[80vw] mx-auto px-4 py-16 pt-32 md:pt-20">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 lg:pr-12"
            variants={containerVariants}
          >
            <div>
              <motion.div 
                className="flex flex-wrap gap-3 mb-4"
                variants={itemVariants}
              >
                <motion.span 
                  className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium"
                  variants={badgeVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  Starting June 15th, 2025
                </motion.span>
                <motion.span 
                  className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-1 rounded-full text-sm font-medium animate-pulse"
                  variants={badgeVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  Upcoming: Biggest AI+Finance Hackathon - September 2025
                </motion.span>
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" 
                style={{color: '#000000'}}
                variants={itemVariants}
              >
                1st MLxFinance Cohort
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl mb-8 max-w-lg" 
                style={{color: '#374151'}}
                variants={itemVariants}
              >
                Join the OpenLearn Community's inaugural cohort where Machine
                Learning meets Finance. Gain valuable skills and connect with
                fellow enthusiasts in this immersive learning experience.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.button
                  className="px-6 py-3 text-lg text-white transition-all duration-200 rounded-md font-medium cursor-pointer"
                  style={{backgroundColor: '#000000'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1F2937'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
                  onClick={() =>
                    document
                      .getElementById("join-cohort")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Join Cohort 1.0{" "}
                  <ArrowRight size={18} className="ml-2 animate-pulse inline" />
                </motion.button>
                <motion.button
                  className="px-6 py-3 text-lg border-2 transition-all duration-200 rounded-md font-medium cursor-pointer"
                  style={{borderColor: '#000000', color: '#000000'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  onClick={() =>
                    document
                      .getElementById("cohort")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div 
            className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center lg:justify-end"
            variants={cardVariants}
          >
            <div className="relative">
              <motion.div 
                className="absolute -top-4 -left-4 w-full h-full border-2 border-black rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              />
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 relative"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.h2 
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
                </motion.h2>
                <motion.ul 
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
                    "Hands-on ML projects with financial data",
                    "Expert-led sessions from industry leaders",
                    "Networking opportunities with finance & tech professionals",
                    "Certificate upon successful completion",
                    "1:1 mentorship sessions",
                  ].map((item, index) => (
                    <motion.li 
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
                      <motion.div 
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
                      </motion.div>
                      <motion.span 
                        className="group-hover:translate-x-1 transition-transform duration-200"
                        whileHover={{ x: 4 }}
                      >
                        {item}
                      </motion.span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;