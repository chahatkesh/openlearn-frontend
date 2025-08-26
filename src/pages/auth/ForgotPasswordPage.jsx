import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { AuthLayout, AuthError } from '../../components/features/authentication';
import { LoadingSpinner } from '../../components/ui';
import { PageHead } from '../../components/common';
import PasswordResetService from '../../utils/auth/passwordResetService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email', 'otp', 'success'
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otpData, setOtpData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 0, seconds: 0 });

  // Timer for OTP expiry
  useEffect(() => {
    let interval;
    
    if (otpData?.expiresAt && step === 'otp') {
      interval = setInterval(() => {
        const remaining = PasswordResetService.getTimeRemaining(otpData.expiresAt);
        setTimeRemaining(remaining);
        
        if (remaining.expired) {
          setError('OTP has expired. Please request a new one.');
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpData, step]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const result = await PasswordResetService.sendOTP(email);
      
      if (result.success) {
        setOtpData(result.data);
        setStep('otp');
        setSuccessMessage(result.message);
      } else {
        setError(result.error);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);

    try {
      const result = await PasswordResetService.sendOTP(email);
      
      if (result.success) {
        setOtpData(result.data);
        setSuccessMessage('A new OTP has been sent to your email.');
      } else {
        setError(result.error);
      }
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setError('');
    setSuccessMessage('');
    setOtpData(null);
  };

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-gray-600">
          Enter your email address and we'll send you a code to reset your password.
        </p>
      </div>

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
            'Send Reset Code'
          )}
        </button>
      </div>
    </form>
  );

  const renderOTPStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
        <p className="text-gray-600 mb-4">
          We sent a verification code to <strong>{email}</strong>
        </p>
        {!timeRemaining.expired && (
          <p className="text-sm text-gray-500">
            Code expires in {timeRemaining.minutes}:{timeRemaining.seconds.toString().padStart(2, '0')}
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <Link
          to={`/reset-password?email=${encodeURIComponent(email)}`}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95"
          style={{ backgroundColor: '#000000' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1F2937'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
        >
          Enter Verification Code
        </Link>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleBackToEmail}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Use different email
          </button>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isLoading || !timeRemaining.expired}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">Password Reset Successfully</h3>
      <p className="text-gray-600">
        Your password has been reset successfully. You can now sign in with your new password.
      </p>
      <Link
        to="/signin"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
      >
        Go to Sign In
      </Link>
    </div>
  );

  return (
    <>
      <PageHead 
        title="Forgot Password"
        description="Reset your OpenLearn account password. Enter your email to receive a verification code and create a new password."
        keywords="forgot password, password reset, account recovery, OpenLearn"
      />
      
      <AuthLayout 
        title={step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Verify Email' : 'Success'}
        subtitle={step === 'email' ? 'Reset your password' : step === 'otp' ? 'Enter the verification code' : 'Password updated'}
      >
        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error message */}
        <AuthError message={error} />

        {/* Render current step */}
        {step === 'email' && renderEmailStep()}
        {step === 'otp' && renderOTPStep()}
        {step === 'success' && renderSuccessStep()}

        {/* Back to sign in link - only show on email step */}
        {step === 'email' && (
          <div className="mt-6 text-center">
            <Link to="/signin" className="text-sm text-gray-600 hover:text-black flex items-center justify-center">
              <ArrowLeft size={16} className="mr-1" />
              Back to Sign In
            </Link>
          </div>
        )}
      </AuthLayout>
    </>
  );
};

export default ForgotPasswordPage;
