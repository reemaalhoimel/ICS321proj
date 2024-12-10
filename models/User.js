const db = require("../config/db");

const UserSchema = new db.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = db.model("User", UserSchema);
