require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');

const { PORT = 3000 } = process.env;

const app = express();
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  createUser,
  login,
} = require('./controllers/users');

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });

    await app.listen(PORT, () => {
      console.log(`Сервер запущен на localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(/^(https?:\/\/)?([\da-z.-]+)([a-z.]{2,6})([/\w.-]*)*\/?$/),
  }),
}), createUser);

app.use(auth);

app.use('/', require('./routes/cards'));

app.use('/', require('./routes/users'));

app.use('*', require('./routes/notFountPath'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
