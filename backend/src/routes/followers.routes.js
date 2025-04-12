import { Router } from "express";
import { followArtist, getFollowers, getFollowing, unfollowArtist } from "../controllers/followers.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/follow-artist").post(followArtist);

router.route("/unfollow-artist").post(unfollowArtist);

router.route("/get-followers").get(getFollowers);

router.route("/get-followings").get(getFollowing);

export default router