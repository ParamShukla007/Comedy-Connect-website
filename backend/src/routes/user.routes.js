import { Router } from "express";
import { getOneUser, getAllUsers, changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/getUsers").get(getAllUsers);
 router.route("/getOneUser").post(getOneUser);
// secured routes

router.route("/logout").post(verifyJWT ,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/get-all-users").get( getAllUsers)

router.route("/update-details").patch(verifyJWT, updateAccountDetails)

export default router