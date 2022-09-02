const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorServer, errorBadReq, reqNotFound } = require('../errors/errorCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(errorServer).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(reqNotFound).send({ message: 'Пользователя с таким id нет' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorBadReq).send({ message: 'Передан некорректный id' });
        return;
      }
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }).then((user) => res.send(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorBadReq).send({ message: 'Некорректные данные пользователя' });
        return;
      }
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorBadReq).send({ message: 'Некорректные данные пользователя' });
        return;
      }
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorBadReq).send({ message: 'Некорректные данные аватара' });
        return;
      }
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    });
};
/*
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorBadReq).send({ message: 'Некорректные данные аватара' });
        return;
      }
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    });
}; */
