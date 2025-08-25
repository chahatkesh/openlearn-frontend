import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import CohortsPage from './pages/CohortsPage'
import CommunityPage from './pages/CommunityPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import MigrationPage from './pages/MigrationPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import DashboardPage from './pages/DashboardPage'
import DashboardLayout from './components/dashboard/DashboardLayout'
import DashboardMainPage from './pages/DashboardMainPage'
import LeaguesPage from './pages/LeaguesPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import LeagueDetailPageRoute from './pages/LeagueDetailPageRoute'
import LogoutPage from './pages/LogoutPage'
import AdminPage from './pages/AdminPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import UpdatesPage from './pages/UpdatesPage'
import AvatarDemoPage from './pages/AvatarDemoPage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import MigrationRoute from './components/auth/MigrationRoute'
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
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        {/* Backward compatibility - redirect old gallery route */}
        <Route path="/gallery" element={<Navigate to="/events" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/avatar-demo" element={<AvatarDemoPage />} />

        {/* Migration and Email Verification Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/migration" element={<MigrationPage />} />
          <Route path="/email-verification" element={<EmailVerificationPage />} />
        </Route>

        {/* Protected Routes with Migration Check */}
        <Route element={<MigrationRoute />}>
          {/* Dashboard routes with layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardMainPage />} />
            <Route path="leagues" element={<LeaguesPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="league/:id" element={<LeagueDetailPageRoute />} />
          </Route>
          {/* Legacy dashboard route for backward compatibility */}
          <Route path="/dashboard-old" element={<DashboardPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Route>
        
        {/* Routes with specific role requirements - also wrapped with MigrationRoute */}
        <Route element={<MigrationRoute />}>
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
        </Route>

        {/* Fallback route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App