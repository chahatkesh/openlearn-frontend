import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import {
  LandingPage,
  AboutPage,
  AcceleratePage,
  CohortsPage,
  CommunityPage,
  EventsPage,
  EventDetailPage,
  UpdatesPage
} from './pages/public'

import {
  SignInPage,
  SignUpPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  MigrationPage,
  EmailVerificationPage,
  LogoutPage
} from './pages/auth'

import {
  DashboardMainPage,
  LeaguesPage,
  LeaderboardPage,
  ProfilePage,
  LeagueDetailPageRoute
} from './pages/dashboard'

import {
  PrivacyPolicyPage,
  TermsOfServicePage
} from './pages/legal'

import DashboardLayout from './components/dashboard/DashboardLayout'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import MigrationRoute from './components/auth/MigrationRoute'
import ScrollToTop from './components/common/ScrollToTop'

// Admin components
import AdminLayout from './components/admin/AdminLayout'
import AdminDefaultRedirect from './components/admin/AdminDefaultRedirect'
import {
  AdminUsersPage,
  AdminCohortsPage,
  AdminLeaguesPage,
  AdminSpecializationsPage,
  AdminWeeksPage,
  AdminSectionsPage,
  AdminResourcesPage,
  AdminAssignmentsPage
} from './pages/admin'

const App = () => {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/accelerate" element={<AcceleratePage />} />
        <Route path="/cohorts" element={<CohortsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        {/* Backward compatibility - redirect old gallery route */}
        <Route path="/gallery" element={<Navigate to="/events" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/updates" element={<UpdatesPage />} />

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
          <Route path="/logout" element={<LogoutPage />} />
        </Route>
        
        {/* Routes with specific role requirements - also wrapped with MigrationRoute */}
        <Route element={<MigrationRoute />}>
          <Route element={<ProtectedRoute requiredRoles={['ADMIN', 'GRAND_PATHFINDER', 'CHIEF_PATHFINDER', 'PATHFINDER']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDefaultRedirect />} />
              {/* Routes only for GRAND_PATHFINDER */}
              <Route element={<ProtectedRoute requiredRoles={['GRAND_PATHFINDER']} />}>
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="specializations" element={<AdminSpecializationsPage />} />
                <Route path="cohorts" element={<AdminCohortsPage />} />
              </Route>
              {/* Routes for GRAND_PATHFINDER and CHIEF_PATHFINDER */}
              <Route element={<ProtectedRoute requiredRoles={['GRAND_PATHFINDER', 'CHIEF_PATHFINDER']} />}>
                <Route path="leagues" element={<AdminLeaguesPage />} />
                <Route path="assignments" element={<AdminAssignmentsPage />} />
              </Route>
              {/* Routes for GRAND_PATHFINDER, CHIEF_PATHFINDER, and PATHFINDER */}
              <Route element={<ProtectedRoute requiredRoles={['GRAND_PATHFINDER', 'CHIEF_PATHFINDER', 'PATHFINDER']} />}>
                <Route path="weeks" element={<AdminWeeksPage />} />
                <Route path="sections" element={<AdminSectionsPage />} />
                <Route path="resources" element={<AdminResourcesPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* Fallback route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App