require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoutes");
const passport = require("passport");
const User = require("./models/user");
const todoRouter = require("./routes/todo");
const cors = require("cors");
const methodOverride = require("method-override");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // allow frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // allow headers
    credentials: true, 
}));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Passport Strategy
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) return done(null, user);
        return done(null, false);
    } catch (err) {
        return done(err, false);
    }
}));

app.use(passport.initialize());

// Routes
app.get("/", (req, res) => {
    res.redirect("/dashboard");
});

app.use("/auth", authRouter); // Auth routes should return JWT on login/signup
app.use("/dashboard", passport.authenticate('jwt', { session: false }), todoRouter);

// DB Connection
const port = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

async function start() {
    try {
        await mongoose.connect(DB_URL);
        console.log("DB connected successfully");
        app.listen(port, () => {
            console.log("Server is listening on port", port);
        });
    } catch (err) {
        console.log(err);
    }
}

start();
