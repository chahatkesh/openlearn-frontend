import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { MotionDiv, MotionSection, MotionH2, MotionA, MotionP } from '../../common/MotionWrapper';

const Cta = () => {
  // URL for the WhatsApp community - replace with actual URL
  const whatsappUrl = "https://chat.whatsapp.com/B7cvzXeKjwdB9k9BsmvbDY";

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <MotionSection 
      id="join-cohort" 
      className="py-12 sm:py-16 lg:py-20 xl:py-24 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-[#FFDE59]/80"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
      </div>
      
      {/* Floating shapes */}
      <div className="absolute -top-10 -right-10 w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-20 -left-20 w-48 sm:w-60 lg:w-72 h-48 sm:h-60 lg:h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionDiv 
          className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl lg:rounded-[2rem] shadow-2xl overflow-hidden"
          variants={itemVariants}
        >
          <div className="flex flex-col lg:flex-row">
          
            {/* Left content area with text and buttons */}
            <div className="w-full lg:w-7/12 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 flex flex-col justify-center">
              <MotionH2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-5 text-gray-900 leading-tight tracking-tight"
                variants={itemVariants}
              >
                Ready to Learn, Compete, and Grow?
              </MotionH2>
              
              <MotionP 
                className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-700 mb-6 sm:mb-8 lg:mb-8 max-w-lg lg:max-w-xl leading-relaxed font-light"
                variants={itemVariants}
              >
                Become a Pioneer in Cohort 1.5. Join the leagues, earn certifications, 
                and build your domain expertise with NITJ's smartest community.
              </MotionP>
              
              <MotionDiv 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8"
                variants={itemVariants}
              >
                {/* Primary CTA Button */}
                <MotionA 
                  href="/signin"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }} 
                  className="inline-flex items-center justify-center px-6 sm:px-8 lg:px-8 py-3 sm:py-4 lg:py-4 bg-black text-[#FFDE59] text-base sm:text-lg lg:text-lg font-semibold rounded-full shadow-lg hover:shadow-yellow-400/20 hover:shadow-xl transition-all duration-300 group"
                >
                  Join Cohort 1.5
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </MotionA>
                
                {/* Secondary CTA Button */}
                <MotionA 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 lg:px-8 py-3 sm:py-4 lg:py-4 bg-[#25D366] text-white text-base sm:text-lg lg:text-lg font-semibold rounded-full shadow-lg hover:shadow-green-400/20 hover:shadow-xl transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="mr-2" size={18} />
                  Join Community
                </MotionA>
              </MotionDiv>
              
              <p className="text-xs sm:text-sm lg:text-base text-gray-500 italic font-light">
                Stay updated, connected, and inspired.
              </p>
            </div>
            
            {/* Right area with QR Code */}
            <div className="w-full lg:w-5/12 bg-gray-50 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-gray-100">
              <div className="mb-4 sm:mb-6 lg:mb-6 text-center">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 tracking-tight">Scan to Join</h3>
                <p className="text-xs sm:text-sm lg:text-sm text-gray-500 font-light">Join our WhatsApp community instantly</p>
              </div>
              
              {/* QR Code with animation */}
              <div className="p-2 sm:p-3 lg:p-3 bg-white rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 mb-4 sm:mb-6 lg:mb-6">
                <img 
                  src="/whatsapp-qr.png"
                  alt="WhatsApp Community QR Code" 
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-40 lg:h-40 xl:w-44 xl:h-44 object-contain"
                />
              </div>
              
              {/* Fallback link */}
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 font-light">or click below</p>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs sm:text-sm lg:text-sm font-medium text-[#25D366] hover:underline flex items-center justify-center transition-colors duration-200"
                >
                  Direct Link to Join
                  <ArrowRight className="ml-1" size={12} />
                </a>
              </div>
            </div>
          
          </div>
        </MotionDiv>
      </div>
    </MotionSection>
  );
};

export default Cta;