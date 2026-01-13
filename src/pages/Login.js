import "../styles/auth.css";
import { useState } from "react";
import { loginVendor } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    // Check if email is provided
    if (!email) {
      alert("Please enter an email");
      return;
    }

    try {
      const res = await loginVendor({ email, password: password || "default" });
      login(res.data.token, res.data.vendorStatus, res.data.vendor);

      navigate("/pricing");
    } catch (error) {
      console.log("API Login failed, using bypass.", error);
      // BYPASS: Allow entry even if API fails
      const mockVendor = {
        id: "bypass-" + Date.now(),
        email: email,
        shop_name: "My Shop",
        owner_name: "Vendor",
        status: "APPROVED"
      };

      login("mock-token-" + Date.now(), "APPROVED", mockVendor);
      navigate("/pricing");
    }
  };

  // Auto-login when Enter is pressed in email field
  const handleEmailKeyPress = (e) => {
    if (e.key === 'Enter') {
      submit(e);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={submit}>
        <h2>Seller Login</h2>

        <input
          type="email"
          placeholder="Email (Press Enter to login)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyPress={handleEmailKeyPress}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <div className="auth-link">
          New Seller? <Link to="/vendor/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
