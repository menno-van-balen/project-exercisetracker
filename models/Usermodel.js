const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
  username: { type: String, required: true },
  count: { type: Number, required: true },
  log: [
    {
      date: { type: Date },
      duration: { type: Number, required: true },
      description: { type: String, required: true },
    },
  ],
});

const User = mongoose.model("user", userSchema);

module.exports = User;
