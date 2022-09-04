const express = require('express');

const usersRouter = express.Router();

const {
  getUsers,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUserId);

usersRouter.patch('/users/me', updateUser);

usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;
