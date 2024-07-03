var express = require("express");
var router = express.Router();
var User = require("../models/users");
const Trip = require("../models/trips");

var { checkBody } = require("../modules/checkBody");
const verif = ["username", "password"];

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", function (req, res) {
  if (checkBody(req.body, verif)) {
    let usernameLower = req.body.username.toLowerCase();
    User.findOne({ username: usernameLower }).then((data) => {
      if (data) {
        res.json({ result: false, error: "User already exists" });
      } else {
        newUser = new User({
          username: usernameLower,
          password: req.body.password,
        });
        newUser
          .save()
          .then((data) =>
            res.json({ result: true, message: "new user created" })
          );
      }
    });
  } else {
    res.json({ result: false, error: "Missing or empty fields" });
  }
});

router.post("/login", function (req, res) {
  let usernameLower = req.body.username.toLowerCase();
  User.findOne({ username: usernameLower, password: req.body.password }).then(
    (data) => {
      console.log(data);
      if (data) {
        res.json({ result: true, message: "User Logged In" });
      } else {
        res.json({ result: false, error: "User Not Found" });
      }
    }
  );
});

router.get("/cart/:username", function (req, res, next) {
  User.findOne({ username: req.params.username })
    .populate("tripCart")
    .then((data) => {
      console.log(data);
      res.json({ result: true, cart: data.tripCart });
    });
});

router.get("/booked", function (req, res, next) {
  const { username } = req.body;
  User.findOne({ username: username })
    .populate("tripBooked")
    .then((data) => {
      console.log(data);
      res.json({ result: true, cart: data.tripBooked });
    });
});

router.get("/passed", function (req, res, next) {
  const { username } = req.body;
  User.findOne({ username: username })
    .populate("tripPassed")
    .then((data) => {
      console.log(data);
      res.json({ result: true, cart: data.tripPassed });
    });
});

module.exports = router;
