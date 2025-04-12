import { Router } from "express";

import { registerAdmin, loginAdmin, refreshAccessToken } from "../controllers/admin.controller.js";

const router = Router();

router.route("/registerAdmin").post(registerAdmin);
router.route("/loginAdmin").post(loginAdmin);

export default router