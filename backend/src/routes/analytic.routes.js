import { Router } from "express";

import { getDashboardStats } from "../controllers/analytics.controllers.js";

const router = Router();

router.route("/getDashboardStats").get(getDashboardStats);

export default router