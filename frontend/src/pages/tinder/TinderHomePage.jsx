import { useEffect } from "react";
import Sidebar from "../../components/tinder/Sidebar";
import Navbar from "../../components/shared/Navbar";

import { useMatchStore } from "../../store/tinder/useMatchStore";
import { Frown } from "lucide-react";

import SwipeArea from "../../components/tinder/SwipeArea";
import SwipeFeedback from "../../components/tinder/SwipeFeedback";
import { useAuthStore } from "../../store/netflix/authUser";

const TinderHomePage = () => {
	const { isLoadingUserProfiles, getUserProfiles, userProfiles, subscribeToNewMatches, unsubscribeFromNewMatches } =
		useMatchStore();

	const { user } = useAuthStore();

	useEffect(() => {
		getUserProfiles();
	}, [getUserProfiles]);

	useEffect(() => {
		user && subscribeToNewMatches();

		return () => {
			unsubscribeFromNewMatches();
		};
	}, [subscribeToNewMatches, unsubscribeFromNewMatches, user]);

	return (
		<div
			className='flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white overflow-hidden'
		>
			<div className='flex-grow flex flex-col overflow-hidden'>
				<Navbar />
				<main className='flex-grow flex flex-col gap-10 justify-center items-center p-4 relative overflow-hidden'>
					{userProfiles.length > 0 && !isLoadingUserProfiles && (
						<>
							<SwipeArea />
							<SwipeFeedback />
						</>
					)}

					{userProfiles.length === 0 && !isLoadingUserProfiles && <NoMoreProfiles />}

					{isLoadingUserProfiles && <LoadingUI />}
				</main>
			</div>
		</div>
	);
};
export default TinderHomePage;

const NoMoreProfiles = () => (
	<div className='flex flex-col items-center justify-center h-full text-center p-8'>
		<Frown className='text-red-500 mb-6' size={80} />
		<h2 className='text-3xl font-bold text-white mb-4'>Woah there, speedy fingers!</h2>
		<p className='text-xl text-gray-400 mb-6'>Bro are you OK? Maybe it&apos;s time to touch some grass.</p>
	</div>
);

const LoadingUI = () => {
	return (
		<div className='relative w-full max-w-sm h-[28rem]'>
			<div className='card bg-gray-800 w-96 h-[28rem] rounded-lg overflow-hidden border border-gray-700 shadow-md'>
				<div className='px-4 pt-4 h-3/4'>
					<div className='w-full h-full bg-gray-700 rounded-lg' />
				</div>
				<div className='card-body bg-gradient-to-b from-gray-800 to-gray-900 p-4'>
					<div className='space-y-2'>
						<div className='h-6 bg-gray-600 rounded w-3/4' />
						<div className='h-4 bg-gray-600 rounded w-1/2' />
					</div>
				</div>
			</div>
		</div>
	);
};