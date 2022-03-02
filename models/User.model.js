const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      //unique: true,
    },
    password: String,
    email: {
      type: String,
      unique: true,
    },
    wantsToLearn: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    wantsToTeach: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    img: String,
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
