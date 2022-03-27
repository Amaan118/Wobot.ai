const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.wobot_cookie;
        if (token) {
            const verified = jwt.verify(token, process.env.SECRET_KEY);

            const user = await User.findById({ _id: verified });
            req.token = token;
            req.user = user;

            next();
        }
        else {
            throw new Error
        }
    } catch (err) {
        res.redirect("login");
    }
}

module.exports = authenticate;