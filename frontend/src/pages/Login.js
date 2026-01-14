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

    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    setLoading(true);

    try {
      const { data } = await loginVendor({ email, password });

      if (data.token) {
        login(data.token, data.vendorStatus, data.vendor);

        if (data.vendorStatus === 'APPROVED') {
          navigate("/pricing");
        } else if (data.vendorStatus === 'PENDING') {
          navigate("/vendor/pending-approval");
        } else {
          setError(`Account status: ${data.vendorStatus || 'Unknown'}`);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
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
          placeholder="Password"
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
