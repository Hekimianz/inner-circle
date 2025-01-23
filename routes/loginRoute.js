const express = require("express");
const passport = require("passport");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const validateInput = [
  body("username").trim().escape(),
  body("password").trim().escape(),
];
router.get("/", (req, res) => {
  res.render("login");
});

router.post(
  "/",
  validateInput,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        errors: errors.array(),
      });
    }
    return next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);
module.exports = router;
