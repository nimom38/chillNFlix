// ✅ New (ES Module)

dotenv.config();

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http";

import authRoutes from "./routes/netflix/auth.route.js";
import movieRoutes from "./routes/netflix/movie.route.js";
import tvRoutes from "./routes/netflix/tv.route.js";
import searchRoutes from "./routes/netflix/search.route.js";
import userRoutes from "./routes/tinder/userRoutes.js";
import matchRoutes from "./routes/tinder/matchRoutes.js";
import messageRoutes from "./routes/tinder/messageRoutes.js";

import communityMessageRoutes from "./routes/community/communityMessage.route.js";
import communityGroupRoutes from "./routes/community/group.route.js";

import { ENV_VARS } from "./config/netflix/envVars.js";
import { connectDB } from "./config/netflix/db.js";
import { protectRoute } from "./middleware/protectRoute.js";
import { initializeSocket } from "./socket/tinder/socket.server.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = ENV_VARS.PORT || 5000;
const __dirname = path.resolve();

initializeSocket(httpServer);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());
// app.use(
// 	cors({
// 		origin: process.env.CLIENT_URL,
// 		credentials: true,
// 	})
// );
const allowedOrigins = [
    process.env.CLIENT_URL,                    // vite local
    'https://chill-n-flix.vercel.app'           // production frontend
];

// app.use(cors({
//     origin: allowedOrigins,
//     credentials: true
// }));

app.use(cors());


// app.use(cors());

app.use("/api/v1/netflix/auth", authRoutes);
app.use("/api/v1/netflix/movie", protectRoute, movieRoutes);
app.use("/api/v1/netflix/tv", protectRoute, tvRoutes);
app.use("/api/v1/netflix/search", protectRoute, searchRoutes);

app.use("/api/tinder/users", userRoutes);
app.use("/api/tinder/matches", matchRoutes);
app.use("/api/tinder/messages", messageRoutes);

app.use("/api/community/messages", communityMessageRoutes);
app.use("/api/community/groups", protectRoute, communityGroupRoutes);

if (ENV_VARS.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

httpServer.listen(PORT, () => {
	console.log("Server started at http://localhost:" + PORT);
	connectDB();
});
