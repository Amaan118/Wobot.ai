require('dotenv').config("../");
const express = require('express');
const path = require('path');
const cookie_parser = require('cookie-parser');
const User = require("./models/user");
const Product = require("./models/product");
const auth = require("./middleware/authenticate");

const app = express();
const port = process.env.PORT || 80;

require("./db/conn");

const viewPath = path.join(__dirname, "../views");
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
app.set("views", viewPath);
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());


app.use(function (req, res, next) {
    const token = req.cookies.wobot_cookie;
    if (token) {
        res.locals.isAuth = true;
    }
    else {
        res.locals.isAuth = false;
    }
    next();
});


app.get('/', (req, res) => {
    res.status(200).render('home');
});


app.get('/add_products', (req, res) => [

]);

app.get("/signup", (req, res) => {
    res.status(200).render("signup");
});


app.post("/signup", async (req, res) => {
    try {
        const username = await User.findOne({ username: req.body.username })
        if (username) {
            throw new Error("Username already taken. Please try another one or Login.")
        }

        if (res.locals.isAuthenticated) {
            res.redirect("/");
        }

        else if (req.body.password === req.body.cpassword) {
            const user_to_signup = User(req.body);

            await user_to_signup.save();

            const token = await user_to_signup.generateAuthToken();
            res.cookie("wobot_cookie", token, {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true
            });

            res.redirect("/");
        }

        else {
            throw new Error("Password Does Not Match!");
        }

    } catch (err) {
        console.log(err);
        res.redirect("/signup");
    }
});


app.get("/login", (req, res) => {
    res.status(200).render("login");
});


app.post("/login", async (req, res) => {
    try {
        if (res.locals.isAuthenticated) {
            res.redirect("/");
        }
        else {
            const user = await User.findOne({ username: req.body.username });

            if (user && user.password === req.body.password) {
                console.log('jh');
                const token = await user.generateAuthToken();

                res.cookie("wobot_cookie", token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    httpOnly: true,
                    secure: true
                });

                res.redirect("/");
            }
            else {
                throw new Error("Invalid Login Credentials.");
            }
        }
    } catch (err) {
        res.redirect("/login");
    }
});


app.get("/end_session", auth, async (req, res) => {
    try {
        if (req.token) {
            res.clearCookie("wobot_cookie");

            req.user.tokens = req.user.tokens.filter((current_token) => {
                return current_token !== req.token;
            });
            await req.user.save();

            res.redirect("/login");
        }
        else {
            throw new Error("Login to access this feature.");
        }
    } catch (err) {
        req.flash("fail", "Login to access this feature.");
        res.redirect("/login");
    }
});


app.listen(port, () => {
    console.log("Connection Successfull.");
})