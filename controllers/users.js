const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const Error401 = require('../errors/error401');
const Error404 = require('../errors/error404');

const addUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name, email, password: hash,
    });
    res.send({
      name, email, id: newUser._id,
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error404('Пользователь с указанным id не найден');

    const { name, email } = req.body;
    const newUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );
    res.send(newUser);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error401('Неправильные почта или пароль');

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) throw new Error401('Неправильные почта или пароль');

    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) throw new Error404('Пользователь с указанным id не найден');

    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addUser, updateUser, login, getUserMe,
};
