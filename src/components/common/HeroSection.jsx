import React from 'react';

const HeroSection = ({ 
  title, 
  subtitle, 
  description, 
  backgroundColor = '#FFDE59',
  titleColor = '#000000',
  subtitleColor = '#374151',
  descriptionColor = '#374151',
  className = ''
}) => {
  return (
    <section 
      className={`relative overflow-hidden hero-pattern ${className}`} 
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight" 
              style={{ color: titleColor }}
            >
              {title}
            </h1>
            {subtitle && (
              <p 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium" 
                style={{ color: subtitleColor }}
              >
                {subtitle}
              </p>
            )}
          </div>
          
          {description && (
            <div className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
              <p 
                className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed px-4 sm:px-0" 
                style={{ color: descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
