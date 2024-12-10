// models/Comment.js
/*const mongoose = require("mongoose");*/
const db = require("../config/db");

const CommentSchema = new db.Schema({
  courseCode: { type: String, required: true, ref: "Course" },
  username: { type: String, required: true, ref: "User" },
  content: { type: String, required: true },
  postId: { type: Number, required:true, ref: "Post" },
  id: { type: Number, default: 0 },
});

module.exports = db.model("Comment", CommentSchema);
