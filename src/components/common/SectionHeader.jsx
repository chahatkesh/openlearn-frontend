import React from 'react';
import { MotionDiv, MotionH2, MotionP } from './MotionWrapper';

const SectionHeader = ({ 
  title, 
  description, 
  className = "text-center mb-20",
  titleClassName = "text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight",
  descriptionClassName = "text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light",
  hideDescriptionOnMobile = true
}) => {
  return (
    <MotionDiv 
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <MotionH2 
        className={titleClassName}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {title}
      </MotionH2>
      
      {description && (
        <MotionP 
          className={`${hideDescriptionOnMobile ? 'hidden md:block' : ''} ${descriptionClassName}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </MotionDiv>
  );
};

export default SectionHeader;
