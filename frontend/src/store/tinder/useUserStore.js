import { create } from "zustand";
import { axiosInstance } from "../../lib/tinder/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../netflix/authUser";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const useUserStore = create((set) => ({
	loading: false,

	updateProfile: async (data) => {
		try {
			set({ loading: true });
			const res = await axiosInstance.put("/users/update", data);
			useAuthStore.getState().setUser(res.data.user);
			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error(error.response.data.message || "Something went wrong");
		} finally {
			set({ loading: false });
		}
	},
}));
