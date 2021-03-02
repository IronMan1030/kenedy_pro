const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
  },
  token_id: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
