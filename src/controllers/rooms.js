import mongoose from 'mongoose';

import Room from '../models/Room.js';
import Movie from '../models/Movie.js';
import wrapAsyncMiddleware from '../utils/wrap-async-middleware.js';
import OperationalError from '../utils/OperationalError.js';

const areIdsValid = (...ids) => {
  for (const id of ids) if (!mongoose.Types.ObjectId.isValid(id)) return false;
  return true;
};

export const addRoom = wrapAsyncMiddleware(async (req, res, next) => {
  const { name, seatRowCounts, seatColumnCounts } = req.body;

  const room = await Room.create({
    name,
    seatRowCounts,
    seatColumnCounts,
  });

  res.status(201).json({
    status: 'success',
    data: {
      room,
    },
  });
});

export const getAllRooms = wrapAsyncMiddleware(async (req, res, next) => {
  const rooms = await Room.find();

  res.status(200).json({
    status: 'success',
    data: {
      rooms,
    },
  });
});

export const getRoom = wrapAsyncMiddleware(async (req, res, next) => {
  const roomId = req.params.id;
  if (!areIdsValid(roomId)) throw new OperationalError('INVALID_PATH_PARAM');

  const room = await Room.findById(roomId);

  if (!room) throw new OperationalError('ROOM_NOT_FOUND');

  res.status(200).json({
    status: 'success',
    data: {
      room,
    },
  });
});

export const updateRoom = wrapAsyncMiddleware(async (req, res, next) => {
  const roomId = req.params.id;
  if (!areIdsValid(roomId)) throw new OperationalError('INVALID_PATH_PARAM');

  const updatedRoom = await Room.findByIdAndUpdate(roomId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedRoom) throw new OperationalError('ROOM_NOT_FOUND');

  res.status(200).json({
    status: 'success',
    data: {
      room: updatedRoom,
    },
  });
});

export const deleteRoom = wrapAsyncMiddleware(async (req, res, next) => {
  const roomId = req.params.id;
  if (!areIdsValid(roomId)) throw new OperationalError('INVALID_PATH_PARAM');

  const room = await Room.findByIdAndDelete(roomId);
  if (!room) throw new OperationalError('ROOM_NOT_FOUND');

  const result = await Movie.deleteMany({ room: roomId });

  res.status(200).json({
    status: 'success',
    message: `The selected room and its ${result.deletedCount} associated movie(s) have been deleted`,
  });
});

export const getRoomMovies = wrapAsyncMiddleware(async (req, res, next) => {
  const roomId = req.params.id;
  if (!areIdsValid(roomId)) throw new OperationalError('INVALID_PATH_PARAM');

  const isRoomExisted = await Room.exists({ _id: roomId });

  if (!isRoomExisted) throw new OperationalError('ROOM_NOT_FOUND');

  const movies = await Movie.find({ room: roomId }, 'title poster dateAndTime');

  res.status(200).json({
    status: 'success',
    data: {
      movies,
    },
  });
});
