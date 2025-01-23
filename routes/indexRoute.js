const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const { format } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT users.username, messages.content AS content, messages.created_at AS created_at FROM users INNER JOIN messages ON users.id = messages.user_id;"
    );

    rows.forEach((row) => {
      const utcDate = new Date(row.created_at);
      const localDate = utcToZonedTime(
        utcDate,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );
      row.date = format(localDate, "dd/MM/yy HH:mm");
    });
    res.render("home", {
      user: req.user || false,
      messages: rows.reverse() || false,
    });
  } catch (err) {
    console.error("Failed to get messages:", err);
  }
});

module.exports = router;
