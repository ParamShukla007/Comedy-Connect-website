import { Router } from "express";
import { registerArtist, loginArtist, viewArtist, getOneArtist, getAllArtist, updateArtistDetails} from "../controllers/artist.controller.js";

const router = Router();

router.route("/updateArtistDetails").post(updateArtistDetails);

router.route("/registerArtist").post(registerArtist);

router.route("/loginArtist").post(loginArtist);

router.route("/getArtist").get(getAllArtist);

router.route("/getOneArtist")
  .get(getOneArtist)
  .post(getOneArtist);  // Allow both GET and POST

router.route("/viewArtist").get(viewArtist);

export default router