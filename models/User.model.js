const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      unique: true,
    },
    wantsToLearn: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    wantsToTeach: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
