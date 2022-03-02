const router = require("express").Router();
const mongoose = require("mongoose");
const Skill = require("../models/Skill.model");
const User = require("../models/User.model");


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