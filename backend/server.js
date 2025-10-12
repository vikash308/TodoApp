require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoutes")
const passport = require("passport")
const session = require('express-session')
const User = require("./models/user")
const todoRouter = require("./routes/todo")
const cors = require("cors")
const methodOverride = require('method-override')
const bodyParser = require("body-parser");
const app = express();

//      Midllewares
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true
}));
app.use(methodOverride('_method'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    name: "connect.sid",
    secret: process.env.SECRET, // replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",       // must be true if frontend uses HTTPS
        sameSite: "lax",   // allows cross-origin cookies
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//      Routes
app.get("/", (req, res) => {
    res.redirect("/dashboard")
})

app.use("/auth", authRouter)
app.use("/dashboard", todoRouter)

const path = require("path");

// Serve React build
const frontendPath = path.resolve(__dirname, "../frontend");

app.use(express.static(frontendPath));

app.get(/^(?!\/auth|\/dashboard).*$/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

//      Connection of DB
const port = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
async function start() {
    try {
        await mongoose.connect(DB_URL)
        console.log("DB connected successfully")
        app.listen(port, () => {
            console.log("server is listen on", port)
        })
    } catch (err) {
        console.log(err)
    }
}
start();