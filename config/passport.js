const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { query } = require("../db/db");
const passport = require("passport");

function initialize(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const result = await query("SELECT * FROM users WHERE username = $1", [
          username,
        ]);
        const user = result.rows[0];

        if (!user) {
          return done(null, false, { message: "No user with that username" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Password incorrect" });
        }

        return done(null, user);
      } catch (err) {
        done(err);
      }
    })
  );
}

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = initialize;
