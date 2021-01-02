const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    publish:{
        type: Boolean
    },
    date:{
        type: String
    },
    comments:{
        type: Array
    }
})

const Blogs = module.exports = mongoose.model("blogs", blogSchema);
