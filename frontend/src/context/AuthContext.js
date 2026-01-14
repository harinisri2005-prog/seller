import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [status, setStatus] = useState(localStorage.getItem("status"));
  const [vendor, setVendor] = useState(JSON.parse(localStorage.getItem("vendor")));

  const login = (token, status, vendorData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("status", status);
    localStorage.setItem("vendor", JSON.stringify(vendorData));
    setToken(token);
    setStatus(status);
    setVendor(vendorData);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setStatus(null);
    setVendor(null);
  };

  return (
    <AuthContext.Provider value={{ token, status, vendor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
