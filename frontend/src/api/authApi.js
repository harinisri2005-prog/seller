import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth"
});

export const signupVendor = (data) =>
  API.post("/signup", data);

export const loginVendor = (data) =>
  API.post("/login", data);

