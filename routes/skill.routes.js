const router = require("express").Router();
const mongoose = require("mongoose");
const Skill = require("../models/Skill.model")
const User = require("../models/User.model");


router.post("/", (req, res) => {
  const { skillId } = req.body;
  const skillDetails = {
    title: req.body.title,
    category: req.body.category
  };
  Skill.create(skillDetails)
    // .then((newSkill) => {
    //   return Skill.findByIdAndUpdate(skillId, {
    //     $push: { tasks: newSkill._id },
    //   });
    // })
    .then((response) => res.json(response))
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





module.exports = router;