import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/netflix/authUser";
import { useGroupStore } from "../../store/community/useGroupStore";
import { useChatStore } from "../../store/community/useChatStore";
import { formatMessageTime } from "../../lib/community/utils";
import { getSocket, joinChannel, leaveChannel } from "../../socket/tinder/socket.client.js";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const messageEndRef = useRef(null);
  const { user } = useAuthStore();

  const {
    selectedGroup,
    selectedChannel,
    messages: groupMessages,
    setMessages,
    fetchMessagesForChannel,
  } = useGroupStore();

  const {
    selectedUser,
    messages: dmMessages,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  // Group Channel Messages
  useEffect(() => {
    if (!selectedChannel?._id) return;

    const socket = getSocket();
    joinChannel(selectedChannel._id);
    fetchMessagesForChannel(selectedChannel._id);

    socket.on("newChannelMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      leaveChannel(selectedChannel._id);
      socket.off("newChannelMessage");
    };
  }, [selectedChannel?._id]);

  // Direct Messages
  useEffect(() => {
    if (!selectedUser) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages, dmMessages]);

  // Choose data source based on view
  const isGroupChat = !!selectedGroup && !!selectedChannel;
  const activeMessages = isGroupChat ? groupMessages : dmMessages;

  console.log({
    isGroupChat,
    selectedUser,
    selectedGroup,
    selectedChannel,
    activeMessages,
    dmMessages,
    groupMessages,
});


  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(activeMessages) ? (
          activeMessages.map((message, index) => (
            <div
  key={`${message._id || message.createdAt || index}`}
  className={`chat ${
    (message.senderId?._id || message.senderId) === user._id ? "chat-end" : "chat-start"
  }`}
  ref={index === activeMessages.length - 1 ? messageEndRef : null}
>
  <div className="chat-image avatar">
    <div className="size-10 rounded-full border">
      <img
        src={
          // ✅ If I sent the message → use MY avatar
          (message.senderId?._id || message.senderId) === user._id
            ? (user.image || "/avatar.png")
            : (message.senderImage || "/avatar.png")
        }
        alt="profile pic"
      />
    </div>
  </div>
  <div className="chat-header mb-1">
    <time className="text-xs opacity-50 ml-1">
      {formatMessageTime(message.createdAt)}
    </time>
  </div>

  {/* ✅ Show image cleanly without a bubble */}
  {message.image && (
    <img
      src={message.image}
      alt="Attachment"
      className="sm:max-w-[200px] rounded-md mb-2"
    />
  )}

  {/* ✅ Only wrap the text in the bubble */}
  {message.text && (
    <div
      className={`chat-bubble ${
        (message.senderId?._id || message.senderId) === user._id
          ? 'bg-red-500 text-white'
          : ''
      }`}
    >
      {message.text}
    </div>
  )}
</div>


          ))
        ) : (
          <div className="text-center text-zinc-500 mt-10">No messages found</div>
        )}
      </div>

      {(selectedUser || selectedChannel) && <MessageInput />}
    </div>
  );
};

export default ChatContainer;
