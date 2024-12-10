// models/Course.js
/*const mongoose = require("mongoose");*/
const db = require("../config/db");

const CourseSchema = new db.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String },
  lecCredits: { type: Number },
  labCredits: { type: Number }
});

module.exports = db.model("Course", CourseSchema);
