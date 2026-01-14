import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PendingApproval from "./pages/PendingApproval";
import Dashboard from "./pages/Dashboard";
import PricingPlans from "./components/PricingPlans";
import PosterUpload from "./components/PosterUpload";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Redirect to Login */}
          <Route path="/" element={<Navigate to="/vendor/login" />} />

          {/* Public Routes - No Authentication */}
          <Route path="/vendor/signup" element={<Signup />} />
          <Route path="/vendor/login" element={<Login />} />
          <Route path="/vendor/pending-approval" element={<PendingApproval />} />
          <Route path="/vendor/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/upload" element={<PosterUpload />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
