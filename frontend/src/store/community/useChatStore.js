import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/community/axios";
import { useAuthStore } from "../../store/netflix/authUser";
import { getSocket } from "../../socket/tinder/socket.client";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = getSocket();

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      const { user } = useAuthStore.getState();
      if (!selectedUser || !user) return;
  
      const isForMe =
          (newMessage.senderId === selectedUser._id && newMessage.receiverId === user._id) ||
          (newMessage.senderId === user._id && newMessage.receiverId === selectedUser._id);
  
      console.log("Socket received newMessage:", newMessage, "isForMe:", isForMe);
  
      if (!isForMe) return;
  
      set({
          messages: [...get().messages, newMessage],
      });
  });
  
},

  unsubscribeFromMessages: () => {
    const socket = getSocket();
    socket.off("newMessage");

  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
