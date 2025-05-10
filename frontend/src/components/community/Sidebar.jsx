import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/netflix/authUser";
import { useChatStore } from "../../store/community/useChatStore";
import { useMatchStore } from "../../store/tinder/useMatchStore";
import { useGroupStore } from "../../store/community/useGroupStore";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const { onlineUsers } = useAuthStore();
  const { users, getUsers, setSelectedUser, selectedUser } = useChatStore();
  const {
    groups,
    getGroups,
    setSelectedGroup,
    selectedGroup,
    setSelectedChannel,
    selectedChannel,
  } = useGroupStore();
  const { matches, getMyMatches } = useMatchStore();

  useEffect(() => {
    getUsers();
    getMyMatches();
    getGroups();
  }, []);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100">
      {/* Toggle Header */}
      <div className="border-b border-base-300 w-full flex">
        <button
          className={`w-1/2 text-center p-3 font-medium ${
            activeTab === "matches" ? "bg-base-300" : ""
          }`}
          onClick={() => setActiveTab("matches")}
        >
          New Matches
        </button>
        <button
          className={`w-1/2 text-center p-3 font-medium ${
            activeTab === "chats" ? "bg-base-300" : ""
          }`}
          onClick={() => setActiveTab("chats")}
        >
          Chats
        </button>
      </div>

      {/* Create Group */}
      {activeTab === "chats" && (
        <div className="p-3 border-b border-base-300">
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="btn btn-primary btn-sm w-full"
          >
            + Create Group
          </button>
        </div>
      )}

      {/* Content Section */}
      <div className="overflow-y-auto w-full py-3 px-2 space-y-2">
        {/* Matches View */}
        {activeTab === "matches" &&
          (matches.length > 0 ? (
            matches.map((match) => (
              <div
                key={match._id}
                className="flex items-center gap-3 p-2 rounded hover:bg-base-200 transition-colors cursor-pointer"
              >
                <img
                  src={match.image || "/avatar.png"}
                  alt={match.name}
                  className="size-10 rounded-full object-cover"
                />
                <div className="hidden lg:block">
                  <div className="font-medium">{match.name}</div>
                  <div className="text-xs text-zinc-400">Matched</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-zinc-500">No new matches</div>
          ))}

        {/* Chats View */}
        {activeTab === "chats" && (
          <>
            {/* GROUPS */}
            {groups.map((group) => (
              <div key={group._id}>
                {/* Group name */}
                <button
                  onClick={() => {
                    setSelectedGroup(group);
                    setSelectedUser(null); // clear DM
                  }}
                  className={`w-full p-2 flex items-center gap-3 rounded hover:bg-base-200 transition-colors ${
                    selectedGroup?._id === group._id ? "bg-base-300" : ""
                  }`}
                >
                  <img
                    src={group.image || "/group-placeholder.png"}
                    alt={group.name}
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="hidden lg:block text-left">
                    <div className="font-semibold"># {group.name}</div>
                    <div className="text-xs text-zinc-400">Group Chat</div>
                  </div>
                </button>

                {/* Channels */}
                {selectedGroup?._id === group._id && group.channels?.length > 0 && (
                  <div className="ml-8 mt-2 space-y-1">
                    {group.channels.map((channel) => (
                      <button
                        key={channel._id}
                        onClick={() => {
                          setSelectedChannel(channel);
                          setSelectedUser(null); // clear DM
                        }}
                        className={`w-full text-left text-sm p-1 rounded hover:bg-base-200 transition-colors ${
                          selectedChannel?._id === channel._id
                            ? "bg-base-300 font-semibold"
                            : ""
                        }`}
                      >
                        # {channel.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* DIRECT MESSAGES */}
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedGroup(null);  // clear group
                  setSelectedChannel(null); // clear channel
                }}
                className={`w-full p-2 flex items-center gap-3 rounded hover:bg-base-200 transition-colors ${
                  selectedUser?._id === user._id ? "bg-base-300" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={user.image || "/avatar.png"}
                    alt={user.name}
                    className="size-10 rounded-full object-cover"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))}

            {groups.length === 0 && users.length === 0 && (
              <div className="text-center text-zinc-500">No chats yet</div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal onClose={() => setShowCreateGroupModal(false)} />
      )}
    </aside>
  );
};

export default Sidebar;
