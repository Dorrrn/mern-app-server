const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    password: String,
    email: {
      type: String,
      unique: true,
    },
    bio: String,
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
