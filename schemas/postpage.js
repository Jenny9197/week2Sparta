const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { schema } = mongoose;

//댓글 관련 schema
const commentBoxSchema = new mongoose.Schema({
  commentbox: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
//게시물 관련 schema
const postpageSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 4,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comment: {
    type: [commentBoxSchema],
    required: false,
  },
});

//변경 전:let postpage = mongoose.model("postpage", postpageSchema);
//변경 후 (after mongoose 구조 만들기)
module.exports = mongoose.model("postpage", postpageSchema);
