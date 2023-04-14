const Movie = require('../models/movie');
const User = require('../models/user');

const Error403 = require('../errors/error403');
const Error404 = require('../errors/error404');

const getMovies = async (req, res, next) => {
  try {
    const owner = await User.findById(req.user._id);
    if (!owner) throw new Error404('Пользователь не найден');

    const movies = await Movie.find({ owner }).populate('owner');
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

const addMovie = async (req, res, next) => {
  try {
    const newMovie = await new Movie({ ...req.body, owner: req.user._id }).populate('owner');
    res.send(await newMovie.save());
  } catch (err) {
    next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) throw new Error404('Фильм с указанным id не найден');
    if (!movie.owner._id.equals(req.user._id)) throw new Error403('Нельзя удалять фильмы других пользователей');

    await Movie.findByIdAndRemove(req.params.movieId);
    res.send(movie);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMovies, addMovie, deleteMovie,
};
