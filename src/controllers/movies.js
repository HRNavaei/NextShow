import mongoose from 'mongoose';

import Movie from '../models/Movie.js';
import wrapAsyncMiddleware from '../utils/wrap-async-middleware.js';
import OperationalError from '../utils/OperationalError.js';

const areIdsValid = (...ids) => {
  for (const id of ids) if (!mongoose.Types.ObjectId.isValid(id)) return false;
  return true;
};

export const addMovie = wrapAsyncMiddleware(async (req, res, next) => {
  const { room, title, poster, date, time } = req.body;

  const { year, month, day } = date;
  const { hour, minute } = time;

  const isValidDateAndTime =
    typeof year === 'number' &&
    typeof month === 'number' &&
    typeof day === 'number' &&
    typeof hour === 'number' &&
    typeof minute === 'number';

  if (!isValidDateAndTime) throw new OperationalError('INVALID_DATE_TIME');

  const dateAndTime = new Date(
    date.year,
    date.month - 1,
    date.day,
    time.hour,
    time.minute,
  );

  const isRoomOccupied = await Movie.exists({ room, dateAndTime });
  if (isRoomOccupied) throw new OperationalError('ROOM_OCCUPIED');

  const movie = await Movie.create({
    room,
    title,
    poster,
    dateAndTime,
  });

  res.status(201).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

export const getAllMovies = wrapAsyncMiddleware(async (req, res, next) => {
  const movies = await Movie.find();

  res.status(200).json({
    status: 'success',
    data: {
      movies,
    },
  });
});

export const getMovie = wrapAsyncMiddleware(async (req, res, next) => {
  const movieId = req.params.id;
  if (!areIdsValid(movieId)) throw new OperationalError('INVALID_PATH_PARAM');

  const movie = await Movie.findById(movieId).populate(
    'bookedSeats.user',
    'email',
  );

  if (!movie) throw new OperationalError('MOVIE_NOT_FOUND');

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

export const updateMovie = wrapAsyncMiddleware(async (req, res, next) => {
  const movieId = req.params.id;
  if (!areIdsValid(movieId)) throw new OperationalError('INVALID_PATH_PARAM');

  const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedMovie) throw new OperationalError('MOVIE_NOT_FOUND');

  res.status(200).json({
    status: 'success',
    data: {
      movie: updatedMovie,
    },
  });
});

export const deleteMovie = wrapAsyncMiddleware(async (req, res, next) => {
  const movieId = req.params.id;
  if (!areIdsValid(movieId)) throw new OperationalError('INVALID_PATH_PARAM');

  const movie = await Movie.findByIdAndDelete(movieId);
  if (!movie) throw new OperationalError('MOVIE_NOT_FOUND');

  res.status(204).send();
});

export const bookASeat = wrapAsyncMiddleware(async (req, res, next) => {
  const movieId = req.params.id;
  const userId = req.user._id.toString();

  if (!areIdsValid(movieId)) throw new OperationalError('INVALID_PATH_PARAM');

  const { seatRow, seatColumn } = req.body;
  if (!(typeof seatRow === 'number' && typeof seatColumn === 'number'))
    throw new OperationalError('ROW_OR_COLUMN_NOT_NUMBER');

  const { seatRowCounts, seatColumnCounts, bookedSeats } = await Movie.findById(
    movieId,
    'seatRowCounts seatColumnCounts bookedSeats',
  );

  if (seatRow <= 0 || seatRow > seatRowCounts)
    throw new OperationalError('ROW_OUT_RANGE');
  if (seatColumn <= 0 || seatColumn > seatColumnCounts)
    throw new OperationalError('COLUMN_OUT_RANGE');

  if (bookedSeats.some((bookedSeat) => bookedSeat.user.toString() === userId)) {
    throw new OperationalError('USER_DOUBLE_BOOKING');
  }
  if (
    bookedSeats.some(
      (bookedSeat) =>
        bookedSeat.row === seatRow && bookedSeat.column === seatColumn,
    )
  ) {
    throw new OperationalError('SEAT_ALREADY_BOOKED');
  }

  const updatedMovie = await Movie.findByIdAndUpdate(
    movieId,
    {
      $push: {
        bookedSeats: { row: seatRow, column: seatColumn, user: userId },
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedMovie) throw new OperationalError('MOVIE_NOT_FOUND');

  res.status(200).json({
    status: 'success',
    data: {
      seatRow,
      seatColumn,
    },
  });
});
