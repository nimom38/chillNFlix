import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/netflix/authUser";
import { useGroupStore } from "../../store/community/useGroupStore";
import { useChatStore } from "../../store/community/useChatStore";
import { formatMessageTime } from "../../lib/community/utils";
import { getSocket, joinChannel, leaveChannel } from "../../socket/tinder/socket.client.js";
import MessageInput from "./MessageInput";

const generateBoilerplateChats = (myUserId) => {
  const avatars = ["/avatar1.png", "/avatar2.png", "/avatar3.png", "/avatar4.png"];
  const usernames = ["alice", "bob", "charlie", "dave", "eve", "frank", "grace", "heidi", "ivan", "judy", "mallory", "nia", "oscar", "peggy", "quinn", "ruth", "sybil", "trent", "victor", "wendy"];
  const movieQuotes = [
    "Just watched Inception again. Still mind-blowing!",
    "Who else cried during Up? 😭",
    "I can't wait for Dune: Part Two!",
    "Nothing beats The Godfather.",
    "Spider-Man: No Way Home was epic!",
    "I’m a sucker for Studio Ghibli films.",
    "What’s your all-time favorite rom-com?",
    "I rewatched The Dark Knight last night.",
    "Leo deserved the Oscar way before Revenant.",
    "Anyone here seen Parasite? Incredible film.",
    "The Lord of the Rings trilogy is perfection.",
    "I’m bingeing all the Marvel movies in order.",
    "What underrated movies should I watch?",
    "I love classic Hitchcock thrillers.",
    "Star Wars marathon this weekend! Who's in?",
    "Can’t believe how good Everything Everywhere All at Once was.",
    "Which movie had the best soundtrack ever?",
    "Rewatched Interstellar. Nolan is a genius.",
    "I miss going to midnight premieres.",
    "Who else thinks The Matrix changed cinema forever?"
  ];

  const boilerplateChats = [];

  for (let i = 0; i < 20; i++) {
    const chat = [];
    for (let j = 0; j < 50; j++) {
      const isMe = Math.random() < 0.1; // occasionally insert my message
      const senderId = isMe ? myUserId : usernames[Math.floor(Math.random() * usernames.length)];
      const senderImage = isMe ? "/avatar.png" : avatars[Math.floor(Math.random() * avatars.length)];
      const randomUserQuote = movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
      const randomUserComment = [
        "That’s a great pick!",
        "I totally agree!",
        "Wow, I need to watch that soon.",
        "Such an underrated gem.",
        "What a classic!",
        "I didn’t like it much, to be honest.",
        "One of my all-time favorites.",
        "I binged that whole series last weekend!",
        "Absolute masterpiece.",
        "I’ve watched it at least 10 times."
      ];
      const text = isMe
        ? randomUserComment[Math.floor(Math.random() * randomUserComment.length)]
        : randomUserQuote;

      chat.push({
        _id: `msg_${i}_${j}`,
        senderId,
        senderImage,
        text,
        createdAt: new Date(Date.now() - ((i * 50 + j) * 60000)).toISOString(),
      });
    }
    boilerplateChats.push(chat);
  }
  return boilerplateChats;
};

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

  const boilerplateChats = generateBoilerplateChats(user._id);
  const randomChat = boilerplateChats[Math.floor(Math.random() * boilerplateChats.length)];

  const boilerplateMessages = [
    {
      _id: "msg1",
      senderId: "user123",
      senderImage: "/avatar.png",
      text: "Hey everyone! Welcome to the group chat!",
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      _id: "msg2",
      senderId: "user456",
      senderImage: "/avatar.png",
      text: "Hi! Glad to be here!",
      createdAt: new Date(Date.now() - 3400000).toISOString(), // ~57 min ago
    },
    {
      _id: "msg3",
      senderId: "user789",
      senderImage: "/avatar.png",
      text: "Let's get the conversation started!",
      createdAt: new Date(Date.now() - 3200000).toISOString(), // ~53 min ago
    },
  ];

  console.log("dmMessages", dmMessages);

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
  const activeMessages = isGroupChat
    ? [...randomChat, ...groupMessages]
    : dmMessages;

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
