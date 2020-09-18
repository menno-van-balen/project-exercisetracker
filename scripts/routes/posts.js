const express = require("express");
const router = express.Router();
const User = require("../../models/Usermodel");

// 1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
router.post("/new-user", (req, res) => {
  const username = req.body.username;
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
          const id = doc._id;
          const username = doc.username;
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
  User.find({})
    .exec()
    .then((docs) => {
      let result = [];
      docs.forEach((doc) => {
        const username = doc.username;
        const id = doc._id;
        result.push({
          username,
          id,
        });
      });
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
          const length = doc.log.length;
          const lastLog = doc.log[length - 1];
          const _id = doc._id;
          const username = doc.username;
          const date = lastLog.date.toDateString();
          const duration = lastLog.duration;
          const description = lastLog.description;
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
      console.log("Add excercise error");
      res.json("Error, user not in database");
    });
});

// 4. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
router.get("/log", (req, res) => {
  // res.json({
  //   res: "hello from log",
  // });
  const id = req.query.userId;
  console.log(id);
  User.findById(id)
    .exec()
    .then((doc) => {
      const _id = doc._id;
      const username = doc.username;
      const count = doc.count;
      let log = [];
      doc.log.forEach((obj) => {
        const description = obj.description;
        const duration = obj.duration;
        const date = obj.date.toDateString();
        log.push({
          description,
          duration,
          date,
        });
      });
      // console.log(doc.log);
      res.json({
        _id,
        username,
        count,
        log,
      });
    })
    .catch((err) => {
      console.log("Add excercise error");
      res.send(err);
    });
});
// 5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

module.exports = router;
