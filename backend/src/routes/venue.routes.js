import { Router } from "express";
import {  getSimilarVenues, registerVenue, approveVenueByAdmin, verifyVenue, getAllVenues,  bookVenue, getPendingVenues, rejectVenue } from "../controllers/venue.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/registerVenue").post(verifyJWT, registerVenue);
router.route("/approveVenueByAdmin").post(verifyJWT, approveVenueByAdmin);
router.route("/rejectVenue").post(verifyJWT, rejectVenue);
router.route("/verifyVenue").post(verifyJWT, verifyVenue);
router.route("/getAllVenues").get(verifyJWT, getAllVenues);
router.route("/getPendingVenues").get(verifyJWT, getPendingVenues);
router.route("/bookVenue").post(verifyJWT, bookVenue);
router.route("/getSimilarVenues").get(verifyJWT, getSimilarVenues);

export default router;

