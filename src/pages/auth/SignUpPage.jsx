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
        title="Create an Account" 
        subtitle="Join the OpenLearn community today"
      >
        <AuthError message={error} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                placeholder="Enter your full name"
              />
            </div>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none"
                placeholder="••••••••"
                minLength="8"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Next step:</strong> After creating your account, you'll be asked to complete your profile with academic information and social links.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !name || !email || password.length < 8}
            className="flex w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ backgroundColor: '#000000' }}
            onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#1F2937')}
            onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#000000')}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </AuthLayout>
    </>
  );
};

export default SignUpPage;
