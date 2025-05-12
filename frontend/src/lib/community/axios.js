import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const axiosInstance = axios.create({
  // baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api/community" : "/api/community",
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api/community" : import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
