import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { disconnectSocket, initializeSocket } from "../../socket/tinder/socket.client";

export const useAuthStore = create((set) => ({
	user: null,
	isSigningUp: false,
	isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
	loading: false,
	signup: async (credentials) => {
		set({ isSigningUp: true });
		try {
			set({ loading: true });
			const response = await axios.post("/api/v1/netflix/auth/signup", credentials);
			set({ user: response.data.user, isSigningUp: false });
			initializeSocket(response.data.user._id);

			toast.success("Account created successfully");
		} catch (error) {
			toast.error(error.response.data.message || "Signup failed");
			set({ isSigningUp: false, user: null });
		} finally {
			set({ loading: false });
		}
	},
	login: async (credentials) => {
		set({ isLoggingIn: true });
		try {
			set({ loading: true });
			const response = await axios.post("/api/v1/netflix/auth/login", credentials);
			console.log("response", response);
			set({ user: response.data.user, isLoggingIn: false });
			initializeSocket(response.data.user._id);

		} catch (error) {
			set({ isLoggingIn: false, user: null });
			toast.error(error.response.data.data.message || "Login failed");
		} finally {
			set({ loading: false });
		}
	},
	logout: async () => {
		set({ isLoggingOut: true });
		try {
			await axios.post("/api/v1/netflix/auth/logout");
			disconnectSocket();
			set({ user: null, isLoggingOut: false });
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLoggingOut: false });
			toast.error(error.response.data.data.message || "Logout failed");
		}
	},
	authCheck: async () => {
		set({ isCheckingAuth: true });
		try {
			const response = await axios.get("/api/v1/netflix/auth/authCheck");
			initializeSocket(response.data.user._id);

			set({ user: response.data.user, isCheckingAuth: false });
		} catch (error) {
			set({ isCheckingAuth: false, user: null });
			// toast.error(error.response.data.data.message || "An error occurred");
		}
	},
}));
