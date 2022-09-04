require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;

const app = express();
const { auth } = require('./middlewares/auth');

const {
  createUser,
  login,
} = require('./controllers/users');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT, () => {
    console.log(`Сервер запущен на localhost:${PORT}`);
  });
}

main();

app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth);

app.use('/', require('./routes/cards'));

app.use('/', require('./routes/users'));

app.use('*', require('./routes/notFountPath'));
