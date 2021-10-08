const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: 1,
  },

  nickname: {
    type: String,
    minlength: 3,
    required: true,
  },

  password1: {
    type: String,
    minlength: 4,
    required: true,
  },

  // password2 : {
  //     type: String,
  //     minlength: 4,
  //     required: true
  // },
});

module.exports = mongoose.model("newuser", userSchema);
