const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Skill = require("../models/Skill.model");
const User = require("../models/User.model");

router.post("/", (req, res) => {
  const skillDetails = {
    title: req.body.title,
    category: req.body.category,
  };
  Skill.create(skillDetails)

    .then((skillCreated) => res.status(201).json(skillCreated))
    .catch((err) => {
      console.log("error creating a new skill", err);
      res.status(500).json({
        message: "error creating a new skill",
        error: err,
      });
    });
});

router.get("/", (req, res) => {
  Skill.find()
    .then((skillsFromApi) => {
      res.json(skillsFromApi);
    })
    .catch((err) => {
      console.log("error getting skills from Api", err);
      res.status(500).json({
        message: "error getting skills from Api",
        error: err,
      });
    });
});

router.put("/:skillId/wantstolearn", isAuthenticated, (req, res) => {
  const { skillId } = req.params;
  const { _id } = req.payload;

  User.findByIdAndUpdate(_id, {
    $addToSet: { wantsToLearn: skillId, new: true, upsert: true },
  })
    .exec()
    .then((addedSkill) => {
      res.status(201).json(addedSkill);
    })
    .catch((err) => {
      console.log("Error adding skill to learn...", err);
    });
});

module.exports = router;
