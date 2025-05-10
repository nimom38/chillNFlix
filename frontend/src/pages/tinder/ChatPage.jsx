import { useEffect } from "react";
import Navbar from "../../components/shared/Navbar";
import { useAuthStore } from "../../store/netflix/authUser";
import { useMatchStore } from "../../store/tinder/useMatchStore";
import { useMessageStore } from "../../store/tinder/useMessageStore";
import { Link, useParams } from "react-router-dom";
import { Loader, UserX } from "lucide-react";
import MessageInput from "../../components/tinder/MessageInput";

const TinderChatPage = () => {
	const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
	const { messages, getMessages, subscribeToMessages, unsubscribeFromMessages } = useMessageStore();
	const { user } = useAuthStore();

	const { id } = useParams();

	const match = matches.find((m) => m?._id === id);

	useEffect(() => {
		if (user && id) {
			getMyMatches();
			getMessages(id);
			subscribeToMessages();
		}

		return () => {
			unsubscribeFromMessages();
		};
	}, [getMyMatches, user, getMessages, subscribeToMessages, unsubscribeFromMessages, id]);

	if (isLoadingMyMatches) return <LoadingMessagesUI />;
	if (!match) return <MatchNotFound />;

	return (
		<div className='flex flex-col h-screen bg-black'>
			<Navbar />

			<div className='flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full'>
				<div className='flex items-center mb-4 bg-gray-800 rounded-lg shadow p-3'>
					<img
						src={match.image || "/avatar.png"}
						className='w-12 h-12 object-cover rounded-full mr-3 border-2 border-red-500'
					/>
					<h2 className='text-xl font-semibold text-white'>{match.name}</h2>
				</div>

				<div className='flex-grow overflow-y-auto mb-4 bg-gray-900 rounded-lg shadow p-4'>
					{messages.length === 0 ? (
						<p className='text-center text-gray-400 py-8'>Start your conversation with {match.name}</p>
					) : (
						messages.map((msg) => (
							<div
								key={msg._id}
								className={`mb-3 ${msg.sender === user._id ? "text-right" : "text-left"}`}
							>
								<span
									className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
										msg.sender === user._id
											? "bg-red-600 text-white"
											: "bg-gray-700 text-white"
									}`}
								>
									{msg.content}
								</span>
							</div>
						))
					)}
				</div>
				<MessageInput match={match} />
			</div>
		</div>
	);
};
export default TinderChatPage;

const MatchNotFound = () => (
	<div className='h-screen flex flex-col items-center justify-center bg-black'>
		<div className='bg-gray-800 p-8 rounded-lg shadow-md text-center'>
			<UserX size={64} className='mx-auto text-red-500 mb-4' />
			<h2 className='text-2xl font-semibold text-white mb-2'>Match Not Found</h2>
			<p className='text-gray-400'>Oops! It seems this match doesn&apos;t exist or has been removed.</p>
			<Link
				to='/'
				className='mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors 
				focus:outline-none focus:ring-2 focus:ring-red-400 inline-block'
			>
				Go Back To Home
			</Link>
		</div>
	</div>
);

const LoadingMessagesUI = () => (
	<div className='h-screen flex flex-col items-center justify-center bg-black'>
		<div className='bg-gray-800 p-8 rounded-lg shadow-md text-center'>
			<Loader size={48} className='mx-auto text-red-500 animate-spin mb-4' />
			<h2 className='text-2xl font-semibold text-white mb-2'>Loading Chat</h2>
			<p className='text-gray-400'>Please wait while we fetch your conversation...</p>
			<div className='mt-6 flex justify-center space-x-2'>
				<div className='w-3 h-3 bg-red-500 rounded-full animate-bounce' style={{ animationDelay: "0s" }}></div>
				<div className='w-3 h-3 bg-red-500 rounded-full animate-bounce' style={{ animationDelay: "0.2s" }}></div>
				<div className='w-3 h-3 bg-red-500 rounded-full animate-bounce' style={{ animationDelay: "0.4s" }}></div>
			</div>
		</div>
	</div>
);
