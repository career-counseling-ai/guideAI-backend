const express = require('express');
const {
  userRegisterCtrl,
  userLoginCtrl,
  userDeleteCtrl,
  userFetchCtrl,
  userUpdatePasswordCtrl,
  userProfileCtrl,
  userUpdateCtrl,
} = require('../../controllers/user/userCtrl');
const authMiddleware = require('../../middleware/auth/authMiddleware');

//auth middleware

const userRoutes = express.Router();

userRoutes.post('/register', userRegisterCtrl);
userRoutes.post('/login', userLoginCtrl);
userRoutes.get('/', userFetchCtrl);
userRoutes.delete('/:id', userDeleteCtrl);

// private routes

//Single user details
userRoutes.get('/profile/:id', authMiddleware, userProfileCtrl);
//update profile
userRoutes.put('/profile/update', authMiddleware, userUpdateCtrl);
//update password
userRoutes.put('/profile/password', authMiddleware, userUpdatePasswordCtrl);
module.exports = { userRoutes };
