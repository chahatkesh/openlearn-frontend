import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import LogoutPage from './pages/LogoutPage'
import AdminPage from './pages/AdminPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import ScrollToTop from './components/common/ScrollToTop'

const App = () => {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Add your protected routes here */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Route>
        
        {/* Routes with specific role requirements */}
        <Route element={<ProtectedRoute requiredRoles={['GRAND_PATHFINDER', 'CHIEF_PATHFINDER']} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Fallback route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App