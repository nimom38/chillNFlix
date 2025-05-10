import Group from "../../models/community/Group.model.js";
import Channel from "../../models/community/Channel.model.js";
import GroupMessage from "../../models/community/GroupMessage.model.js";
import User from "../../models/netflix/user.model.js";
import cloudinary from "../../config/tinder/cloudinary.js";
import { getIO } from "../../socket/tinder/socket.server.js";
import crypto from "crypto"; // 💥 For generating invite links

// ✅ Get all groups for current user
export const getGroups = async (req, res) => {
  const userId = req.user._id;

  const groups = await Group.find({ members: userId })
    .populate("members", "name image _id")
    .populate("admins", "_id")
    .populate("channels");

  res.json(groups);
};

// ✅ Create new group
export const createGroup = async (req, res) => {
  const { name, members } = req.body;
  const userId = req.user._id;

  const generalChannel = await Channel.create({
    name: "general",
    isDefault: true,
    createdBy: userId,
  });

  const inviteLink = crypto.randomBytes(16).toString("hex"); // 💥

  const group = await Group.create({
    name,
    createdBy: userId,
    members: [...members, userId],
    admins: [userId],
    channels: [generalChannel._id],
    inviteLink, // 💥
  });

  const populated = await Group.findById(group._id)
    .populate("members", "name image _id")
    .populate("admins", "_id")
    .populate("channels");

  res.status(201).json(populated);
};

// ✅ Add channel to group
export const createChannel = async (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;
  const userId = req.user._id;

  const group = await Group.findById(groupId);
  if (!group.admins.map(String).includes(userId.toString())) {
    return res.status(403).json({ message: "Only admins can create channels" });
  }

  const channel = await Channel.create({
    name,
    groupId,
    createdBy: userId,
    isDefault: false,
  });

  group.channels.push(channel._id);
  await group.save();

  res.status(201).json(channel);
};

// ✅ Promote member to admin
export const promoteToAdmin = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  const group = await Group.findById(groupId);
  if (!group.admins.map(String).includes(req.user._id.toString())) {
    return res.status(403).json({ message: "Only admins can promote users" });
  }

  if (!group.admins.map(String).includes(userId)) {
    group.admins.push(userId);
    await group.save();
  }

  res.status(200).json({ success: true });
};

// ✅ Remove member from group
export const removeMember = async (req, res) => {
  const { groupId, userId } = req.params;

  const group = await Group.findById(groupId);
  if (!group.admins.map(String).includes(req.user._id.toString())) {
    return res.status(403).json({ message: "Only admins can remove users" });
  }

  group.members = group.members.filter((m) => m.toString() !== userId);
  group.admins = group.admins.filter((a) => a.toString() !== userId);
  await group.save();

  res.status(200).json({ success: true });
};

// ✅ Fetch all messages for a specific channel
export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await GroupMessage.find({ channelId });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Failed to fetch channel messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Send a message to a specific channel
export const sendChannelMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const user = await User.findById(senderId);

    const message = await GroupMessage.create({
      senderId,
      channelId,
      text,
      image: imageUrl,
      senderImage: user.image,
    });

    const io = getIO();
    io.to(channelId).emit("newChannelMessage", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("Failed to send channel message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ NEW: Join group via invite link
export const joinGroupByInvite = async (req, res) => {
  const { inviteLink } = req.params;
  const userId = req.user._id;

  const group = await Group.findOne({ inviteLink });
  if (!group) return res.status(404).json({ message: "Invalid invite link" });

  if (!group.members.map(String).includes(userId.toString())) {
    group.members.push(userId);
    await group.save();
  }

  res.status(200).json({ message: "Joined group successfully" });
};
