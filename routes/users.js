const express = require('express');

const usersRouter = express.Router();

const {
  getUsers,
  createUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUserId);

usersRouter.post('/users', createUser);

usersRouter.patch('/users/me', updateUser);

usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;
