import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/tinder" : "/api/tinder";
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/tinder" : import.meta.env.VITE_BACKEND_URL;


export const axiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});
