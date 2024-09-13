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
      token: generateToken(userExists._id),
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
    const users = await User.find({}).select('-password');
    res.json({ length: users.length, users });
  } catch (error) {
    res.json(error);
  }
});

// -------------
//Delete User
//-------------

const userDeleteCtrl = expressAsyncHandler(async (req, res) => {
  //validate id
  validateMongodbId(req?.params?.id);
  try {
    const user = await User.findByIdAndDelete(req?.params?.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.json(error);
  }
});

// -------------
//User profile
//-------------\

const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findById(id).select('-password');
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

// -------------
//Update User details
//-------------

const userUpdateCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.user;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});

// -------------
//Update User password
//-------------

const userUpdatePasswordCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.user;
  const { password } = req?.body;
  validateMongodbId(id);
  const user = await User.findById(id);
  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  }
  req.json(user);
});

module.exports = {
  userRegisterCtrl,
  userLoginCtrl,
  userFetchCtrl,
  userDeleteCtrl,
  userProfileCtrl,
  userUpdateCtrl,
  userUpdatePasswordCtrl,
};
