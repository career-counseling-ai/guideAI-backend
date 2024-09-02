const express = require('express');
const {
  userRegisterCtrl,
  userLoginCtrl,
  userDeleteCtrl,
  userFetchCtrl,
} = require('../../controllers/user/userCtrl');

const userRoutes = express.Router();

userRoutes.post('/register', userRegisterCtrl);
userRoutes.post('/login', userLoginCtrl);
userRoutes.get('/', userFetchCtrl);
userRoutes.delete('/:id', userDeleteCtrl);

module.exports = { userRoutes };
