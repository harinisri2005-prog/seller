import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`
});

export const signupVendor = (data) =>
  API.post("/signup", data);

export const loginVendor = (data) =>
  API.post("/login", data);

