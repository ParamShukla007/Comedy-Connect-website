import { Router } from "express";
import {
  registerVenueManager,
  loginVenueManager,
  logoutVenueManager,
  getCurrentVenueManager,
  updateVenueManagerDetails,
} from "../controllers/venueManager.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerVenueManager);

router.route("/login").post(loginVenueManager);

// secured routes
router.route("/logout").post(verifyJWT, logoutVenueManager);

router.route("/current-user").get(verifyJWT, getCurrentVenueManager);

router.route("/update-details").patch(verifyJWT, updateVenueManagerDetails);

export default router;
