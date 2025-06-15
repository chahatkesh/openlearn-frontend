import React from "react";
import { Lock, ArrowRight, Award, Users, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const LeagueCard = ({ 
  title, 
  description, 
  poweredBy, 
  certification, 
  isLocked = false, 
  prerequisite = null, 
  accentColor = "#4F46E5",
  gradientFrom = "#667eea",
  gradientTo = "#764ba2"
}) => {
  return (
    <motion.div 
      className={`group relative rounded-2xl p-8 h-full ${
        isLocked 
          ? 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-md' 
          : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-2xl'
      }`}
      style={{ 
        opacity: isLocked ? 0.75 : 1,
        backdropFilter: 'blur(10px)'
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: isLocked ? 0.75 : 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      
      {/* Animated background gradient overlay */}
      {!isLocked && (
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
          }}
        />
      )}

      {/* League Status Badge */}
      {isLocked ? (
        <div className="absolute -top-4 right-4 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 px-4 py-2 rounded-full text-xs font-semibold flex items-center shadow-md animate-pulse">
          <Lock size={14} className="mr-2" />
          Locked
        </div>
      ) : (
        <div className="absolute -top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-md">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            Open
          </div>
        </div>
      )}

      {/* League Icon & Title */}
      <motion.div 
        className="flex items-center mb-6"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className={`text-2xl font-bold transition-colors duration-300 ${
          isLocked ? 'text-gray-500' : 'text-gray-800 group-hover:text-gray-900'
        }`}>
          {title} League
        </h3>
      </motion.div>

      {/* League Description */}
      <motion.p 
        className={`mb-6 leading-relaxed ${
          isLocked ? 'text-gray-500' : 'text-gray-600'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {description}
      </motion.p>

      {/* Prerequisites */}
      {prerequisite && (
        <motion.div 
          className={`mb-6 p-4 rounded-lg border-l-4 transition-all duration-300 ${
            isLocked 
              ? 'bg-gray-50 border-gray-300' 
              : 'bg-amber-50 border-amber-400 hover:bg-amber-100'
          }`}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm flex items-center">
            <span className="mr-2 text-amber-500 text-lg">⚠️</span>
            <span>
              <strong className={`${
        isLocked 
          ? 'text-gray-500' 
          : 'text-amber-700'
      }`}>Prerequisite:</strong>
              <span className={isLocked ? 'text-gray-600' : 'text-amber-600'}>
                {prerequisite}
              </span>
            </span>
          </p>
        </motion.div>
      )}

      {/* Certification & Club Info */}
      <motion.div 
        className="space-y-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.5, 
          delay: 0.5,
          staggerChildren: 0.1
        }}
      >
        <motion.div 
          className="flex items-center text-sm group/cert"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="p-2 rounded-lg mr-3 transition-all duration-300"
            style={{ backgroundColor: `${accentColor}20` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Award size={16} style={{ color: accentColor }} />
          </motion.div>
          <span className={`font-medium ${isLocked ? 'text-gray-500' : 'text-gray-700'}`}>
            {certification}
          </span>
        </motion.div>
        <motion.div 
          className="flex items-center text-sm group/club"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="p-2 rounded-lg mr-3 transition-all duration-300"
            style={{ backgroundColor: `${accentColor}20` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Users size={16} style={{ color: accentColor }} />
          </motion.div>
          <span className={isLocked ? 'text-gray-500' : 'text-gray-600'}>
            Powered by: <span className="font-medium">{poweredBy}</span>
          </span>
        </motion.div>
      </motion.div>      
    </motion.div>
  );
};

const Cohort = () => {
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
      id="cohort" 
      className="py-20 pb-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-20 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Cohort 1.0 – Leagues
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 leading-relaxed"
            variants={itemVariants}
          >
            Gamify your learning journey by exploring our skill-focused leagues in this cohort.
          </motion.p>
        </motion.div>

        {/* Leagues Display with Enhanced Connection */}
        <motion.div 
          className="relative max-w-6xl mx-auto"
          variants={itemVariants}
        >
          {/* Enhanced Connection Flow */}
          <motion.div 
            className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-12"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center">
              {/* Progress Line */}
              <div className="w-32 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-gray-300 rounded-full relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Leagues Grid */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 lg:gap-20"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
          >
            {/* ML League */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <LeagueCard
                title="ML"
                description="A hands-on, community-driven journey through Machine Learning fundamentals and applications with real-world projects."
                poweredBy="OpenLearn ML Team"
                certification="ML League Certificate"
                prerequisite="Basic Python knowledge required."
                accentColor="#3B82F6"
                gradientFrom="#3B82F6"
                gradientTo="#1D4ED8"
              />
            </motion.div>

            {/* Finance League */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <LeagueCard
                title="Finance"
                description="A comprehensive finance foundation built for students who want to understand money, markets, and modern financial systems."
                poweredBy="FinNest – Finance Society of NITJ"
                certification="Specialisation Certificate in ML + Finance"
                prerequisite="Completion of ML League required."
                isLocked={true}
                accentColor="#777777"
                gradientFrom="#059669"
                gradientTo="#047857"
              />
            </motion.div>
          </motion.div>

          {/* Enhanced Specialisation Tags */}
          <motion.div 
            className="hidden lg:block absolute -bottom-8 right-8 transform"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-2xl text-sm font-bold inline-flex items-center shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Award size={18} className="mr-2" />
              <span>Specialisation Unlocks Here</span>
              <motion.div 
                className="ml-2 w-2 h-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
          
          {/* Mobile Specialisation Tag */}
          <motion.div 
            className="lg:hidden text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-2xl text-sm font-bold inline-flex items-center shadow-lg">
              <Award size={18} className="mr-2" />
              <span>Specialisation Unlocks Here</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Cohort;