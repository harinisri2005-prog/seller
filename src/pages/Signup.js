import "../styles/auth.css";
import { useState } from "react";
import { signupVendor } from "../api/authApi";
import { uploadImage } from "../api/uploadApi";
import { useNavigate, Link } from "react-router-dom";
import { locations } from "../data/locations";
import { useAuth } from "../context/AuthContext";

const REQUIRED_KYC = ["AADHAAR", "PAN", "GST"];

const KYC_LABELS = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  GST: "GST Certificate",
  TRADE_LICENSE: "Trade License"
};

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  // { AADHAAR: File, PAN: File, GST: File, TRADE_LICENSE?: File }
  const [kycDocs, setKycDocs] = useState({});

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- FORM CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setForm({ ...form, state: value, city: "" });
      return;
    }

    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  // ---------------- KYC UPLOAD ----------------
  // ---------------- KYC UPLOAD ----------------
  const handleKycUpload = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("KYC must be PDF, JPG, or PNG");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("KYC file size must be under 5MB");
      return;
    }

    setError("");

    setKycDocs((prev) => ({
      ...prev,
      [type]: file
    }));
  };

  // ---------------- SUBMIT ----------------
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.email || !form.password) {
      setError("Email and Password are required");
      return;
    }

    if (!form.shopName || !form.ownerName) {
      setError("Shop Name and Owner Name are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // ---- UPLOAD KYC TO CLOUDINARY (Optional) ----
    setLoading(true);
    const kycUrls = {};
    try {
      if (Object.keys(kycDocs).length > 0) {
        for (const [type, file] of Object.entries(kycDocs)) {
          const { data } = await uploadImage(file);
          kycUrls[type] = data.url;
        }
      }

      const signupData = {
        ...form,
        kycUrls
      };

      const { data } = await signupVendor(signupData);

      // Auto Login after successful signup
      if (data.token) {
        login(data.token, data.vendorStatus, data.vendor);
        navigate("/pricing");
      } else {
        setError("Signup successful but login failed. Please login manually.");
        navigate("/vendor/login");
      }
    } catch (err) {
      console.error("Signup error:", err);

      // Handle specific error messages
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setError("Email already registered. Please login instead.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  // ---------------- PREVIEW FILE ----------------
  const previewFile = (file) => {
    if (!file) return;

    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  // ---------------- REMOVE KYC ----------------
  const removeKyc = (type) => {
    setKycDocs((prev) => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
  };


  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={submit}>
        <h2>Seller Signup</h2>

        {error && <div className="error-text">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label>Shop Name</label>
            <input name="shopName" placeholder="Shop Name" value={form.shopName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Owner Name</label>
            <input name="ownerName" placeholder="Owner Name" value={form.ownerName} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" placeholder="Phone (10-digit)" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Country</label>
            <select disabled value="India">
              <option>India</option>
            </select>
          </div>
          <div className="form-group">
            <label>State</label>
            <select name="state" value={form.state} onChange={handleChange}>
              <option value="">Select State</option>
              {Object.keys(locations).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City/District</label>
            <select name="city" value={form.city} onChange={handleChange} disabled={!form.state}>
              <option value="">
                {form.state ? "Select District" : "Select State first"}
              </option>
              {(locations[form.state] || []).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Full Address</label>
          <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
          </div>
        </div>

        {/* -------- KYC SECTION -------- */}
        <div className="kyc-section">
          <h3>Upload KYC Documents</h3>
          <div className="kyc-grid">
            {Object.entries(KYC_LABELS).map(([type, label]) => (
              <div key={type} className="kyc-upload-box">
                <label>{label} {REQUIRED_KYC.includes(type) && "*"}</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleKycUpload(type, e)}
                />

                {kycDocs[type] && (
                  <div className="file-preview-info">
                    <span
                      onClick={() => previewFile(kycDocs[type])}
                      title="Click to preview"
                      className="file-name"
                    >
                      {kycDocs[type].name}
                    </span>
                    <span
                      onClick={() => removeKyc(type)}
                      title="Remove"
                      className="remove-btn"
                    >
                      ✕
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button disabled={loading} className="submit-btn">
          {loading ? "Please wait..." : "Register"}
        </button>

        <div className="auth-link">
          Already registered? <Link to="/vendor/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
