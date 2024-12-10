// models/Ban.js
/*const mongoose = require("mongoose");*/
const db = require("../config/db");

const BanSchema = new db.Schema({
  adminUsername: { type: String, required: true, ref: "User" },
  username: { type: String, required: true, ref: "User" },
  email: { type: String, required: true },
});

module.exports = db.model("Ban", BanSchema);
