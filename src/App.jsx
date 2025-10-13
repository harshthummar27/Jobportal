import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import CandidateInfo from "./pages/CandidateInfo";
import RecruiterInfo from "./pages/RecruiterInfo";
import SignupSuccess from "./pages/SignupSuccess";
import ProfileSetup from "./pages/candidate/ProfileSetup";
import Signup from "./pages/Signup";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateProfile from "./pages/recruiter/CandidateProfile";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CandidateSearch from "./pages/recruiter/CandidateSearch";
import RecruiterRegistration from "./pages/recruiter/RecruiterRegistration";
import EmailVerification from "./pages/recruiter/EmailVerification";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import RecruiterContract from "./pages/recruiter/RecruiterContract";
import ShortlistedCandidates from "./pages/recruiter/ShortlistedCandidates";
import InterviewTracking from "./pages/recruiter/InterviewTracking";
import SelectionDashboard from "./pages/recruiter/SelectionDashboard";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import PendingCandidates from "./pages/superadmin/PendingCandidates";
import ApprovedCandidates from "./pages/superadmin/ApprovedCandidates";
import Recruiters from "./pages/superadmin/Recruiters";
import InternalTeam from "./pages/superadmin/InternalTeam";
import NotFound from "./pages/NotFound";
import SuperAdminLayout from "./Components/SuperAdminLayout";
// import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/candidate-info" element={<CandidateInfo />} />
      <Route path="/recruiter-info" element={<RecruiterInfo />} />
      <Route path="/signup-success" element={<SignupSuccess />} />
      <Route path="/candidate/profile-setup" element={<ProfileSetup />} />
      <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
      <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      <Route path="/recruiter/search" element={<CandidateSearch />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/recruiter/candidate/:code" element={<CandidateProfile />} />
      
        {/* Recruiter Registration Flow */}
        <Route path="/recruiter/register" element={<RecruiterRegistration />} />
        <Route path="/recruiter/verification" element={<EmailVerification />} />
        <Route path="/recruiter/profile-setup" element={<RecruiterProfile />} />
        <Route path="/recruiter/contract" element={<RecruiterContract />} />
        
        {/* Recruiter Selection & Management */}
        <Route path="/recruiter/shortlisted" element={<ShortlistedCandidates />} />
        <Route path="/recruiter/interview-tracking" element={<InterviewTracking />} />
        <Route path="/recruiter/selection-dashboard" element={<SelectionDashboard />} />
      
      {/* Super Admin Routes */}
      <Route path="/superadmin/dashboard" element={<SuperAdminLayout><SuperAdminDashboard /></SuperAdminLayout>} />
      <Route path="/superadmin/pending-candidates" element={<SuperAdminLayout><PendingCandidates /></SuperAdminLayout>} />
      <Route path="/superadmin/approved-candidates" element={<SuperAdminLayout><ApprovedCandidates /></SuperAdminLayout>} />
      <Route path="/superadmin/recruiters" element={<SuperAdminLayout><Recruiters /></SuperAdminLayout>} />
      <Route path="/superadmin/internal-team" element={<SuperAdminLayout><InternalTeam /></SuperAdminLayout>} />
      
      <Route path="*" element={<NotFound />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
