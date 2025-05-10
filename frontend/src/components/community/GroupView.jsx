import { useAuthStore } from "../../store/netflix/authUser";
import { useGroupStore } from "../../store/community/useGroupStore";
import { useState, useEffect } from "react";
import { Plus, Crown, Trash2 } from "lucide-react";
import { socket } from "backend/socket/community/socket.js"; 

const GroupView = () => {
  const { user } = useAuthStore();
  const {
    selectedGroup,
    selectedChannel,
    setSelectedChannel,
    promoteToAdmin,
    removeMember,
    createChannel,
  } = useGroupStore();

  const [newChannelName, setNewChannelName] = useState("");
  const [showNewChannelInput, setShowNewChannelInput] = useState(false);

  const isAdmin = selectedGroup.admins.includes(user._id);

  // ✅ Auto-select general channel on load
  useEffect(() => {
    if (
      selectedGroup &&
      selectedGroup.channels.length > 0 &&
      !selectedChannel
    ) {
      const general = selectedGroup.channels.find(
        (c) => c.name === "general"
      );
      setSelectedChannel(general || selectedGroup.channels[0]);
    }
  }, [selectedGroup, selectedChannel, setSelectedChannel]);

  // ✅ Join/Leave channel socket room
  useEffect(() => {
    if (!selectedChannel?._id) return;

    socket.emit("joinChannel", selectedChannel._id);

    return () => {
      socket.emit("leaveChannel", selectedChannel._id);
    };
  }, [selectedChannel]);

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    createChannel(selectedGroup._id, newChannelName);
    setNewChannelName("");
    setShowNewChannelInput(false);
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto">
      {/* Group Info */}
      <div className="flex items-center gap-3">
        <img
          src={selectedGroup.image || "/group-placeholder.png"}
          className="w-12 h-12 rounded-full object-cover"
          alt="group"
        />
        <h2 className="text-xl font-bold">{selectedGroup.name}</h2>
      </div>

      {/* Channels */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Channels</h3>
          {isAdmin && (
            <button onClick={() => setShowNewChannelInput((prev) => !prev)}>
              <Plus size={20} />
            </button>
          )}
        </div>

        {showNewChannelInput && (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="Channel name"
              className="input input-sm input-bordered w-full"
            />
            <button
              onClick={handleCreateChannel}
              className="btn btn-sm btn-primary"
            >
              Create
            </button>
          </div>
        )}

        <ul className="space-y-1">
          {selectedGroup.channels.map((channel) => (
            <li
              key={channel._id}
              className={`p-2 rounded cursor-pointer hover:bg-base-300 ${
                selectedChannel?._id === channel._id
                  ? "bg-base-300 font-semibold"
                  : ""
              }`}
              onClick={() => setSelectedChannel(channel)}
            >
              # {channel.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Members */}
      <div>
        <h3 className="font-semibold mb-2">Members</h3>
        <ul className="space-y-2">
          {selectedGroup.members.map((member) => (
            <li
              key={member._id}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <img
                  src={member.image || "/avatar.png"}
                  className="w-8 h-8 rounded-full"
                  alt={member.name}
                />
                <span>{member.name}</span>
                {selectedGroup.admins.includes(member._id) && (
                  <Crown className="text-yellow-400" size={16} />
                )}
              </div>
              {isAdmin && user._id !== member._id && (
                <div className="flex gap-2">
                  {!selectedGroup.admins.includes(member._id) && (
                    <button
                      onClick={() =>
                        promoteToAdmin(selectedGroup._id, member._id)
                      }
                    >
                      <Crown size={16} className="text-yellow-500" />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      removeMember(selectedGroup._id, member._id)
                    }
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupView;
