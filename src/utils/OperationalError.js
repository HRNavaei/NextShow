export const errorList = {
  // Room-related errors
  ROOM_NOT_FOUND: {
    statusCode: 404,
    message: 'No room found with the provided room id',
  },
  ROOM_NAME_REQUIRED: {
    statusCode: 400,
    message: 'Please provide the room name',
  },
  ROOM_COLUMNS_COUNTS_REQUIRED: {
    statusCode: 400,
    message: 'Please provide the number of seat columns in the room',
  },
  // Movie-related errors
  MOVIE_NOT_FOUND: {
    statusCode: 404,
    message: 'No movie found with the provided movie id',
  },
  MOVIE_ROOM_REQUIRED: {
    statusCode: 400,
    message: 'Please provide the room the movie will be shown in',
  },
  MOVIE_TITLE_REQUIRED: {
    statusCode: 400,
    message: 'Please provide the movie title',
  },
  MOVIE_DATE_TIME_REQUIRED: {
    statusCode: 400,
    message: 'Please provide the date and time of the movie',
  },
  INVALID_DATE_TIME: {
    statusCode: 400,
    message: 'Please provide a valid date and time for the movie',
  },
  BOOKED_ROW_REQUIRED: {
    statusCode: 400,
    message: 'Please provide the row number of the seat you are booking.',
  },
  BOOKED_COLUMN_REQUIRED: {
    statusCode: 400,
    message: 'Please provide the column number of the seat you are booking',
  },
  USER_DOUBLE_BOOKING: {
    statusCode: 400,
    message: 'You can not book two seats for a movie',
  },
  SEAT_ALREADY_BOOKED: {
    statusCode: 400,
    message: 'The seat you are trying to book is not available',
  },
  ROOM_OCCUPIED: {
    statusCode: 400,
    message: 'The room is already occupied at the selected date and time',
  },
  // User-related errors
  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'No user found with provided user id',
  },
  USER_NAME_REQUIRED: {
    statusCode: 400,
    message: 'Please provide your name',
  },
  NAME_LESS_THAN_TWO_CHARS: {
    statusCode: 400,
    message: 'User name must be at least two characters',
  },
  USER_EMAIL_REQUIRED: {
    statusCode: 400,
    message: 'Please provide your email',
  },
  DUPLICATE_KEY: {
    statusCode: 400,
    message: 'One or more unique values already exist',
  },
  INVALID_EMAIL: {
    statusCode: 400,
    message: 'Please provide a valid email',
  },
  USER_PASSWORD_REQUIRED: {
    statusCode: 400,
    message: 'Please provide your password',
  },
  INCORRECT_EMAIL_OR_PASS: {
    statusCode: 401,
    message: 'Incorrect email or password',
  },
  NOT_LOGGED_IN: {
    statusCode: 401,
    message: 'You are not logged in! Please login first',
  },
  PASSWORD_MIN_6: {
    statusCode: 400,
    message: 'Password must be at least 6 characters long',
  },
  // Booking-related errors
  MOVIE_REQUIRED_FOR_BOOKING: {
    statusCode: 400,
    message: 'Please provide the movie you are booking for',
  },
  BOOKING_SEAT_ROW_REQUIRED: {
    statusCode: 400,
    message: 'Please provide the row number of the seat you are booking for',
  },
  BOOKING_SEAT_COLUMN_REQUIRED: {
    statusCode: 400,
    message: 'Please provide the column number of the seat you are booking for',
  },
  ROW_OUT_RANGE: {
    statusCode: 400,
    message:
      'The selected row must be between 1 and the available number of seat rows',
  },
  COLUMN_OUT_RANGE: {
    statusCode: 400,
    message:
      'The selected column must be between 1 and the available number of seat columns',
  },
  ROW_OR_COLUMN_NOT_NUMBER: {
    statusCode: 400,
    message: 'Please provide the seat row and column in numeric format',
  },
  // Other errors
  INVALID_PATH_PARAM: {
    statusCode: 400,
    message: 'Invalid parameter passed as a path parameter',
  },
  INVALID_QUERY_PARAM: {
    statusCode: 400,
    message: 'Invalid parameter passed as a query parameter',
  },
  VALIDATION_ERROR: {
    statusCode: 400,
    message: 'Validation error',
  },
  ACCESS_DENIED: {
    statusCode: 401,
    message: 'You do not have permission to access this resource',
  },
};

class OperationalError extends Error {
  constructor(errorCode, customErrorMessage) {
    const errorObj = errorList[errorCode];
    const errorMessage = customErrorMessage ?? errorObj.message;

    super(errorMessage);
    this.statusCode = errorObj.statusCode;
    this.errorCode = errorCode;
    this.status = 'fail';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default OperationalError;
