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
import CandidatePreferences from "./pages/candidate/CandidatePreferences";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateMyProfile from "./pages/candidate/CandidateMyProfile";
import CandidateOffers from "./pages/candidate/CandidateOffers";
import CandidateProfile from "./pages/recruiter/CandidateProfile";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterRegistration from "./pages/recruiter/RecruiterRegistration";
import ShortlistedCandidates from "./pages/recruiter/ShortlistedCandidates";
import OfferedCandidates from "./pages/recruiter/OfferedCandidates";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
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
import PendingOffers from "./pages/internalteam/PendingOffers";
import ApprovedOffers from "./pages/internalteam/ApprovedOffers";
import DeclinedOffers from "./pages/internalteam/DeclinedOffers";
import WithdrawnOffers from "./pages/internalteam/WithdrawnOffers";
import AllCandidates from "./pages/internalteam/AllCandidates";
import AllRecruiters from "./pages/internalteam/AllRecruiters";
import InternalPendingCandidate from "./pages/internalteam/InternalPendingCandidate";
import InternalApprovedCandidate from "./pages/internalteam/InternalApprovedCandidate";
import InternalDeclinedCandidate from "./pages/internalteam/InternalDeclinedCandidate";
import InternalPendingRecruiter from "./pages/internalteam/InternalPendingRecruiter";
import InternalApprovedRecruiter from "./pages/internalteam/InternalApprovedRecruiter";
import InternalDeclinedRecruiter from "./pages/internalteam/InternalDeclinedRecruiter";
import InternalCandidateProfile from "./pages/internalteam/InternalCandidateProfile";

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
        <Route 
          path="/candidate/profile" 
          element={
            <PrivateRoute>
              <CandidateMyProfile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/candidate/offers" 
          element={
            <PrivateRoute>
              <CandidateOffers />
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
          path="/recruiter/offered-candidates" 
          element={
            <PrivateRoute>
              <OfferedCandidates />
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
          path="/internal-team/pending-offers" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <PendingOffers />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/approved-offers" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <ApprovedOffers />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/declined-offers" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <DeclinedOffers />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/withdrawn-offers" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <WithdrawnOffers />
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
          path="/internal-team/candidate/:code" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <InternalCandidateProfile />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/approved-candidates" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <InternalApprovedCandidate />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/declined-candidates" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <InternalDeclinedCandidate />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/pending-candidates" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <InternalPendingCandidate />
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
        <Route 
          path="/internal-team/pending-recruiters" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <InternalPendingRecruiter />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/approved-recruiters" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <InternalApprovedRecruiter />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/internal-team/declined-recruiters" 
          element={
            <PrivateRoute>
              <InternalTeamLayout>
                <InternalDeclinedRecruiter />
              </InternalTeamLayout>
            </PrivateRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
