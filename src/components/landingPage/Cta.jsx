import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.section 
      id="join-cohort" 
      className="py-20 relative overflow-hidden"
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
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row">
          
            {/* Left content area with text and buttons */}
            <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight"
                variants={itemVariants}
              >
                Ready to Learn, Compete, and Grow?
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg"
                variants={itemVariants}
              >
                Become a Pioneer in Cohort 1.0. Join the leagues, earn certifications, 
                and build your domain expertise with NITJ's smartest community.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                variants={itemVariants}
              >
                {/* Primary CTA Button */}
                <motion.a 
                  href="/signin"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }} 
                  className="inline-flex items-center justify-center px-6 py-4 bg-black text-[#FFDE59] text-lg font-semibold rounded-full shadow-lg hover:shadow-yellow-400/20 hover:shadow-xl transition-all duration-300 group"
                >
                  Join Cohort 1.0
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </motion.a>
                
                {/* Secondary CTA Button */}
                <motion.a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center px-6 py-4 bg-[#25D366] text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-green-400/20 hover:shadow-xl transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="mr-2" size={20} />
                  Join Community
                </motion.a>
              </motion.div>
              
              <p className="text-sm text-gray-500 italic">
                Stay updated, connected, and inspired.
              </p>
            </div>
            
            {/* Right area with QR Code */}
            <div className="w-full md:w-5/12 bg-gray-50 p-8 md:p-12 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-100">
              <div className="mb-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan to Join</h3>
                <p className="text-sm text-gray-500">Join our WhatsApp community instantly</p>
              </div>
              
              {/* QR Code with animation */}
              <div className="p-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 mb-6">
                <img 
                  src="/whatsapp-qr.png"
                  alt="WhatsApp Community QR Code" 
                  className="w-48 h-48 object-contain"
                />
              </div>
              
              {/* Fallback link */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">or click below</p>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-medium text-[#25D366] hover:underline flex items-center justify-center"
                >
                  Direct Link to Join
                  <ArrowRight className="ml-1" size={14} />
                </a>
              </div>
            </div>
          
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Cta;