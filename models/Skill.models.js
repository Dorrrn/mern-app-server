const { Schema, model } = require("mongoose");

const skillSchema = new Schema({
  title: String,
  category: {
    type: String,
    enum: ["language", "sports", "instrument", "coding language" ]
  }
});

const Skills = model("Skill", skillSchema);

module.exports = Skill;
