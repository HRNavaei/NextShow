import mongoose from 'mongoose';

import Room from './Room.js';

const movieSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'MOVIE_ROOM_REQUIRED'],
    validate: {
      validator: async function (room) {
        return await Room.exists(room);
      },
      message: 'ROOM_NOT_FOUND',
    },
  },
  title: {
    type: String,
    required: [true, 'MOVIE_TITLE_REQUIRED'],
    validate: {
      validator: function (name) {
        return name.length > 2;
      },
    },
  },
  poster: {
    type: String,
    default: 'public/movie-posters/default-poster.jpg',
  },
  dateAndTime: {
    type: Date,
    required: [true, 'MOVIE_DATE_TIME_REQUIRED'],
  },
  /*
   * The two fields below store a snapshot of the room's row and column counts
   * at the time the movie is created. They are automatically populated
   * from the associated Room document via a pre-save hook.
   * Manually setting these values is unnecessary and will be overridden.
   */
  seatRowCounts: {
    type: Number,
    immutable: true,
  },
  seatColumnCounts: {
    type: Number,
    immutable: true,
  },
  bookedSeats: [
    {
      row: { type: Number, required: [true, 'BOOKED_ROW_REQUIRED'] },
      column: { type: Number, required: [true, 'BOOKED_COLUMN_REQUIRED'] },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
});

movieSchema.pre('save', async function (next) {
  if (!this.isNew) return;

  const associatedRoom = await Room.findById(this.room);

  this.seatRowCounts = associatedRoom.seatRowCounts;
  this.seatColumnCounts = associatedRoom.seatColumnCounts;

  next();
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
