const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const ErrorBadReq = require('../errors/errorBadReq');
const ReqNotFound = require('../errors/reqNotFound');
const EroorExistingUser = require('../errors/errorExistingUser');
const NotAuthError = require('../errors/notAuthError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new ReqNotFound('Пользователя с таким id нет');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorBadReq('Передан некорректный id');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
        throw new ErrorBadReq('Некорректные данные пользователя');
      }
      if (err.code === 11000) {
        throw new EroorExistingUser('Пользователь с таким email существует');
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrorBadReq('Некорректные данные пользователя');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrorBadReq('Некорректные данные аватара');
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const decoded = jwt.decode(req.cookies.jwt);
  const id = decoded._id;

  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAuthError('Неправильный пароль или email');
      }
      bcrypt.compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign({
              _id: user._id,
            }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

            res.cookie('jwt', token, { httpOnly: true, samSite: true });
            res.send({ data: user.toJSON() });
          } else {
            res.status(401).send({ message: 'Неправильный пароль или email' });
          }
        });
    })
    .catch(next);
};
