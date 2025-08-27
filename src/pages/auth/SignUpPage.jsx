import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthError } from "../../components/features/authentication";
import { AuthLayout } from "../../components/features/authentication";
import { LoadingSpinner } from "../../components/ui";
import { PageHead } from "../../components/common";

const SignUpPage = () => {
  // Basic info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const { signup, error, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await signup(name, email, password);
    
    setIsLoading(false);
    
    if (success) {
      navigate('/migration');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading screen while checking authentication status
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHead 
        title="Sign Up"
        description="Create your OpenLearn account and start your gamified learning journey at NIT Jalandhar. Join cohorts, earn badges, and compete with fellow students in an innovative educational experience."
        keywords="sign up, create account, student registration, join OpenLearn, NIT Jalandhar registration"
      />
      
      <AuthLayout 
        title="Create Account" 
        subtitle="Join the OpenLearn community today"
      >
        <AuthError message={error} />

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-800">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl bg-gray-50/50 text-sm sm:text-base placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all duration-200 outline-none"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-800">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl bg-gray-50/50 text-sm sm:text-base placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all duration-200 outline-none"
                placeholder="••••••••"
                minLength="8"
              />
              <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/10 rounded-lg p-1 transition-all duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Must be at least 8 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !name || !email || password.length < 8}
              className="w-full flex justify-center items-center py-3 sm:py-4 px-4 border border-transparent rounded-xl sm:rounded-2xl shadow-sm text-sm sm:text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Sign in link */}
        <div className="text-center pt-4 sm:pt-6 border-t border-gray-100">
          <p className="text-sm sm:text-base text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/signin" 
              className="font-medium text-black hover:text-gray-800 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </AuthLayout>
    </>
  );
};

export default SignUpPage;
