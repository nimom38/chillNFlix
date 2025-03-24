import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/netflix/authUser";

const NetflixSignUpPage = () => {
	const { searchParams } = new URL(document.location);
	const emailValue = searchParams.get("email");

	const [email, setEmail] = useState(emailValue || "");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [age, setAge] = useState("");  // Will be converted to Number on submission
	const [gender, setGender] = useState("");
	const [genderPreference, setGenderPreference] = useState("");

	const { signup, isSigningUp } = useAuthStore();

	const handleSignUp = (e) => {
		e.preventDefault();
		signup({ 
			email, 
			name, 
			password, 
			age: Number(age),  // Convert string input to Number type 
			gender, 
			genderPreference 
		});
	};

	return (
		<div className='h-screen w-full hero-bg'>
			<header className='max-w-6xl mx-auto flex items-center justify-between p-4'>
				<Link to={"/"}>
					<img src='/netflix-logo.png' alt='logo' className='w-52' />
				</Link>
			</header>

			<div className='flex justify-center items-center mt-20 mx-3'>
				<div className='w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md'>
					<h1 className='text-center text-white text-2xl font-bold mb-4'>Sign Up</h1>

					<form className='space-y-4' onSubmit={handleSignUp}>
						<div>
							<label htmlFor='email' className='text-sm font-medium text-gray-300 block'>
								Email
							</label>
							<input
								type='email'
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
								placeholder='you@example.com'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div>
							<label htmlFor='name' className='text-sm font-medium text-gray-300 block'>
								Name
							</label>
							<input
								type='text'
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
								placeholder='johndoe'
								id='name'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

						<div>
							<label htmlFor='age' className='text-sm font-medium text-gray-300 block'>
								Age
							</label>
							<input
								type='number'
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
								placeholder='25'
								id='age'
								value={age}
								onChange={(e) => setAge(e.target.value)}
								min="18"
							/>
						</div>

						<div>
							<label htmlFor='gender' className='text-sm font-medium text-gray-300 block'>
								Gender
							</label>
							<select
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-black text-white focus:outline-none focus:ring'
								id='gender'
								value={gender}
								onChange={(e) => setGender(e.target.value)}
							>
								<option value="" disabled>Select your gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						</div>

						<div>
							<label htmlFor='genderPreference' className='text-sm font-medium text-gray-300 block'>
								Gender Preference
							</label>
							<select
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-black text-white focus:outline-none focus:ring'
								id='genderPreference'
								value={genderPreference}
								onChange={(e) => setGenderPreference(e.target.value)}
							>
								<option value="" disabled>Select your preference</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="both">Both</option>
							</select>
						</div>

						<div>
							<label htmlFor='password' className='text-sm font-medium text-gray-300 block'>
								Password
							</label>
							<input
								type='password'
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
								placeholder='••••••••'
								id='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<button
							className='w-full py-2 bg-red-600 text-white font-semibold rounded-md
							hover:bg-red-700
						'
							disabled={isSigningUp}
						>
							{isSigningUp ? "Loading..." : "Sign Up"}
						</button>
					</form>
					<div className='text-center text-gray-400'>
						Already a member?{" "}
						<Link to={"/login"} className='text-red-500 hover:underline'>
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default NetflixSignUpPage;