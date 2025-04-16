import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'ROOM_NAME_REQUIRED'],
  },
  seatRowCounts: {
    type: Number,
    required: [true, 'ROOM_ROW_COUNTS_REQUIRED'],
  },
  seatColumnCounts: {
    type: Number,
    required: [true, 'ROOM_COLUMNS_COUNTS_REQUIRED'],
  },
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
