import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Shield, 
  CheckCircle, 
  RefreshCw, 
  Clock,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import EmailVerificationService from '../../utils/auth/emailVerificationService';
import { PageHead } from '../../components/common';
import { AuthLayout, AuthError } from '../../components/features/authentication';
import { OTPInput } from "../../components/ui";

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  // Form state
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Check if email verification is needed
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const status = await EmailVerificationService.checkVerificationStatus();
        if (status.emailVerified) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    };

    if (user) {
      checkVerificationStatus();
    }
  }, [user, navigate]);

  // Auto-send OTP on page load
  useEffect(() => {
    if (user && !otpSent) {
      handleSendOtp();
    }
  }, [user, otpSent]);

  // Handle OTP input
  const handleOtpChange = (value) => {
    setOtp(value);
    
    // Clear errors
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    setSendingOtp(true);
    setErrors({});
    
    try {
      await EmailVerificationService.sendVerificationOTP();
      setOtpSent(true);
      setCanResend(false);
      
      // Start 5-minute countdown
      const cleanup = EmailVerificationService.startTimer(
        300, // 5 minutes
        (remaining) => setTimeRemaining(remaining),
        () => setCanResend(true)
      );
      
      // Cleanup timer on unmount
      return cleanup;
      
    } catch (error) {
      setErrors({ general: error.message || 'Failed to send OTP. Please try again.' });
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate OTP
      const validation = EmailVerificationService.validateOTP(otp);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }

      // Verify OTP
      await EmailVerificationService.verifyOTP(otp);
      
      // Show success state
      setVerificationSuccess(true);
      
      // Refresh user data
      await refreshUser();
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      setErrors({ general: error.message || 'OTP verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  // Success state
  if (verificationSuccess) {
    return (
      <>
        <PageHead 
          title="Email Verified Successfully"
          description="Your email has been verified successfully"
          keywords="email verification, account verification, success"
        />
        
        <AuthLayout 
          title="Email Verified!" 
          subtitle="Welcome to OpenLearn"
        >
          <div className="text-center space-y-5 sm:space-y-6">
            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-green-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3">
                Email Verified Successfully!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Welcome to OpenLearn! Redirecting to your dashboard...
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-gray-600 pt-2">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm sm:text-base font-medium">Loading dashboard...</span>
            </div>
          </div>
        </AuthLayout>
      </>
    );
  }

  return (
    <>
      <PageHead 
        title="Verify Your Email"
        description="Verify your email address to complete your OpenLearn account setup"
        keywords="email verification, OTP verification, account security"
      />
      
      <AuthLayout 
        title="Verify Your Email" 
        subtitle={`We sent a verification code to ${user?.email}`}
      >
        {/* Error Message */}
        {errors.general && (
          <AuthError message={errors.general} />
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-blue-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Enter the 6-digit verification code to complete your account setup
            </p>
          </div>

          {/* OTP Input */}
          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-medium text-gray-800 mb-3">
              <Shield size={16} className="inline mr-2" />
              Verification Code
            </label>
            <OTPInput
              value={otp}
              onChange={handleOtpChange}
              length={6}
              disabled={loading}
              className="mb-2"
            />
            <p className="text-xs sm:text-sm text-gray-500 text-center">Enter the 6-digit code from your email</p>
            {errors.otp && (
              <p className="text-red-600 text-xs sm:text-sm mt-1 font-medium text-center">{errors.otp}</p>
            )}
          </div>

          {/* Verify Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex justify-center items-center py-3 sm:py-4 px-4 border border-transparent rounded-xl sm:rounded-2xl shadow-sm text-sm sm:text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>

          {/* Resend OTP */}
          <div className="text-center pt-4 sm:pt-6 border-t border-gray-100">
            {!canResend ? (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Clock size={16} />
                <span className="text-sm sm:text-base">
                  Resend code in {EmailVerificationService.formatTimeRemaining(timeRemaining)}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="inline-flex items-center gap-2 text-black hover:text-gray-800 font-medium transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
              >
                {sendingOtp ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Resend Code
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-3 sm:p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Didn't receive the code?</h3>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure {user?.email} is correct</li>
            <li>• Wait a few minutes for email delivery</li>
            <li>• Click "Resend Code" if needed</li>
          </ul>
        </div>

        {/* Security Notice */}
        <div className="text-center pt-4">
          <p className="text-xs sm:text-sm text-gray-500">
            🔒 This verification helps keep your account secure
          </p>
        </div>
      </AuthLayout>
    </>
  );
};

export default EmailVerificationPage;
