const express = require("express");
const router = express.Router();
const User = require("../models/user")
const passport = require("passport")
const isAuth = require("../middlewares");

router.post("/signup", async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already in use" });

        const user = new User({ email, username });
        await User.register(user, password);

        req.login(User, (err) => {
            if (err) {
                return next(err)
            }
        })

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message || "Invalid credentials" });

        req.login(user, (err) => {
            if (err) return next(err);
            req.session.user = {
                id: User._id,
                username: User.username,
            };

            res.json({ message: "Logged in successfully", user });
        });
    })(req, res, next);
});


router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

router.get("/check", isAuth, (req, res) => {
    res.json({ message: "User is logged in", user: req.user });
});




module.exports = router