const mongoose = require("mongoose");
const passportLocalMongoose =
  require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(passportLocalMongoose); // ✅ PASS FUNCTION DIRECTLY

module.exports = mongoose.model("User", userSchema);
    