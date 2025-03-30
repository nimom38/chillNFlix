import express from "express";
import { authCheck, login, logout, signup } from "../../controllers/netflix/auth.controller.js";
import { updateProfile } from "../../controllers/tinder/userController.js"
import { protectRoute } from "../../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/authCheck", protectRoute, authCheck);

export default router;
