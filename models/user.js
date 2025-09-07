import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  accountType: {
    type: String,
    required: true,
    default: "email",
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.hash(user.password, 10, (error, hash) => {
      if (error) return next(error);
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

const User = mongoose.model("user", userSchema);

export default User;
