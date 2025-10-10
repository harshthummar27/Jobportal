import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Shield } from "lucide-react";

// Simple custom Input component
const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    {...props}
  />
);

// Simple custom Button component
const Button = ({ children, className = "", type = "button", ...props }) => (
  <button
    type={type}
    className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Simple Card component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow p-6 ${className}`}>{children}</div>
);

const Signup = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(searchParams.get("role") || "candidate");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Mock registration
    const userData = { email, role };
    localStorage.setItem("user", JSON.stringify(userData));

    alert(
      role === "candidate"
        ? "Account created! Let's set up your profile."
        : "Account created! Your access will be granted within 24 hours."
    );

    if (role === "candidate") {
      navigate("/candidate/profile-setup");
    } else {
      navigate("/signup-success?role=recruiter");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="h-10 w-10 text-indigo-600" />
            <span className="text-3xl font-bold text-indigo-700">VettedPool</span>
          </Link>
        </div>

        <Card>
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 mb-4">Join VettedPool and get started today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block font-medium">I am a...</label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="candidate"
                  value="candidate"
                  checked={role === "candidate"}
                  onChange={() => setRole("candidate")}
                />
                <label htmlFor="candidate" className="cursor-pointer">
                  Job Seeker / Candidate
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="recruiter"
                  value="recruiter"
                  checked={role === "recruiter"}
                  onChange={() => setRole("recruiter")}
                />
                <label htmlFor="recruiter" className="cursor-pointer">
                  Recruiter / Hiring Manager
                </label>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="confirmPassword">Confirm Password</label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit">Create Account</Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
