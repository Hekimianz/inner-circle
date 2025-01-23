const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/log-in", (req, res) => res.render("login"));
app.use("/register", (req, res) => res.render("register"));
app.use("/", (req, res) => res.render("home"));

app.listen(3000, () => console.log("Server up at port 3000"));
