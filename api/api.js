const express = require("express");
const router = express.Router();

//get models
const Blogs = require("../models/Blogs");

router.get(`/${process.env.TEXT_API}`, (req, res)=>{
    Blogs.find({publish:true}, {}, (err, data)=>{
        if(err) {
            res.send("server Error");
            return;
        };
        res.json({
            articles: data
        })
    })
})

router.post("/:id/:sent_api", (req,res)=>{
    if(req.params.sent_api !== process.env.TEXT_API){
        res.status(402).send("unauthorized");
        return;
    }

    Blogs.updateOne({_id: req.params.id}, {
        $push:{
           comments: {
                username: req.body.username,
                comment: req.body.comment
            }
        }
    }, (err, data)=>{
        if(err) throw err;
        res.send("successfull")
        return;
    })
})


module.exports = router;