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

router.put("/profile/edit", isAuthenticated, (req, res) => {
  const { _id } = req.payload;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  const userDetails = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    img: req.body.img,
    bio: req.body.bio,
  };
  User.findByIdAndUpdate(_id, userDetails, { new: true })
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => res.status(500).json(err));
});

router.put("/updateprofile", isAuthenticated, (req, res) => {
  const { _id } = req.payload;

  const skillsToLearn = {
    title: req.body.learnTitle,
    category: req.body.learnCategory,
  };

  const skillsToTeach = {
    title: req.body.teachTitle,
    category: req.body.teachCategory,
  };

  const userDetails = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    img: req.body.img,
    bio: req.body.bio,
  };

  Skill.create(skillsToLearn).then((skillToLearnCreated) => {
    res.status(201).json(skillToLearnCreated);
    return Skill.create(skillsToTeach).then((skillToTeachCreated) => {
      res.status(201).json(skillToTeachCreated);
      return User.findByIdAndUpdate(_id, userDetails, {
        $addToSet: [
          {
            wantsToLearn: skillToLearnCreated._id,
            new: true,
            upsert: true,
          },
          {
            wantsToTeach: skillToTeachCreated._id,
            new: true,
            upsert: true,
          },
        ],
      })
        .exec()
        .then((updatedUser) => {
          res.json(updatedUser);
        })
        .catch((err) => {
          console.log("Error updating profile...", err);
        });
    });
  });
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

// router.get("/search", (req, res) => {
//   const { searchQuery } = req.query;

//   User.find(searchQuery)
//     .populate("wantsToLearn")
//     .populate("wantsToTeach")
//     .populate("friends")
//     .then((users) => res.status(500).json(users))
//     .catch((err) => res.json(err));
// });

module.exports = router;
