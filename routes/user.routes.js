const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Skill = require("../models/Skill.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

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

router.get("/matches", isAuthenticated, (req, res) => {
  const { _id } = req.payload;
  let mySkillsArr = [];

  User.findById(_id)
  .then((currentUser) => {
    currentUser.wantsToLearn.map ((skill) => {
      mySkillsArr.push(skill._id.toString()); 
    })
    return User.find({ wantsToTeach: { $in: mySkillsArr } });
  })
    .then((foundUsers) => {
      res.json(foundUsers);
    })
    .catch((err) => {
      console.log("no matches...", err);
    });
});

router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  User.findById(userId)
    .populate("wantsToLearn")
    .populate("wantsToTeach")
    .populate("friends")
    .then((user) => res.status(500).json(user))
    .catch((err) => res.json(err));
});

router.put("/:friendId/addfriend", isAuthenticated, (req, res) => {
  const { friendId } = req.params;
  const { _id } = req.payload;

  User.findByIdAndUpdate(_id, {
    $addToSet: { friends: friendId, new: true, upsert: true },
  })
    .exec()
    .then((addedFriend) => {
      res.json(addedFriend);
      return User.findByIdAndUpdate(friendId, {
        $addToSet: { friends: _id, new: true, upsert: true },
      }).then((addedFriendBack) => {
        res.json(addedFriendBack);
      });
    })
    .catch((err) => {
      console.log("Error adding friend...", err);
    });
});

module.exports = router;
