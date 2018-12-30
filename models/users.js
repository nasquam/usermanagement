const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

// const postSchema = new mongoose.Schema({
//   title: String,
//   slug: String,
//   body: String,
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User" // Author would be another collection in the Mongo DB
//   }
// });

// const Post = mongoose.model("Post", postSchema);

// async function getPosts() {
//   const post = await Post.find()
//     // since we've defined a user object (collection object), in our posts data model we can use 
//     // the populate() method to get the referenced collection. The first param in the populate method
//     // is the property in our data model, the second set of params are the fields we want from that collection 
//     .populate("user", "firstName lastName email") 
//     .select("name user");
//   console.log(post);
// }

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 99,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 99,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 99,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
    maxlength: 99,
    trim: true
  },
  city: {
    type: String,
    maxlength: 99,
    trim: true
  },
  state: {
    type: String,
    maxlength: 2,
    trim: true
  },
  zip: {
    type: Number,
    maxlength: 9,
    trim: true
  }
});
// This "User" is the MongoDB collection
const User = mongoose.model("User", userSchema);
// This userSchema is what we defined above
// The const "User" const is what we can execute our find, save, findByID, etc methods on

function genAuthToken(user) {
  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
}

function validateUser(user) {
  const schema = {
    id: Joi.string()
      .min(24)
      .max(24),
    firstName: Joi.string()
      .min(2)
      .max(99)
      .required(),
    lastName: Joi.string()
      .min(2)
      .max(99)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(1024)
      .required(),
    isAdmin: Joi.boolean().required(),
    address: Joi.string()
      .min(2)
      .max(99),
    city: Joi.string()
      .min(2)
      .max(99),
    state: Joi.string()
      .min(2)
      .max(2),
    zip: Joi.number(),
    date: Joi.string()
  };
  return Joi.validate(user, schema);
}

function validateAuth(user) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(1024)
      .required()
  };
  return Joi.validate(user, schema);
}

function validateID(id) {
  const schema = {
    id: Joi.string()
      .min(24)
      .max(24)
  };
  return Joi.validate(id, schema);
}

module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;
module.exports.validateAuth = validateAuth;
module.exports.validateID = validateID;
module.exports.genAuthToken = genAuthToken;
module.exports.User = User;
