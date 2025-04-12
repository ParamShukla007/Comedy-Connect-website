import { Router } from "express";

import { getUserReviews, rateArtist, rateVenue, getArtistReviews, getVenueReviews } from "../controllers/review.controllers.js";

const router = Router();

router.route("/rateArtist").post(rateArtist);
router.route("/rateVenue").post(rateVenue);
router.route("/getArtistReviews").get(getArtistReviews);
router.route("/getVenueReviews").get(getVenueReviews);
router.route("/getUserReviews").get(getUserReviews);

export default router