import { create } from "zustand";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const useGroupStore = create((set, get) => ({
  groups: [],
  selectedGroup: null,
  selectedChannel: null,
  messages: [],

  // ✅ Fetch all groups the user is part of
  getGroups: async () => {
    try {
      const res = await axios.get("/api/community/groups");
      set({ groups: res.data });
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
  },

  setSelectedGroup: (group) => {
    if (!group) {
        set({
            selectedGroup: null,
            selectedChannel: null,
            messages: [],
        });
    } else {
         set({
            selectedGroup: group,
            selectedChannel: group.channels?.[0] || null,
            messages: [],
        });
    }
},

  // ✅ Select a channel
  setSelectedChannel: (channel) => {
    set({ selectedChannel: channel, messages: [] });
  },

  // ✅ Fetch messages for a specific channel
  fetchMessagesForChannel: async (channelId) => {
    try {
      const res = await axios.get(`/api/groups/messages/${channelId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Failed to fetch channel messages:", error);
    }
  },

  // ✅ Set messages manually (used by socket listeners)
  setMessages: (messages) => set({ messages }),

  // ✅ Create a new group (adds creator as admin)
  createGroup: async (name, members) => {
    try {
      const res = await axios.post("/api/community/groups", {
        name,
        members,
      });

      set((state) => ({
        groups: [...state.groups, res.data],
        selectedGroup: res.data,
        selectedChannel: res.data.channels?.[0] || null,
        messages: [],
      }));
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  },

  // ✅ Create a new channel in selected group (admin only)
  createChannel: async (groupId, channelName) => {
    try {
      const res = await axios.post(`/api/groups/${groupId}/channels`, {
        name: channelName,
      });

      const newChannel = res.data;

      const updatedGroups = get().groups.map((group) =>
        group._id === groupId
          ? {
              ...group,
              channels: [...(group.channels || []), newChannel],
            }
          : group
      );

      if (get().selectedGroup?._id === groupId) {
        set((state) => ({
          groups: updatedGroups,
          selectedGroup: {
            ...state.selectedGroup,
            channels: [...(state.selectedGroup.channels || []), newChannel],
          },
        }));
      } else {
        set({ groups: updatedGroups });
      }
    } catch (err) {
      console.error("Failed to create channel:", err);
    }
  },

  // ✅ Promote a user to admin
  promoteToAdmin: async (groupId, userId) => {
    try {
      await axios.post(`/api/groups/${groupId}/promote`, { userId });

      const updatedGroups = get().groups.map((group) =>
        group._id === groupId
          ? {
              ...group,
              admins: [...(group.admins || []), userId],
            }
          : group
      );

      set({ groups: updatedGroups });

      if (get().selectedGroup?._id === groupId) {
        set((state) => ({
          selectedGroup: {
            ...state.selectedGroup,
            admins: [...(state.selectedGroup.admins || []), userId],
          },
        }));
      }
    } catch (err) {
      console.error("Failed to promote member:", err);
    }
  },

  // ✅ Remove a user from group
  removeMember: async (groupId, userId) => {
    try {
      await axios.delete(`/api/groups/${groupId}/members/${userId}`);

      const updatedGroups = get().groups.map((group) =>
        group._id === groupId
          ? {
              ...group,
              members: group.members.filter((m) => m._id !== userId),
              admins: group.admins.filter((id) => id !== userId),
            }
          : group
      );

      set({ groups: updatedGroups });

      if (get().selectedGroup?._id === groupId) {
        set((state) => ({
          selectedGroup: {
            ...state.selectedGroup,
            members: state.selectedGroup.members.filter((m) => m._id !== userId),
            admins: state.selectedGroup.admins.filter((id) => id !== userId),
          },
        }));
      }
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  },
}));
