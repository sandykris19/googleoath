const express = require("express");
const app = express();
const authRoutes = require("./routes/auth-routes.js");
const profileRoutes = require("./routes/profile-routes.js");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");

//Database connection
const uri =
  "mongodb+srv://m001-student:m001-password@sandbox.yqnjh.mongodb.net/oauthusers?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then((res) => {
    console.log("connected to db");
  });

//View engine
app.set("view engine", "ejs");

//Middleware
app.use(express.static("public"));
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["netninjaisawesome"],
  })
);
//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(process.env.PORT || 3000, console.log("Listening at port 3000"));
