import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import CandidateInfo from "./pages/CandidateInfo";
import RecruiterInfo from "./pages/RecruiterInfo";
import ProfileSetup from "./pages/candidate/ProfileSetup";
import CandidateRegistration from "./pages/candidate/CandidateRegistration";
// COMMENTED OUT: Email verification component - not used for now
// import CandidateVerification from "./pages/candidate/CandidateVerification";
import CandidatePreferences from "./pages/candidate/CandidatePreferences";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateProfile from "./pages/recruiter/CandidateProfile";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterRegistration from "./pages/recruiter/RecruiterRegistration";
// COMMENTED OUT: Email verification component - not used for now
// import EmailVerification from "./pages/recruiter/EmailVerification";
import ShortlistedCandidates from "./pages/recruiter/ShortlistedCandidates";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import PendingCandidates from "./pages/superadmin/PendingCandidates";
import ApprovedCandidates from "./pages/superadmin/ApprovedCandidates";
import Recruiters from "./pages/superadmin/Recruiters";
import InternalTeam from "./pages/superadmin/InternalTeam";
import NotFound from "./pages/NotFound";
import SuperAdminLayout from "./Components/SuperAdminLayout";
import InternalTeamLayout from "./Components/InternalTeamLayout";
import ScrollToTop from "./Components/ScrollToTop";
import PublicRoute from "./Components/Auth/PublicRoute";
import PrivateRoute from "./Components/Auth/PrivateRoute";

// Internal Team Pages
import InternalTeamDashboard from "./pages/internalteam/InternalTeamDashboard";
import Notifications from "./pages/internalteam/Notifications";
import InterviewScheduling from "./pages/internalteam/InterviewScheduling";
import OfferManagement from "./pages/internalteam/OfferManagement";
import ScreeningBlocking from "./pages/internalteam/ScreeningBlocking";
import BlockedCandidates from "./pages/internalteam/BlockedCandidates";
import Communication from "./pages/internalteam/Communication";
import ActivityLog from "./pages/internalteam/ActivityLog";
import AllCandidates from "./pages/internalteam/AllCandidates";
import AllRecruiters from "./pages/internalteam/AllRecruiters";
// import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes - accessible to everyone */}
        <Route path="/" element={<Landing />} />
        <Route path="/candidate-info" element={<CandidateInfo />} />
        <Route path="/recruiter-info" element={<RecruiterInfo />} />
        
        {/* Public routes with auth guard - redirects logged-in users to dashboard */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/candidate/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/recruiter/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/candidate/register" 
          element={
            <PublicRoute>
              <CandidateRegistration />
            </PublicRoute>
          } 
        />
        <Route 
          path="/recruiter/register" 
          element={
            <PublicRoute>
              <RecruiterRegistration />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes - require authentication */}
        <Route 
          path="/candidate/profile-setup" 
          element={
            <PrivateRoute>
              <ProfileSetup />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/candidate/dashboard" 
          element={
            <PrivateRoute>
              <CandidateDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/candidate/preferences" 
          element={
            <PrivateRoute>
              <CandidatePreferences />
            </PrivateRoute>
          } 
        />
        
        {/* Recruiter Protected Routes */}
        <Route 
          path="/recruiter/dashboard" 
          element={
            <PrivateRoute>
              <RecruiterDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/recruiter/candidate/:code" 
          element={
            <PrivateRoute>
              <CandidateProfile />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/recruiter/shortlisted" 
          element={
            <PrivateRoute>
              <ShortlistedCandidates />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/recruiter/profile" 
          element={
            <PrivateRoute>
              <RecruiterProfile />
            </PrivateRoute>
          } 
        />
        
        {/* Super Admin Protected Routes */}
        <Route 
          path="/superadmin/dashboard" 
          element={
            <PrivateRoute>
              <SuperAdminLayout>
                <SuperAdminDashboard />
              </SuperAdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/superadmin/pending-candidates" 
          element={
            <PrivateRoute>
              <SuperAdminLayout>
                <PendingCandidates />
              </SuperAdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/superadmin/approved-candidates" 
          element={
            <PrivateRoute>
              <SuperAdminLayout>
                <ApprovedCandidates />
              </SuperAdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/superadmin/recruiters" 
          element={
            <PrivateRoute>
              <SuperAdminLayout>
                <Recruiters />
              </SuperAdminLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/superadmin/internal-team" 
          element={
            <PrivateRoute>
              <SuperAdminLayout>
                <InternalTeam />
              </SuperAdminLayout>
            </PrivateRoute>
          } 
        />
        
        {/* Internal Team Protected Routes */}
        <Route 
          path="/internal-team/dashboard" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <InternalTeamDashboard />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/notifications" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <Notifications />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/interview-scheduling" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <InterviewScheduling />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/offer-management" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <OfferManagement />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/screening-blocking" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <ScreeningBlocking />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/blocked-candidates" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <BlockedCandidates />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/communication" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <Communication />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/activity-log" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <ActivityLog />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/all-candidates" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <AllCandidates />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/all-recruiters" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <AllRecruiters />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Toast Container */}
      <ToastContainer />
    </>
  );
}
