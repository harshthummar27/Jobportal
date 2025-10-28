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
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
// COMMENTED OUT: Agreement contract component - not used for now
// import RecruiterContract from "./pages/recruiter/RecruiterContract";
import ShortlistedCandidates from "./pages/recruiter/ShortlistedCandidates";
import InterviewTracking from "./pages/recruiter/InterviewTracking";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import PendingCandidates from "./pages/superadmin/PendingCandidates";
import ApprovedCandidates from "./pages/superadmin/ApprovedCandidates";
import Recruiters from "./pages/superadmin/Recruiters";
import InternalTeam from "./pages/superadmin/InternalTeam";
import NotFound from "./pages/NotFound";
import SuperAdminLayout from "./Components/SuperAdminLayout";
import InternalTeamLayout from "./Components/InternalTeamLayout";
import ScrollToTop from "./Components/ScrollToTop";

// Internal Team Pages
import InternalTeamDashboard from "./pages/internalteam/InternalTeamDashboard";
import CandidateSelections from "./pages/internalteam/CandidateSelections";
import InterviewScheduling from "./pages/internalteam/InterviewScheduling";
import OfferManagement from "./pages/internalteam/OfferManagement";
import ScreeningBlocking from "./pages/internalteam/ScreeningBlocking";
import BlockedCandidates from "./pages/internalteam/BlockedCandidates";
import Communication from "./pages/internalteam/Communication";
import ActivityLog from "./pages/internalteam/ActivityLog";
// import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/candidate-info" element={<CandidateInfo />} />
        <Route path="/recruiter-info" element={<RecruiterInfo />} />
        <Route path="/candidate/profile-setup" element={<ProfileSetup />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        
        {/* Candidate Registration Flow */}
        <Route path="/candidate/register" element={<CandidateRegistration />} />
        {/* COMMENTED OUT: Email verification route - not used for now */}
        {/* <Route path="/candidate/verification" element={<CandidateVerification />} /> */}
        <Route path="/candidate/login" element={<Login />} />
        <Route path="/candidate/preferences" element={<CandidatePreferences />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/candidate/:code" element={<CandidateProfile />} />
        
          {/* Recruiter Registration Flow */}
          <Route path="/recruiter/register" element={<RecruiterRegistration />} />
          {/* COMMENTED OUT: Email verification route - not used for now */}
          {/* <Route path="/recruiter/verification" element={<EmailVerification />} /> */}
          <Route path="/recruiter/login" element={<Login />} />
          <Route path="/recruiter/profile-setup" element={<RecruiterProfile />} />
          {/* COMMENTED OUT: Agreement contract route - not used for now */}
          {/* <Route path="/recruiter/contract" element={<RecruiterContract />} /> */}
          
          {/* Recruiter Selection & Management */}
          <Route path="/recruiter/shortlisted" element={<ShortlistedCandidates />} />
          <Route path="/recruiter/interview-tracking" element={<InterviewTracking />} />
        
        {/* Super Admin Routes */}
        <Route path="/superadmin/dashboard" element={<SuperAdminLayout><SuperAdminDashboard /></SuperAdminLayout>} />
        <Route path="/superadmin/pending-candidates" element={<SuperAdminLayout><PendingCandidates /></SuperAdminLayout>} />
        <Route path="/superadmin/approved-candidates" element={<SuperAdminLayout><ApprovedCandidates /></SuperAdminLayout>} />
        <Route path="/superadmin/recruiters" element={<SuperAdminLayout><Recruiters /></SuperAdminLayout>} />
        <Route path="/superadmin/internal-team" element={<SuperAdminLayout><InternalTeam /></SuperAdminLayout>} />
        
        {/* Internal Team Routes */}
        <Route path="/internal-team/dashboard" element={<InternalTeamLayout><InternalTeamDashboard /></InternalTeamLayout>} />
        <Route path="/internal-team/candidate-selections" element={<InternalTeamLayout><CandidateSelections /></InternalTeamLayout>} />
        <Route path="/internal-team/interview-scheduling" element={<InternalTeamLayout><InterviewScheduling /></InternalTeamLayout>} />
        <Route path="/internal-team/offer-management" element={<InternalTeamLayout><OfferManagement /></InternalTeamLayout>} />
        <Route path="/internal-team/screening-blocking" element={<InternalTeamLayout><ScreeningBlocking /></InternalTeamLayout>} />
        <Route path="/internal-team/blocked-candidates" element={<InternalTeamLayout><BlockedCandidates /></InternalTeamLayout>} />
        <Route path="/internal-team/communication" element={<InternalTeamLayout><Communication /></InternalTeamLayout>} />
        <Route path="/internal-team/activity-log" element={<InternalTeamLayout><ActivityLog /></InternalTeamLayout>} />
        
        <Route path="*" element={<NotFound />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      
      {/* Toast Container */}
      <ToastContainer />
    </>
  );
}
