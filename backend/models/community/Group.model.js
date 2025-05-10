import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
    inviteLink: { type: String, unique: true }, 
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
