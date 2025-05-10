import express from "express";
import { protectRoute } from "../../middleware/protectRoute.js";
import {
  createGroup,
  getGroups,
  promoteToAdmin,
  createChannel,
  getChannelMessages,
  sendChannelMessage,
  joinGroupByInvite, // 💥 NEW
} from "../../controllers/community/group.controller.js";

const router = express.Router();

router.get("/", protectRoute, getGroups);
router.post("/", protectRoute, createGroup);
router.post("/:groupId/channels", protectRoute, createChannel);
router.post("/:groupId/promote", protectRoute, promoteToAdmin);

router.get("/messages/:channelId", protectRoute, getChannelMessages);
router.post("/messages/:channelId", protectRoute, sendChannelMessage);

// 💥 NEW: Join group using invite link
router.post("/join/:inviteLink", protectRoute, joinGroupByInvite);

export default router;
