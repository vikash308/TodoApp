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

const app = express();

//      Midllewares
app.use(cors({
    origin: "http://localhost:5173", // React app URL
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

//      Routes
app.get("/", (req, res) => {
    res.redirect("/dashboard")
})

app.use("/auth", authRouter)
app.use("/dashboard", todoRouter)



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