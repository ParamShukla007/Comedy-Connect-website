import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

// import routes
import userRouter from './routes/user.routes.js';
import artistRouter from './routes/artist.routes.js';
import followersRouter from './routes/followers.routes.js';
import venueRouter from './routes/venue.routes.js';
import eventRouter from './routes/event.routes.js';
import venueManagerRouter from './routes/venueManager.routes.js';
import adminRouter from './routes/admin.routes.js'; 
import ticket_bookRouter from './routes/ticket_book.routes.js';
import reviewRouter from './routes/review.routes.js';
import whistlistRouter from './routes/whistlist.routes.js';
import postRouter from './routes/post.routes.js';
import analyticRouter from './routes/analytic.routes.js';

// declare routes
app.use("/api/users", userRouter)
app.use("/api/artists", artistRouter)
app.use("/api/followers", followersRouter)
app.use("/api/venues", venueRouter)
app.use("/api/events", eventRouter)
app.use("/api/venuemanagers", venueManagerRouter)
app.use("/api/admins", adminRouter)
app.use("/api/ticket_book", ticket_bookRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/whistlist", whistlistRouter)
app.use("/api/posts", postRouter)
app.use("/api/analytics", analyticRouter)

export { app }