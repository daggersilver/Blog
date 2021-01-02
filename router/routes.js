const express = require("express");
const moment = require("moment");
const passport = require("passport");
const { body, validationResult } = require('express-validator');
const router = express.Router();

//get models
const Blogs = require("../models/Blogs");

//verify middleware
const checkauth = require("../config/verify").checkauth;
const checkLoggedIn = require("../config/verify").checkLoggedIn;

router.get("/new-post", checkauth, (req, res)=>{
    res.render("newpost", {error: req.flash("error")});
})

router.post("/new-post", checkauth,
body("title").notEmpty().withMessage("Title must not be Empty") ,
body("content").notEmpty().withMessage("Content must not be Empty") ,
(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errs = [];
        errors.errors.forEach(element => {
            errs.push(element.msg)
        });
        req.flash("error", errs)
        res.redirect("/new-post");
        return;
    }
    const blog = new Blogs();
    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.publish = req.body.publish=="yes" ? true: false;
    blog.date = moment().format('MMMM Do YYYY, h:mm a');
    blog.comments = [];

    blog.save((err)=>{
        if(err){
            console.log(err)
            res.send("server error");
        } else{
            req.flash("success", "Successfully added Blog");
            res.redirect("/")
        }
    })
})

router.get("/:id/status", checkauth, (req, res)=>{
    Blogs.findById(req.params.id, (err, data)=>{
        if(err) throw err;
        Blogs.updateOne({_id: data._id}, {$set:{publish: data.publish ? false: true} }, (err)=>{
            if(err) throw err;
            req.flash("success", "Successfully Changed publish status")
            res.redirect("/");
        })
    })
})

router.get("/:id/edit", checkauth, (req, res)=>{
    Blogs.findById(req.params.id, (err, result)=>{
        if (err) throw err;
        res.render("edit", {id: req.params.id,
                            error: req.flash("error"),
                            title: result.title,
                            content: result.content
        });
    })
})

router.post("/:id/edit", checkauth, (req, res)=>{
    Blogs.findById(req.params.id, (err, data)=>{
        if(err){
            req.flash("error", "Server Error")
            res.redirect("/");
            return;
        };
        Blogs.updateOne({_id: data._id}, 
            {
                title: req.body.title,
                content: req.body.content,
                publish: req.body.publish,
                date: moment().format('MMMM Do YYYY, h:mm a')  
            }, 
            (err)=>{
            if(err) {
                req.flash("error", "Server Error")
                res.redirect("/");
                return;
            }
            req.flash("success", "Successfully Edited")
            res.redirect("/");
        })
    })
})

router.get("/:id/delete", checkauth, (req, res)=>{
    Blogs.deleteOne({_id: req.params.id}, (err)=>{
        if(err){
            req.flash("error", "No such data to delete");
            res.redirect("/");
        }
        else{
            req.flash("success", "Successfully Deleted");
            res.redirect("/")
        }
    })
})

router.get("/login",checkLoggedIn, (req, res)=>{
    res.render("login", {error: req.flash("error"),
                         success: req.flash("success")});
})

router.post("/login",checkLoggedIn,passport.authenticate('local', { successRedirect: '/',
                                                     failureRedirect: '/login',
                                                     failureFlash: true ,
                                                     successFlash: true}))

router.get("/logout", checkauth, (req, res)=>{
    req.logOut();
    req.flash("success","logged out successfully");
    res.redirect("/login")
})

router.get("/publish-all", checkauth, (req, res)=>{
    Blogs.updateMany({publish: false}, {$set:{publish: true}}, (err)=>{
        if(err){
            res.send("server Error");
            return;
        }
        req.flash("success", "successfully published all posts");
        res.redirect("/");
    })
})


module.exports = router;