import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center hero-pattern" style={{ backgroundColor: '#FFDE59' }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h2 className="text-3xl font-bold">OpenLearn</h2>
          </Link>
          {title && <h1 className="text-2xl font-semibold mt-6">{title}</h1>}
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
