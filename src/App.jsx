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
import NotFound from "./pages/NotFound";
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
      <Route path="recruiter/dashboard" element={<RecruiterDashboard />} />
      <Route path="/recruiter/search" element={<CandidateSearch />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/recruiter/candidate/:code" element={<CandidateProfile />} />
      <Route path="*" element={<NotFound />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
