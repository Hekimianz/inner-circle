const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../db/db");

router.get("/", (req, res) => res.render("register"));

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2);",
      [username, hashedPassword]
    );
    res.redirect("/log-in");
  } catch (err) {
    console.error("Error creating user:", err);
    res.redirect("/register");
  }
});

module.exports = router;
