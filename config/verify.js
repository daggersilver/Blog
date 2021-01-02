function checkauth(req, res, next){
    if(req.user){
        next();
    } else{
        req.flash("error", "Log In first");
        res.redirect("/login");
    }
}

function checkLoggedIn(req, res, next){
    if(req.user){
        req.flash("error", "Already Logged In");
        res.redirect("/");
    } else{
        next();
    }
}

module.exports.checkauth = checkauth;
module.exports.checkLoggedIn = checkLoggedIn;