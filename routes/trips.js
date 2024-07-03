var express = require("express");
var router = express.Router();
var { checkBody } = require("../modules/checkBody");
var User = require("../models/users");
const Trip = require("../models/trips");

const verifDepArr = ["departure", "arrival"];
const verifDepArrDat = ["departure", "arrival", "date"];

router.get("/", (req, res) => {
  Trip.find().then((data) => {
    res.json(data);
  });
});

router.get("/:departure/:arrival", (req, res) => {
  const { departure, arrival } = req.params;
  Trip.find({
    departure: { $regex: new RegExp(departure, "i") },
    arrival: { $regex: new RegExp(arrival, "i") },
  }).then((data) => {
    if (data.length != 0) {
      res.json({ result: true, trips: data });
    } else {
      res.json({ result: false, error: "No trip found" });
    }
  });
});

router.get("/:departure/:arrival/:date", (req, res) => {
  let { departure, arrival, date } = req.params;

  date = new Date(date);
  console.log(date);
  //let date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  let date2 = new Date(date);
  date2.setDate(date.getDate() + 1);
  console.log(date2);
  Trip.find({
    departure: { $regex: new RegExp(departure, "i") },
    arrival: { $regex: new RegExp(arrival, "i") },
    date: {
      $gte: date,
      $lt: date2,
    },
  }).then((data) => {
    if (data.length != 0) {
      res.json({ result: true, trips: data });
    } else {
      res.json({ result: false, error: "No trip found" });
    }
  });
});

router.put("/cart", (req, res) => {
  const { tripId, username } = req.body;
  Trip.findOne({ _id: tripId }).then((data) => {
    if (data) {
      User.findOne({ username: username }).then((data) => {
        data.tripCart.push(tripId);
        data.save().then(() => {
          User.findOne({ username: username })
            .populate("tripCart")
            .then((data) => res.json({ result: true, cart: data }));
        });
      });
    } else {
      res.json({ result: false, error: "No trip found" });
    }
  });
});

router.delete("/cart", (req, res) => {
  const { tripId, username } = req.body;
  console.log(tripId);
  User.updateOne({ username: username }, { $pull: { tripCart: tripId } }).then(
    (data) => {
      console.log(data);
      if (data.modifiedCount == 1) {
        res.json({ result: true, message: "Trip deleted" });
      } else {
        res.json({ result: false, message: "Trip not found" });
      }
    }
    // .then((data) => console.log(data))
    // data.tripCart
    //   .save()
    // .then(res.json({ result: true, message: "Trip deleted" }));
  );
});

router.put("/booked", (req, res) => {
  const { username } = req.body;
  User.findOne({ username }).then((data) => {
    data.tripBooked = data.tripCart;
    data.tripCart = [];
    data.save().then(res.json({ result: true, message: "Trip(s) booked" }));
  });
});

router.put("/passed", (req, res) => {
  const { username } = req.body;
  User.findOne({ username }).then((data) => {
    data.tripPassed = data.tripBooked;
    data.tripBooked = [];
    data.save().then(res.json({ result: true, message: "Trip(s) passed" }));
  });
});

module.exports = router;
