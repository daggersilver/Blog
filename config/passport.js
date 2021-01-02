
function initializeAuth(){
    const passport = require("passport");
    const LocalStrategy = require("passport-local").Strategy;

    //get models
    const User = require("../models/user");

    passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Incorrect username or password.' });
            }
            if(user.password==password){
                return done(null, user, {message: "Logged In successfully"});
            } else{
              return done(null, false, { message: 'Incorrect username or password.' });
            }
          });
        }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
}

module.exports = initializeAuth;