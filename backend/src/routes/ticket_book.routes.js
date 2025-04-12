import { Router } from "express";
import { bookTickets , getAvailableSeats, getUserTickets, getVenueSeatLayout} from "../controllers/ticket_book.controllers.js";

const router = Router();

router.route("/bookTickets").post(bookTickets);
router.route("/getAvailableSeats").get(getAvailableSeats);
router.route("/getUserTickets").get(getUserTickets);
router.route("/getVenueSeatLayout").get(getVenueSeatLayout);

export default router
