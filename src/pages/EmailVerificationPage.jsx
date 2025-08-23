import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Shield, 
  CheckCircle, 
  RefreshCw, 
  Clock,
  Loader2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import EmailVerificationService from '../utils/emailVerificationService';
import PageHead from '../components/common/PageHead';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MotionDiv, MotionSection } from '../components/common/MotionWrapper';

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
    // Only allow numeric input and limit to 6 digits
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericValue);
    
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
        
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Email Verified Successfully!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Welcome to OpenLearn V2! Redirecting to your dashboard...
            </p>
            
            <div className="inline-flex items-center gap-2 text-[#FFDE59]">
              <Loader2 size={20} className="animate-spin" />
              <span className="font-medium">Loading dashboard...</span>
            </div>
          </MotionDiv>
        </div>
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
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-12">
        <div className="max-w-md mx-auto px-6">
          {/* Header */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Mail size={24} className="text-blue-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-gray-900">
              {user?.email}
            </p>
          </MotionDiv>

          {/* Form */}
          <MotionSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            {/* Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-700">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Shield size={16} className="inline mr-2" />
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  className={`w-full px-4 py-4 border rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.otp ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  maxLength={6}
                  autoComplete="one-time-code"
                />
                {errors.otp && (
                  <p className="text-red-600 text-sm mt-1">{errors.otp}</p>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                {!canResend ? (
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Clock size={16} />
                    <span>
                      Resend code in {EmailVerificationService.formatTimeRemaining(timeRemaining)}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 disabled:opacity-50"
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
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Didn't receive the code?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure {user?.email} is correct</li>
                <li>• Wait a few minutes for email delivery</li>
                <li>• Click "Resend Code" if needed</li>
              </ul>
            </div>
          </MotionSection>

          {/* Security Notice */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-500">
              🔒 This verification helps keep your account secure
            </p>
          </MotionDiv>
        </div>
      </div>
    </>
  );
};

export default EmailVerificationPage;
