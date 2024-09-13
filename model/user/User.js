const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//create schema
const userSchema = new mongoose.Schema({
  firstName: {
    required: [true, 'First name is required'],
    type: String,
  },
  lastName: {
    type: String,
  },
  // profilePhoto: {
  //   type: String,
  //   default:
  //     'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  // },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'Hei buddy Password is required'],
  },
});

//hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//bcrypt password compare
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Compile schema into model
const User = mongoose.model('User', userSchema);

module.exports = User;
