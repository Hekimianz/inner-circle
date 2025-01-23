const express = require("express");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./config/passport");
const path = require("path");
const app = express();
const indexRoute = require("./routes/indexRoute");
const loginRoute = require("./routes/loginRoute");
const registerRoute = require("./routes/registerRoute");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);

app.use("/log-in", loginRoute);
app.use("/log-out", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred during logout.");
    }
    res.redirect("/");
  });
});

app.use("/register", registerRoute);
app.use("/", indexRoute);

app.listen(3000, () => console.log("Server up at port 3000"));
