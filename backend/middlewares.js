function isAuth(req, res, next) {
    if (req.session.user) {
        req.user= req.session.user
        return next();
    }
    res.status(401).json({ message: "Please Login First" });
}

module.exports = isAuth;
