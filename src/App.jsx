import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LogoutPage from './pages/LogoutPage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Add your protected routes here */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Route>
        
        {/* Routes with specific role requirements */}
        <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
          <Route path="/admin" element={<div className="p-8">Admin Panel (Admin Only - Coming Soon)</div>} />
        </Route>

        {/* Fallback route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App