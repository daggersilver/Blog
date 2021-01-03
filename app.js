require("dotenv").config("./.env");

const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

const mongoURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.s6okb.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;

db.on("error", (err)=>{
    if(err) console.log(err);
})
db.once("open", ()=>{
    console.log("database running");
})

//views middleware
app.set("views", "./views")
app.set("view engine", "pug")

//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

//cors
app.use(cors({
    origin: 'https://daggersilver.github.io/Blog/'
}));

//connect flash middleware
app.use(cookieParser('keyboard cat'));
app.use(flash());

//serving static files
app.use(express.static(path.join(__dirname, "public")))

//get Models
const Blogs = require("./models/Blogs");

//
app.use(passport.initialize());
app.use(passport.session());

//initializing passport
const initializeAuth = require("./config/passport");
initializeAuth();

//global user variable
app.get("*", (req, res, next)=>{
    res.locals.user = req.user;
    next();
})

//verify middleware
const checkauth = require("./config/verify").checkauth;

app.get("/", checkauth, (req, res)=>{
    Blogs.find({}, (err, data)=>{
        if(err) throw err;
        else{
            res.render("index", {blogs: data,
                                 success: req.flash("success"),
                                 error: req.flash("error")
                                });
        }
    })
})

//set routes
const routes = require("./router/routes");
const api = require("./api/api");
const { read } = require("fs");
app.use("/", routes);
app.use("/api", api);

//error route
app.get("*", (req, res)=>{
    res.status(404).render("404");
})

app.listen(port);



