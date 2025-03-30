import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import NetflixHomePage from "./pages/netflix/home/NetflixHomePage";
import NetflixLoginPage from "./pages/netflix/NetflixLoginPage";
import NetflixSignUpPage from "./pages/netflix/NetflixSignUpPage";
import NetflixWatchPage from "./pages/netflix/WatchPage";
import Footer from "./components/netflix/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/netflix/authUser";
import { useThemeStore } from "./store/community/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import SearchPage from "./pages/netflix/SearchPage";
import SearchHistoryPage from "./pages/netflix/SearchHistoryPage";
import NotFoundPage from "./pages/netflix/404";
import TinderHomePage from "./pages/tinder/TinderHomePage";
import TinderProfilePage from "./pages/tinder/TinderProfilePage";
import TinderChatPage from "./pages/tinder/ChatPage";
import CommunityHomePage from "./pages/community/CommunityHomePage";
import CommunitySettingsPage from "./pages/community/CommunitySettingsPage";
import CommunityProfilePage from "./pages/community/CommunityProfilePage";
import Navbar from "./components/community/Navbar";

const CommunityLayout = () => {
	const { theme } = useThemeStore();
	return (
	  <div data-theme={theme}>
		<Navbar />
		<Outlet />
		<Toaster />
	  </div>
	);
};
  
const TinderLayout = () => (
	<div className='absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]'>
		<Outlet />
		<Toaster />
	</div>
);

const NetflixLayout = () => (
	<>
		<Outlet />
		<Footer />
		<Toaster />
	</>
);

function App() {
	const { user, isCheckingAuth, authCheck, onlineUsers } = useAuthStore();

	console.log({ onlineUsers });

	useEffect(() => {
		authCheck();
	}, [authCheck]);

	console.log({ user });

	if (isCheckingAuth) {
		return (
			<div className='h-screen'>
				<div className='flex justify-center items-center bg-black h-full'>
					<Loader className='animate-spin text-red-600 size-10' />
				</div>
			</div>
		);
	}

	return (
		<>
			<Routes>
				<Route element={<NetflixLayout />}>
					<Route path='/' element={<NetflixHomePage />} />
					<Route path='/login' element={!user ? <NetflixLoginPage /> : <Navigate to="/" />} />
					<Route path='/signup' element={!user ? <NetflixSignUpPage /> : <Navigate to="/" />} />
					<Route path='/netflix/watch/:id' element={user ? <NetflixWatchPage /> : <Navigate to="/login" />} />
					<Route path='/netflix/search' element={user ? <SearchPage /> : <Navigate to="/login" />} />
					<Route path='/netflix/history' element={user ? <SearchHistoryPage /> : <Navigate to="/login" />} />
				</Route>

				<Route path="/community" element={user ? <CommunityLayout /> : <Navigate to="/login" />}>
					<Route index element={<CommunityHomePage />} />
					<Route path="settings" element={<CommunitySettingsPage />} />
					<Route path="profile" element={<CommunityProfilePage />} />
				</Route>

				<Route path="/tinder" element={user ? <TinderLayout /> : <Navigate to="/login" />}>
					<Route index element={<TinderHomePage />} />
					<Route path="profile" element={<TinderProfilePage />} />
					<Route path="chat/:id" element={<TinderChatPage />} />
				</Route>

				<Route path='/*' element={<NotFoundPage />} />
			</Routes>
		</>
	);
}

export default App;
