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

const app = express();

//      Midllewares
app.use(cors({
    origin: "https://todoapp-zo2c.onrender.com", // React app URL
    credentials: true               // allow cookies (needed for session)
}));
app.use(methodOverride('_method'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}))
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