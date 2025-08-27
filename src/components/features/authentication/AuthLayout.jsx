import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen px-4 py-16 md:py-20 flex flex-col items-center justify-center hero-pattern" style={{ backgroundColor: '#FFDE59' }}>
      {/* Apple-style container with backdrop blur and refined shadows */}
      <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full max-w-sm sm:max-w-md lg:max-w-lg mx-4 sm:mx-6">
        
        {/* Header section with Apple-style spacing */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          {title && (
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium mt-4 sm:mt-6 text-gray-900 tracking-tight">
              {title}
            </h1>
          )}
          
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Content with proper spacing */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
      
      {/* Simple minimal footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-600/80">
          © 2025 OpenLearn - Secured and Trusted
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
