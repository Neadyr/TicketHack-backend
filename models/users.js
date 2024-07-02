const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  tripCart: [{ type: mongoose.Schema.Types.ObjectId, ref: "trips" }],
  tripBooked: [{ type: mongoose.Schema.Types.ObjectId, ref: "trips" }],
  tripPassed: [{ type: mongoose.Schema.Types.ObjectId, ref: "trips" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
