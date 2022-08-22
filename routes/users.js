const express = require('express');

const usersRouter = express.Router();
const { getUsers, createUser, getUserId } = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUserId);

usersRouter.post('/users', express.json(), createUser);

module.exports = usersRouter;
