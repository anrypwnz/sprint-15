require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const app = express();
const cards = require('./routes/cards.js');
const users = require('./routes/users.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Successful connection to mestodb');
});
mongoose.connection.on('error', (err) => {
  console.log('error', err);
  process.exit(1);
});

app.use(requestLogger);
app.use(cards);
app.use(users);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.all('*', (req, res, next) => {
  res.status(404).send({ 'message': 'Запрашиваемый ресурс не найден' });
  next();
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => console.log('Connected to port:', PORT));
