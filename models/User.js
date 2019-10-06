const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const UserSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  local: {
    password: {
      type: String,
    },
  },
  google: {
    id: {
      type: String,
    },
  },
  facebook: {
    id: {
      type: String,
    },
  },

  displayName: {
    type: String,
  },
});

UserSchema.pre("save", async function(next) {
  //we use function and not arrow function is beacuase we need to use "this.password"
  try {
    if (this.method !== "local") next();
    const salt = await bcrypt.genSalt(10);
    //Generate hashed password (salt + hash)
    const passwordHashed = await bcrypt.hash(this.local.password, salt);
    //store hashed password to database
    this.local.password = passwordHashed;
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("User", UserSchema, "users");
