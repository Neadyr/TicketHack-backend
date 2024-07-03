const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  tripCart: [{ type: mongoose.Schema.Types.ObjectId, ref: "trips" }],
  tripBooked: [{ type: mongoose.Schema.Types.ObjectId, ref: "trips" }],
  tripPassed: [{ type: mongoose.Schema.Types.ObjectId, ref: "trips" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
