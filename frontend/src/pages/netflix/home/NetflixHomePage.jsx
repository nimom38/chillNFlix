import { useAuthStore } from "../../../store/netflix/authUser";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";

const NetflixHomePage = () => {
	const { user } = useAuthStore();

	return <>{user ? <HomeScreen /> : <AuthScreen />}</>;
};
export default NetflixHomePage;
