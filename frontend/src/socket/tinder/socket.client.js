import io from "socket.io-client";

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : import.meta.env.VITE_BACKEND_URL;

let socket = null;

export const initializeSocket = (userId) => {
	if (socket) {
		socket.disconnect();
	}

	socket = io(SOCKET_URL, {
		auth: { userId },
		query: { userId },
		withCredentials: true,
	});
};

export const getSocket = () => {
	if (!socket) {
		throw new Error("Socket not initialized");
	}
	return socket;
};

export const joinChannel = (channelId) => {
	if (socket) socket.emit("joinChannel", channelId);
};

export const leaveChannel = (channelId) => {
	if (socket) socket.emit("leaveChannel", channelId);
};

export const sendChannelMessage = (channelId, message) => {
	if (socket) socket.emit("sendChannelMessage", { channelId, message });
};

export const sendDirectMessage = (receiverId, message) => {
    const socket = getSocket();
    socket.emit("sendDirectMessage", { receiverId, message });
};


export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};
