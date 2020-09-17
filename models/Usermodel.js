const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
  username: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  description: { type: String, required: true },
});

const user = mongoose.Model("user", userSchema);

module.exports = user;
