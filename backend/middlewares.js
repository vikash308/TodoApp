function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Please Login First" });
}

module.exports = isAuth;