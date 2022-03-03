const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Skill = require("../models/Skill.model");

router.get("/", (req, res) => {
  User.find()
    .populate("wantsToLearn")
    .populate("wantsToTeach")
    .populate("friends")
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

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  User.findById(userId)
    //.populate("wantsToLearn", "wantsToTeach")
    .then((user) => res.status(500).json(user))
    .catch((err) => res.json(err));
});

router.put("/:userId", (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  const userDetails = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    img: req.body.img,
    wantsToLearn: [],
    wantsToLearn: [],
    friends: [],
  };
  User.findByIdAndUpdate(userId, userDetails, { new: true })
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => res.status(500).json(err));
});


router.post("/:userId/friend", (req, res) => {
  const { userId } = req.params;
  const { _id } = req.payload;

  User.findByIdAndUpdate(_id, {
    $push: { friends: userId}
  })
    .then((addedFriend) => {
      res.status(201).json(addedFriend)
    })
    .catch((err) => {
      console.log("Error adding friend...", err);
    })
});



module.exports = router;
