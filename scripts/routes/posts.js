const express = require("express");
const router = express.Router();

// 1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
router.post("/new-user", (req, res) => {
  res.json({
    res: "hello from new-user",
  });
});
// 2. I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
router.get("/users", (req, res) => {
  res.json({
    res: "hello from users",
  });
});
// 3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will be the user object with also with the exercise fields added.
router.post("/add", (req, res) => {
  res.json({
    res: "hello from add",
  });
});
// 4. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
router.get("/log", (req, res) => {
  res.json({
    res: "hello from log",
  });
});
// 5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

module.exports = router;
