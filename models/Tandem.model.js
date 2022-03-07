const { Schema, model } = require("mongoose");

const tandemSchema = new Schema(
  {
    user1: [{ type: Schema.Types.ObjectId, ref: "User" }],
    user2: [{ type: Schema.Types.ObjectId, ref: "User" }],
    user1messages: String,
    user2messages: String,
  },
  {
    timestamps: true,
  }
);

const Tandem = model("Tandem", userSchema);

module.exports = Tandem;
