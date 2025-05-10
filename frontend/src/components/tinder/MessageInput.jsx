import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../../store/tinder/useMessageStore";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({ match }) => {
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const emojiPickerRef = useRef(null);

	const { sendMessage } = useMessageStore();

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (message.trim()) {
			sendMessage(match._id, message);
			setMessage("");
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
				setShowEmojiPicker(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<form onSubmit={handleSendMessage} className='flex relative'>
			<button
				type='button'
				onClick={() => setShowEmojiPicker(!showEmojiPicker)}
				className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none'
			>
				<Smile size={24} />
			</button>

			<input
				type='text'
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className='flex-grow p-3 pl-12 rounded-l-lg border-2 border-red-600 
        bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400'
				placeholder='Type a message...'
			/>

			<button
				type='submit'
				className='bg-red-600 text-white p-3 rounded-r-lg 
        hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400'
			>
				<Send size={24} />
			</button>

			{showEmojiPicker && (
				<div ref={emojiPickerRef} className='absolute bottom-20 left-4 z-50'>
					<EmojiPicker
						onEmojiClick={(emojiObject) => {
							setMessage((prevMessage) => prevMessage + emojiObject.emoji);
						}}
						theme="dark"
					/>
				</div>
			)}
		</form>
	);
};
export default MessageInput;
