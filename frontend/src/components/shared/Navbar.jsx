import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, Search } from "lucide-react";
import { useAuthStore } from "../../store/netflix/authUser";
import { useContentStore } from "../../store/netflix/content";

const Navbar = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user, logout } = useAuthStore();

	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	const { setContentType } = useContentStore();

	return (
		<header className='max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20'>
			<div className='flex items-center gap-10 z-50'>
				<Link to='/'>
					{/* <img src='/ChillNFlixLogo.png' alt='Netflix Logo' className='w-32 sm:w-40' /> */}
					<img src='/chill-logo.png' alt='Netflix Logo' className='w-32 sm:w-40' />
				</Link>

				{/* desktop navbar items */}
				<div className='hidden sm:flex gap-2 items-center'>
					<Link to='/' className='hover:underline' onClick={() => setContentType("movie")}>
						Movies
					</Link>
					<Link to='/' className='hover:underline' onClick={() => setContentType("tv")}>
						Tv Shows
					</Link>
					<Link to='/netflix/history' className='hover:underline'>
						Search History
					</Link>
					<Link to='/tinder' className='hover:underline'>Match Making</Link>
					<Link to='/community' className='hover:underline'>Community</Link>
					<Link to='/aichatbot' className='hover:underline'>AI Companion</Link>
				</div>
			</div>

			<div className='flex gap-2 items-center z-50'>
				<Link to={"/netflix/search"}>
					<Search className='size-6 cursor-pointer' />
				</Link>
				
                <Link to='/community/profile'>
                <img
                src={user.image} alt='Avatar'className='h-8 w-8 rounded-full cursor-pointer border-2 border-red-600'/>
                </Link>
				<LogOut className='size-6 cursor-pointer' onClick={logout} />
				<div className='sm:hidden'>
					<Menu className='size-6 cursor-pointer' onClick={toggleMobileMenu} />
				</div>
			</div>

			{/* mobile navbar items */}
			{isMobileMenuOpen && (
				<div className='w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800'>
					<Link to={"/"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
						Movies
					</Link>
					<Link to={"/"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
						Tv Shows
					</Link>
					<Link to={"/netflix/history"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
						Search History
					</Link>
				</div>
			)}
		</header>
	);
};
export default Navbar;
