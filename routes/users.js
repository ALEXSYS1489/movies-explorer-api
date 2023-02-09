const express = require('express');
const { celebrate, Joi } = require('celebrate');

const users = express.Router();
const {
  updateUser, getUserMe,
} = require('../controllers/users');

users.get('/me', getUserMe);

users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = users;
