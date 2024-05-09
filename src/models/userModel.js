import mongoose from "mongoose";
import { isGoodPassword } from "../utils/validators.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const careerEnum = [
  "engineering",
  "medicine",
  "law",
  "mathematics",
  "art",
];

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 16,
    minlength: 2,
    trim: true,
    lowercase: true,
  },

  lastName: {
    type: String,
    required: true,
    maxlength: 16,
    minlength: 2,
    trim: true,
    lowercase: true,
  },

  email: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 8,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
  },

  career: {
    type: String,
    required: true,
    enum: careerEnum,
    validate: {
      validator: function (v) {
        return careerEnum.includes(v);
      },
      message: (props) => `${props.value} is not a valid career`,
    },
  },

  age: {
    type: Number,
    required: true,
    min: 17,
    max: 120,
  },

  registrationDate: {
    type: Date,
    default: Date.now(),
  },

  password: {
    type: String,
    validate: {
      validator: function (value) {
        return isGoodPassword(value);
      },
      message:
        "Password must be between 6 and 12 characters, contain a numeric digit, a lowercase letter, and an uppercase letter",
    },
  },
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

const User = mongoose.model("user", userSchema);

export default User;
