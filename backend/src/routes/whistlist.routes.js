import { Router } from "express";
import { createWishlist, getAllWishlists } from "../controllers/wishlist.controller.js";
const router = Router();

router.route("/createWishlist").post(createWishlist);
router.route("/getAllWishlists").post(getAllWishlists);

export default router