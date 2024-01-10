//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/logout", function(req, res) {
    res.redirect("/");
})

app.post("/login", function (req, res) {
    User.findOne({ email: req.body.username }).then((item) => {
        if (!item) {
            res.send("Invalid username or password!");
        } else {
            if(item.password === req.body.password){
                res.render("secrets");
            } else {
                res.send("Invalid password!");
            }
        }
    })
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.post("/register", function (req, res) {
    User.findOne({ email: req.body.username }).then((item) => {
        if (!item) {
            const newUser = new User({
                email: req.body.username,
                password: req.body.password
            });

            newUser.save().then((err) => {
                res.send("Successfully registred!");
            })
        } else {
            res.send("There is already a user with such username");
        }
    })
})




app.listen(3000, function () {
    console.log("Server is started at port 3000");
})