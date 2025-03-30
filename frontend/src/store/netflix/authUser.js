import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { disconnectSocket, getSocket, initializeSocket } from "../../socket/tinder/socket.client";
import { io } from "socket.io-client";
import { axiosInstance } from "../../lib/community/axios.js";


export const useAuthStore = create((set, get) => ({
	user: null,
	isSigningUp: false,
	isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
	loading: false,

	// community
	isUpdatingProfile: false,
	onlineUsers: [],
  	socket: null,
	signup: async (credentials) => {
		set({ isSigningUp: true });
		try {
			set({ loading: true });
			const response = await axios.post("/api/v1/netflix/auth/signup", credentials);
			set({ user: response.data.user, isSigningUp: false });
			initializeSocket(response.data.user._id);

			toast.success("Account created successfully");
			get().connectSocket();
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
			get().connectSocket();

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
			get().connectSocket();

			set({ user: response.data.user, isCheckingAuth: false });
		} catch (error) {
			set({ isCheckingAuth: false, user: null });
			// toast.error(error.response.data.data.message || "An error occurred");
		}
	},


	// community-start
	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });
		try {
		  const res = await axiosInstance.put("/auth/update-profile", data);
		  set({ user: res.data });
		  toast.success("Profile updated successfully");
		} catch (error) {
		  console.log("error in update profile:", error);
		  toast.error(error.response.data.message);
		} finally {
		  set({ isUpdatingProfile: false });
		}
	},
	connectSocket: () => {
		const {user} = get();
		if (!user || get().socket?.connected) return;

	
		// const socket = io(BASE_URL, {
		//   query: {
		// 	userId: user._id,
		//   },
		// });
		const socket = getSocket();
		socket.connect();
	
		set({ socket: socket });
	
		socket.on("getOnlineUsers", (userIds) => {
		  set({ onlineUsers: userIds });
		});
	},
	disconnectSocket: () => {
		if (get().socket?.connected) get().socket.disconnect();
	},
	// community-end
}));
