import React from 'react';
import { MotionDiv, MotionH2, MotionP } from './MotionWrapper';

const SectionHeader = ({ 
  title, 
  description, 
  className = "text-center mb-16 sm:mb-20 lg:mb-24",
  titleClassName = "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-black mb-4 sm:mb-6 lg:mb-8 tracking-tight leading-tight",
  descriptionClassName = "text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed font-light px-4 sm:px-6 lg:px-0",
  hideDescriptionOnMobile = false,
  centered = true,
  maxWidth = "max-w-5xl",
  spacing = "normal", // "tight", "normal", "loose"
  showAccentLine = true
}) => {
  
  // Apple-style spacing variations
  const spacingClasses = {
    tight: "mb-12 sm:mb-16 lg:mb-20",
    normal: "mb-16 sm:mb-20 lg:mb-24",
    loose: "mb-20 sm:mb-24 lg:mb-32"
  };

  // Enhanced Apple-style animations with stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const finalClassName = `${centered ? 'text-center' : 'text-left'} ${spacingClasses[spacing] || spacingClasses.normal} ${maxWidth} mx-auto ${className}`;

  return (
    <MotionDiv 
      className={finalClassName}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <MotionH2 
        className={`
          ${titleClassName}
          text-rendering-optimizeLegibility
          antialiased
          transition-colors duration-300
          hover:text-gray-800
        `}
        variants={itemVariants}
        style={{
          fontFeatureSettings: '"liga" 1, "kern" 1',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility'
        }}
      >
        {title}
      </MotionH2>
      
      {description && (
        <MotionP 
          className={`
            ${hideDescriptionOnMobile ? 'hidden md:block' : ''} 
            ${descriptionClassName}
            transition-colors duration-300
            hover:text-gray-700
          `}
          variants={itemVariants}
          dangerouslySetInnerHTML={{ __html: description }}
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}
        />
      )}

      {/* Apple-style accent line for visual hierarchy */}
      {showAccentLine && (
        <MotionDiv
          className="mx-auto mt-6 sm:mt-8 lg:mt-10 w-12 sm:w-16 lg:w-20 h-0.5 rounded-full opacity-60"
          style={{ backgroundColor: '#ffde59' }}
          variants={itemVariants}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
        />
      )}
    </MotionDiv>
  );
};

export default SectionHeader;
