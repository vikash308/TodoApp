const express = require("express");
const router = express.Router();
const User = require("../models/user")
const passport = require("passport")
const isAuth = require("../middlewares");
const jwt = require("jsonwebtoken");

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        const user = new User({ username, email });
        await User.register(user, password);

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(400).json({ error: err.message });
    }
});


// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "User not found" });

    user.authenticate(password, (err, result) => {
        if (err || !result) return res.status(401).json({ error: "Invalid password" });

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ message: "Logged in successfully", token , username });
    });
});


router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

// authRoutes.js
router.get("/check", passport.authenticate("jwt", { session: false }), (req, res) => {
    // If token is valid, req.user exists
    res.json({
        message: "User is logged in",
        user: {
            id: req.user._id,
            username: req.user.username
        }
    });
});





module.exports = router