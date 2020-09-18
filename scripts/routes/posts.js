const express = require("express");
const router = express.Router();
const User = require("../../models/Usermodel");

// 1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
router.post("/new-user", (req, res) => {
  // request variables
  const username = req.body.username;

  // controle if username exists else create new user
  User.findOne({ username })
    .exec()
    .then((doc) => {
      if (doc) {
        console.log("New user request error: Username already taken");
        res.send("Username already taken");
      } else {
        const user = new User({
          username,
          count: 0,
        });
        console.log("Creating new user: ", user);
        user.save().then((doc) => {
          // response variables
          const { id, username } = doc;

          // send response
          res.json({
            username,
            id,
          });
        });
      }
    })
    .catch((err) => {
      console.log("New user request error: ", err);
      res.send(err);
    });
});

// 2. I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
router.get("/users", (req, res) => {
  console.log("Request for userlist");

  // find all users
  User.find({})
    .exec()
    .then((docs) => {
      // array to store users
      let result = [];

      docs.forEach((doc) => {
        // response variables
        const { id, username } = doc;

        result.push({
          username,
          id,
        });
      });

      // send response
      res.json(result);
    })
    .catch((err) => {
      console.log("Request for userlist error: ", err);
      res.send(err);
    });
});

// 3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will be the user object with also with the exercise fields added.
router.post("/add", (req, res) => {
  // search variables
  const { userId, description, duration } = req.body;
  let date = req.body.date;
  console.log("Adding to log from user with id:", userId);

  // handle date
  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }

  // search user doc
  User.findById(userId)
    .exec()
    .then((doc) => {
      doc.log.push({
        description,
        duration,
        date,
      });
      doc.count += 1;
      doc
        .save()
        .then((doc) => {
          // response variables from new saved user doc
          const { _id, username } = doc;
          const lastLog = doc.log[doc.log.length - 1];
          const date = lastLog.date.toDateString();
          const { duration, description } = lastLog;

          // send back response
          res.json({
            _id,
            username,
            date,
            duration,
            description,
          });
        })
        .catch((err) => {
          console.log("Add excercise error");
          res.json({ err });
        });
    })
    .catch((err) => {
      console.log("Add excercise error", err);
      res.json("Error, user not in database");
    });
});

// 4. I can retrieve a full exercise log of any user by getting /api/exercise/log?userId=<userId>. Return will be the user object with added array log and count (total exercise count).
// 5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int):
// /api/exercise/log?userId=<userID>?from=<from>&to=<to>?limit=<limit>
router.get("/log", (req, res) => {
  // request variables
  const { userId, limit } = req.query;
  let { from, to } = req.query;
  from = new Date(from);
  to = new Date(to);
  console.log(
    "getting full log from user with id:",
    userId,
    "log-limit:",
    limit,
    "from date:",
    from,
    "to date:",
    to
  );

  // find user
  User.findById(userId)
    .exec()
    .then((doc) => {
      // response variables
      const { _id, username } = doc;
      const docLog = doc.log;
      let log = [];

      // create log response if requested date options are valid
      if (from != "Invalid Date" && to != "Invalid Date") {
        docLog.forEach((obj) => {
          // response variables for log
          const { description, duration } = obj;
          const date = obj.date.toDateString();

          // only push to log if date is within range
          if (obj.date >= from && obj.date <= to) {
            log.push({
              description,
              duration,
              date,
            });
          }
        });
        // create log response if no dates requested
      } else {
        docLog.forEach((obj) => {
          const { description, duration } = obj;
          const date = obj.date.toDateString();
          log.push({
            description,
            duration,
            date,
          });
        });
      }

      // handle requested limit
      if (limit) log = log.slice(0, limit);

      // give log count the right value
      const count = log.length;

      // send response
      res.json({
        _id,
        username,
        count,
        log,
      });
    })
    .catch((err) => {
      console.log("retrieve log error");
      res.send(err);
    });
});

module.exports = router;
