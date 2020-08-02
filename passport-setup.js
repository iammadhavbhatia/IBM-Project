const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  
    done(null, user);
 
});
passport.use(new GoogleStrategy({
    clientID: "199289055736-2gc559evhj7f497792doel5bjtmurqdm.apps.googleusercontent.com",
    clientSecret: "iomK9VlKMpHVWSNOS7ZWTmqx",
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    
  }
));