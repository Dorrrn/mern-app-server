const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");

router.get("/", (req, res) => {
  User.find()
    //.populate("wantsToLearn", "wantsToTeach")
    .then((usersFromApi) => {
      res.json(usersFromApi);
    })
    .catch((err) => {
      console.log("error getting users from Api", err);
      res.status(500).json({
        message: "error getting users from Api",
        error: err,
      });
    });
});

router.get("/profile/:userId", (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Project.findById(userId)
    //.populate("wantsToLearn", "wantsToTeach")
    .then((user) => res.status(500).json(user))
    .catch((err) => res.json(err));
});

module.exports = router;
