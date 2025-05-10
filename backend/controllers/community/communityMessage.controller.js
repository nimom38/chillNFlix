import User from "../../models/netflix/user.model.js";
import CommunityMessage from "../../models/community/communityMessage.model.js";
import cloudinary from "../../config/tinder/cloudinary.js";
import { getReceiverSocketId, getIO } from "../../socket/tinder/socket.server.js";

// ✅ Get users for sidebar (DM)
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get DM messages
export const getMessages = async (req, res) => {
  try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;
      console.log("DEBUG: API called to get messages between", myId, "and", userToChatId);
      const messages = await CommunityMessage.find({
          $or: [
              { senderId: myId, receiverId: userToChatId },
              { senderId: userToChatId, receiverId: myId },
          ],
        }).populate("senderId", "name image _id");
        console.log("DEBUG: Messages found:", messages);
      res.status(200).json(messages);
  } catch (error) {
      res.status(500).json({ error: "Internal server error" });
  }
};


// ✅ Send DM message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new CommunityMessage({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    const io = getIO();

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
