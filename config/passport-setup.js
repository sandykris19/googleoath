const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options
      callbackURL: "/auth/google/redirect",
      clientID:
        "654288032632-4m3odc830nc5b8v4ljcmeqgc0c83n9bk.apps.googleusercontent.com",
      clientSecret: "hWfFr9oyTCMdGPK9PqYvcOBc",
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback function
      // console.log(profile);
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log("User is " + currentUser);
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id,
            dp: profile.photos[0].value,
          })
            .save()
            .then((record) => {
              console.log(`Saved to database ${record}`);
            });
          done(null, record);
        }
      });
    }
  )
);
