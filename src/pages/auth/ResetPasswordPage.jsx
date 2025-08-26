import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { AuthLayout } from "../../components/features/authentication";
import { AuthError } from "../../components/features/authentication";
import { LoadingSpinner } from "../../components/ui";
import { OTPInput } from "../../components/ui";
import { PageHead } from "../../components/common";
import PasswordResetService from '../../utils/auth/passwordResetService';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('reset'); // 'reset', 'success'
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: {}
  });

  // Validate password in real-time
  useEffect(() => {
    if (newPassword) {
      const validation = PasswordResetService.validatePassword(newPassword);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation({ isValid: false, errors: {} });
    }
  }, [newPassword]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    // Validate OTP
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate password strength
    if (!passwordValidation.isValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await PasswordResetService.resetPassword(email, otp, newPassword);
      
      if (result.success) {
        setStep('success');
        setSuccessMessage(result.message);
      } else {
        setError(result.error);
        // If it's an OTP error, we might want to show attempts remaining
        if (result.data?.attemptsRemaining !== undefined) {
          setAttemptsRemaining(result.data.attemptsRemaining);
        }
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForgotPassword = () => {
    navigate('/forgot-password');
  };

  const renderPasswordRequirements = () => {
    const requirements = [
      { key: 'minLength', text: 'At least 8 characters' },
      { key: 'hasUpperCase', text: 'One uppercase letter (A-Z)' },
      { key: 'hasLowerCase', text: 'One lowercase letter (a-z)' },
      { key: 'hasNumbers', text: 'One number (0-9)' },
      { key: 'hasSpecialChar', text: 'One special character (!@#$%^&*)' }
    ];

    return (
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-600 mb-2">Password must contain:</p>
        {requirements.map(({ key, text }) => (
          <div key={key} className="flex items-center text-xs">
            <CheckCircle 
              size={12} 
              className={`mr-2 ${
                passwordValidation.errors[key] === false 
                  ? 'text-green-500' 
                  : 'text-gray-300'
              }`}
            />
            <span className={
              passwordValidation.errors[key] === false 
                ? 'text-green-600' 
                : 'text-gray-500'
            }>
              {text}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderResetStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Reset your password</h3>
        <p className="text-gray-600">
          Enter the verification code sent to <strong>{email}</strong> and create a new password
        </p>
      </div>

      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-3">
          Verification Code
        </label>
        <OTPInput
          value={otp}
          onChange={setOtp}
          length={6}
          disabled={isLoading}
          className="mb-2"
        />
        <p className="text-xs text-gray-500 text-center">Enter the 6-digit code from your email</p>
        {attemptsRemaining !== null && (
          <p className="mt-1 text-xs text-red-600 text-center">
            {attemptsRemaining} attempts remaining
          </p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-gray-400" />
          </div>
          <input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
            placeholder="••••••••"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {newPassword && renderPasswordRequirements()}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
            placeholder="••••••••"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="mt-1 text-xs text-red-600 flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            Passwords do not match
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword || otp.length !== 6}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{ backgroundColor: '#000000' }}
          onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#1F2937')}
          onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#000000')}
        >
          {isLoading ? (
            <LoadingSpinner size="sm" color="white" />
          ) : (
            'Reset Password'
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleBackToForgotPassword}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center mx-auto"
        >
          <ArrowLeft size={16} className="mr-1" />
          Request new code
        </button>
      </div>
    </form>
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
        className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
      >
        Go to Sign In
      </Link>
    </div>
  );

  if (!email) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <PageHead 
        title="Reset Password"
        description="Reset your OpenLearn account password by entering the verification code sent to your email."
        keywords="reset password, verification code, new password, OpenLearn"
      />
      
      <AuthLayout 
        title={step === 'reset' ? 'Reset Password' : 'Success'}
        subtitle={step === 'reset' ? 'Enter verification code and new password' : 'Password updated successfully'}
      >
        {/* Success message */}
        {successMessage && step !== 'success' && (
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
        {step === 'reset' && renderResetStep()}
        {step === 'success' && renderSuccessStep()}
      </AuthLayout>
    </>
  );
};

export default ResetPasswordPage;
