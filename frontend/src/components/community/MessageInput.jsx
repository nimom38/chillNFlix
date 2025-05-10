import { useRef, useState } from "react";
import { useAuthStore } from "../../store/netflix/authUser";
import { useGroupStore } from "../../store/community/useGroupStore";
import { useChatStore } from "../../store/community/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { sendChannelMessage, sendDirectMessage } from "../../socket/tinder/socket.client.js";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { selectedChannel, selectedGroup } = useGroupStore();
  const { selectedUser } = useChatStore();
  const { user } = useAuthStore();

  const isDM = !!selectedUser;
  const isGroupChannel = !!selectedGroup && !!selectedChannel;

  if (!isDM && !isGroupChannel) {
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    // ✅ Group Chat
    if (isGroupChannel) {
      const message = {
        text: text.trim(),
        image: imagePreview,
        senderId: user._id,
        senderImage: user.image,
        createdAt: new Date().toISOString(),
      };

      sendChannelMessage(selectedChannel._id, message);

      // ✅ Immediately add to group chat state
      const { messages } = useGroupStore.getState();
      useGroupStore.setState({
        messages: [...messages, message],
      });
    }
    // ✅ Direct Message
    else if (isDM) {
      const { sendMessage } = useChatStore.getState();
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
    } else {
      toast.error("No valid chat selected.");
      return;
    }

    // Clear input after send
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
};


  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
