import TinderCard from "react-tinder-card";
import { useMatchStore } from "../../store/tinder/useMatchStore";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SwipeArea = () => {
	const { userProfiles, swipeRight, swipeLeft } = useMatchStore();

	const handleSwipe = (dir, user) => {
		if (dir === "right") swipeRight(user);
		else if (dir === "left") swipeLeft(user);
	};

	return (
		<div className="relative w-full max-w-sm h-[28rem] mx-auto">
			{/* 🔥 Swipe Left Hint */}
			<div className="absolute -left-20 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center text-gray-400 animate-fadeIn">
				<ArrowLeft size={32} className="mb-1 animate-bounceLeft" />
				<span className="text-sm rotate-[-15deg]">Skip</span>
			</div>

			{/* 🔥 Swipe Right Hint */}
			<div className="absolute -right-20 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center text-gray-400 animate-fadeIn">
				<ArrowRight size={32} className="mb-1 animate-bounceRight" />
				<span className="text-sm rotate-[15deg]">Match</span>
			</div>

			{userProfiles.map((user) => (
				<TinderCard
					className="absolute shadow-none"
					key={user._id}
					onSwipe={(dir) => handleSwipe(dir, user)}
					swipeRequirementType="position"
					swipeThreshold={100}
					preventSwipe={["up", "down"]}
				>
					<div
						className="card bg-white w-96 h-[28rem] select-none rounded-lg overflow-hidden border border-gray-200"
					>
						<figure className="px-4 pt-4 h-3/4">
							<img
								src={user.image || "/avatar.png"}
								alt={user.name}
								className="rounded-lg object-cover h-full pointer-events-none"
							/>
						</figure>
						<div className="card-body bg-gradient-to-b from-white to-pink-50">
							<h2 className="card-title text-2xl text-gray-800">
								{user.name}, {user.age}
							</h2>
							<p className="text-gray-600">{user.bio}</p>
						</div>
					</div>
				</TinderCard>
			))}
		</div>
	);
};

export default SwipeArea;
