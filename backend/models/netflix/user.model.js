import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	// image: {
	// 	type: String,
	// 	default: "",
	// },

	// netflix-only start
	searchHistory: {
		type: Array,
		default: [],
	},
	// netflix-only end

	//tinder-only start
	age: {
		type: Number,
		required: true,
	},
	gender: {
		type: String,
		required: true,
		enum: ["male", "female"],
	},
	genderPreference: {
		type: String,
		required: true,
		enum: ["male", "female", "both"],
	},
	bio: { type: String, default: "" },
	image: { type: String, default: "" },
	likes: [
	  {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	  },
	],
	dislikes: [
	  {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	  },
	],
	matches: [
	  {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	  },
	],
	// tinder-only end
},
{ timestamps: true }
);


// // tinder-only start (I think this is handled in netflix controller itself)
// userSchema.pre("save", async function (next) {
// 	// MAKE SURE TO ADD THIS IF CHECK!!! 👇 I forgot to add this in the tutorial
// 	// only hash if password is modified.
// 	if (!this.isModified("password")) {
// 	  return next();
// 	}
  
// 	this.password = await bcrypt.hash(this.password, 10);
// 	next();
// });
  
// userSchema.methods.matchPassword = async function (enteredPassword) {
// 	return await bcrypt.compare(enteredPassword, this.password);
// };
// // tinder-only end

const User = mongoose.model("User", userSchema);

export default User;
