const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => res.render("home"));

app.listen(3000, () => console.log("Server up at port 3000"));
