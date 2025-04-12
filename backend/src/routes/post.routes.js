import { Router } from "express";
import { getFollowedArtistsPosts, commentOnPost, likePost, createPost, getPosts } from "../controllers/post.controller.js";

const router = Router();

router.route("/createPost").post(createPost);
router.route("/getPost").get(getPosts);
router.route("/likePost").post(likePost);
router.route("/commentOnPost").post(commentOnPost);
router.route("/getFollowedArtistsPosts").get(getFollowedArtistsPosts);

export default router