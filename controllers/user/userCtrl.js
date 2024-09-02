const expressAsyncHandler = require('express-async-handler');
const User = require('../../model/user/User');
const generateToken = require('../../config/token/generateToken');
const validateMongodbId = require('../../utils/validateMongodb');

// -------------
//User Registration
//-------------

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  //user exists
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) throw new Error('User already exists');
  // if (userExists) {
  //   return res.status(400).json({ error: 'User already exists' });
  // }

  try {
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json({ error: error });
  }
});

// -------------
//User Login
//-------------

const userLoginCtrl = expressAsyncHandler(async (req, res) => {
  //check if user exists
  const userExists = await User.findOne({ email: req?.body?.email });
  if (!userExists) throw new Error('User does not exist');
  //check password
  const isPasswordCorrect = await userExists.comparePassword(
    req?.body?.password
  );

  if (userExists && isPasswordCorrect) {
    res.json({
      _id: userExists?._id,
      firstName: userExists?.firstName,
      lastName: userExists?.lastName,
      email: userExists?.email,
      token: generateToken(userExists._ID),
    });
  } else {
    res.status(401);
    throw new Error('Wrong user Credentials');
  }
});

// -------------
//Get all User
//-------------

const userFetchCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ length: users.length, users });
  } catch (error) {
    res.json(error);
  }
});

// -------------
//Get all User
//-------------

const userDeleteCtrl = expressAsyncHandler(async (req, res) => {
  validateMongodbId(req?.params?.id);
  try {
    const user = await User.findByIdAndDelete(req?.params?.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  userRegisterCtrl,
  userLoginCtrl,
  userFetchCtrl,
  userDeleteCtrl,
};
