import "../styles/auth.css";
import { useState } from "react";
import { loginVendor } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation - just check if email is provided
    if (!email) {
      setError("Please enter an email");
      return;
    }

    setLoading(true);

    // BYPASS MODE: Accept any email/password
    // Create a mock login without checking credentials
    setTimeout(() => {
      const mockVendor = {
        id: 'bypass-user',
        email: email,
        shop_name: 'Demo Shop',
        owner_name: 'Demo User',
        status: 'APPROVED'
      };

      const mockToken = 'bypass-token-' + Date.now();

      // Login with mock data
      login(mockToken, 'APPROVED', mockVendor);

      // Redirect to pricing page
      navigate("/pricing");

      setLoading(false);
    }, 500); // Small delay to show loading state
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={submit}>
        <h2>Seller Login</h2>

        {error && <div className="error-text">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password (optional)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-link">
          New Seller? <Link to="/vendor/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
