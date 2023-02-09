const express = require('express');
const users = require('./users');
const movies = require('./movies');
const auth = require('../middlewares/auth');
const Error404 = require('../errors/error404');

const routes = express.Router();

routes.use('/users', auth, users);
routes.use('/movies', auth, movies);
routes.use('/*', auth, () => {
  throw new Error404('Страница не найдена');
});

module.exports = routes;
