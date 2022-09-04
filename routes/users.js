const express = require('express');

const usersRouter = express.Router();

const {
  getUsers,
  getUserId,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/me', getUser);

usersRouter.get('/users/:userId', getUserId);

usersRouter.patch('/users/me', updateUser);

usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;
