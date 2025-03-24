import { Navigate, Route, Routes } from "react-router-dom";
import NetflixHomePage from "./pages/netflix/home/NetflixHomePage";
import NetflixLoginPage from "./pages/netflix/NetflixLoginPage";
import NetflixSignUpPage from "./pages/netflix/NetflixSignUpPage";
import NetflixWatchPage from "./pages/netflix/WatchPage";
import Footer from "./components/netflix/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/netflix/authUser";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import SearchPage from "./pages/netflix/SearchPage";
import SearchHistoryPage from "./pages/netflix/SearchHistoryPage";
import NotFoundPage from "./pages/netflix/404";
import TinderHomePage from "./pages/tinder/TinderHomePage";
import TinderProfilePage from "./pages/tinder/TinderProfilePage";
import TinderChatPage from "./pages/tinder/ChatPage";

function App() {
	const { user, isCheckingAuth, authCheck } = useAuthStore();

	useEffect(() => {
		authCheck();
	}, [authCheck]);

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
				<Route path='/' element={<NetflixHomePage />} />

				<Route path='/tinder' element={user ? <TinderHomePage /> : <Navigate to={"/login"} />} />
				<Route path='/tinder/profile' element={user ? <TinderProfilePage /> : <Navigate to={"/login"} />} />
				<Route path='/tinder/chat/:id' element={user ? <TinderChatPage /> : <Navigate to={"/login"} />} />

				<Route path='/login' element={!user ? <NetflixLoginPage /> : <Navigate to={"/"} />} />
				<Route path='/signup' element={!user ? <NetflixSignUpPage /> : <Navigate to={"/"} />} />
				<Route path='/netflix/watch/:id' element={user ? <NetflixWatchPage /> : <Navigate to={"/login"} />} />
				<Route path='/netflix/search' element={user ? <SearchPage /> : <Navigate to={"/login"} />} />
				<Route path='/netflix/history' element={user ? <SearchHistoryPage /> : <Navigate to={"/login"} />} />
				<Route path='/*' element={<NotFoundPage />} />
			</Routes>
			<Footer />

			<Toaster />
		</>
	);
}

export default App;
