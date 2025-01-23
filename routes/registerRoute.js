const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { pool } = require("../db/db");
const { body, validationResult } = require("express-validator");

const validateInput = [
  body("username")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

router.get("/", (req, res) => res.render("register", { errors: [] }));

router.post("/", validateInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).render("register", { errors: errors.array() });
  }

  const { username, password } = req.body;

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (existingUser.rows.length > 0) {
    return res
      .status(400)
      .render("register", { errors: [{ msg: "Username is already taken" }] });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2);",
      [username, hashedPassword]
    );
    res.redirect("/log-in");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).render("register", {
      errors: [{ msg: "An error occurred during registration" }],
    });
  }
});

module.exports = router;
