const express = require('express');

const usersRouter = express.Router();

const {
  getUsers,
  createUser,
  getUserId,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUserId);

usersRouter.patch('/users/me', updateUser);

usersRouter.patch('/users/me/avatar', updateAvatar);

usersRouter.post('/signup', createUser);

usersRouter.post('/signin', login);

module.exports = usersRouter;
