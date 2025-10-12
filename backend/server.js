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
const path = require("path");
const mongoStore = require("connect-mongo")
const app = express();

//      Midllewares
app.use(cors({
    origin: "https://todoapp-zo2c.onrender.com", // React app URL
    credentials: true               // allow cookies (needed for session)
}));
app.use(methodOverride('_method'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const store = mongoStore.create({
    mongoUrl: process.env.DB_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})
store.on("error", () => {
    console.log("error in mongo session ", err)
})
const sessionoption = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
    store
}
app.use(session(sessionoption));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

//      Routes
app.get("/", (req, res) => {
    res.redirect("/dashboard")
})

app.use("/auth", authRouter)
app.use("/dashboard", todoRouter)
app.get((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
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