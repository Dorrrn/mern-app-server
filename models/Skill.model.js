const { Schema, model } = require("mongoose");

const skillSchema = new Schema({
  title: {
    type: String,
    unique: true,
  },
  category: {
    type: String,
    enum: ["language", "sport", "instrument", "coding language", "others"],
  }

});

const Skill = model("Skill", skillSchema);

module.exports = Skill;
