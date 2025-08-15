import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import CohortsPage from './pages/CohortsPage'
import CommunityPage from './pages/CommunityPage'
import GalleryPage from './pages/GalleryPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import DashboardLayout from './components/dashboard/DashboardLayout'
import DashboardMainPage from './pages/DashboardMainPage'
import LeagueDetailPageRoute from './pages/LeagueDetailPageRoute'
import LogoutPage from './pages/LogoutPage'
import AdminPage from './pages/AdminPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import UpdatesPage from './pages/UpdatesPage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import ScrollToTop from './components/common/ScrollToTop'

// Admin components
import AdminLayout from './components/admin/AdminLayout'
import AdminDefaultRedirect from './components/admin/AdminDefaultRedirect'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminCohortsPage from './pages/admin/AdminCohortsPage'
import AdminLeaguesPage from './pages/admin/AdminLeaguesPage'
import AdminSpecializationsPage from './pages/admin/AdminSpecializationsPage'
import AdminWeeksPage from './pages/admin/AdminWeeksPage'
import AdminSectionsPage from './pages/admin/AdminSectionsPage'
import AdminResourcesPage from './pages/admin/AdminResourcesPage'
import AdminAssignmentsPage from './pages/admin/AdminAssignmentsPage'

const App = () => {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cohorts" element={<CohortsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/updates" element={<UpdatesPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboard routes with layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardMainPage />} />
            <Route path="league/:id" element={<LeagueDetailPageRoute />} />
          </Route>
          {/* Legacy dashboard route for backward compatibility */}
          <Route path="/dashboard-old" element={<DashboardPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Route>
        
        {/* Routes with specific role requirements */}
        <Route element={<ProtectedRoute requiredRoles={['ADMIN', 'GRAND_PATHFINDER', 'CHIEF_PATHFINDER']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDefaultRedirect />} />
            <Route element={<ProtectedRoute requiredRoles={['GRAND_PATHFINDER']} />}>
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="specializations" element={<AdminSpecializationsPage />} />
            </Route>
            <Route path="cohorts" element={<AdminCohortsPage />} />
            <Route path="leagues" element={<AdminLeaguesPage />} />
            <Route path="weeks" element={<AdminWeeksPage />} />
            <Route path="sections" element={<AdminSectionsPage />} />
            <Route path="resources" element={<AdminResourcesPage />} />
            <Route path="assignments" element={<AdminAssignmentsPage />} />
          </Route>
          {/* Legacy redirect for old admin page */}
          <Route path="/admin-old" element={<AdminPage />} />
        </Route>

        {/* Fallback route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App