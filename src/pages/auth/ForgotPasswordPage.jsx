import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { AuthLayout, AuthError } from '../../components/features/authentication';
import { LoadingSpinner } from '../../components/ui';
import { PageHead } from '../../components/common';
import PasswordResetService from '../../utils/auth/passwordResetService';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await PasswordResetService.sendOTP(email);
      
      if (result.success) {
        // Directly navigate to reset password page after successful OTP send
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-5 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-gray-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Enter your email address and we'll send you a code to reset your password.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-800">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
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
            className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl bg-gray-50/50 text-sm sm:text-base placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all duration-200 outline-none"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 sm:py-4 px-4 border border-transparent rounded-xl sm:rounded-2xl shadow-sm text-sm sm:text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" color="white" />
          ) : (
            'Send Reset Code'
          )}
        </button>
      </div>
    </form>
  );

  return (
    <>
      <PageHead 
        title="Forgot Password"
        description="Reset your OpenLearn account password. Enter your email to receive a verification code and create a new password."
        keywords="forgot password, password reset, account recovery, OpenLearn"
      />
      
      <AuthLayout 
        title="Forgot Password"
        subtitle="Reset your password"
      >
        {/* Error message */}
        <AuthError message={error} />

        {/* Email form */}
        {renderEmailStep()}

        {/* Back to sign in link */}
        <div className="text-center pt-4 sm:pt-6 border-t border-gray-100">
          <Link to="/signin" className="text-sm sm:text-base text-gray-600 hover:text-black flex items-center justify-center font-medium transition-colors duration-200">
            <ArrowLeft size={16} className="mr-2" />
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    </>
  );
};

export default ForgotPasswordPage;
