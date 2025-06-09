import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Here you would call your API to trigger the password reset flow
      // For now, we're simulating success after a brief delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="We'll send you a link to reset your password"
    >
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      {isSubmitted ? (
        <div>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Password reset link sent! Check your email inbox at {email}.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Didn't receive an email? Check your spam folder or try again.
            </p>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-black underline hover:text-gray-700 font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95"
              style={{ backgroundColor: '#000000' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1F2937'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link to="/signin" className="flex items-center justify-center text-black hover:text-gray-700 text-sm">
          <ArrowLeft size={16} className="mr-1" />
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
