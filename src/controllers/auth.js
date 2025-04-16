import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import OperationalError from './../utils/OperationalError.js';
import User from './../models/User.js';
import wrapAsyncMiddleware from './../utils/wrap-async-middleware.js';
import config from '../../config.js';

export const signUp = wrapAsyncMiddleware(async (req, res, next) => {
  // 1. Declare a proper user object based on the provided data
  const userFields = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: 'user',
  };

  let newUser;
  try {
    newUser = await User.create(userFields);
  } catch (err) {
    if (err.code === 11000) throw handleUserDuplicateError(err);
    throw err;
  }
  // 3. Generate the JWT
  const token = jwt.sign({ id: newUser.id }, config.JWT_SECRET);

  // 4. Send the proper response containing the token
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const signIn = wrapAsyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Find user and check if a user with the provided email exists
  const user = await User.findOne({ email });
  if (!user) throw new OperationalError('INCORRECT_EMAIL_OR_PASS');

  // 2. Check if the provided password is correct
  const isPasswordVerified = await user.verifyPassword(password);
  if (!isPasswordVerified)
    throw new OperationalError('INCORRECT_EMAIL_OR_PASS');

  // 3. Generate the JWT
  const token = jwt.sign({ id: user.id }, config.JWT_SECRET);

  // 4. Send the proper response containing the token
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

export const protect = wrapAsyncMiddleware(async (req, res, next) => {
  // 1. Getting the JWT token from the headers and check if it's provided
  const tokenHeader = req.headers.authorization;
  let token;
  if (tokenHeader && tokenHeader.startsWith('Bearer ')) {
    token = tokenHeader.split(' ')[1];
  } else {
    throw new OperationalError('NOT_LOGGED_IN');
  }

  // 2. Verifying the token
  let decodedToken;
  try {
    decodedToken = await promisify(jwt.verify)(token, config.JWT_SECRET);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new OperationalError('NOT_LOGGED_IN');
    }
  }

  // 3. Fetching the user document from database after authentication
  const user = await User.findById(decodedToken.id);

  req.user = user;
  next();
});

export const restrictTo = (role) => {
  return wrapAsyncMiddleware(async (req, res, next) => {
    if (req.user.role === role) next();
    else throw new OperationalError('ACCESS_DENIED');
  });
};

function handleUserDuplicateError(err) {
  const uniqueProperties = err.keyValue;
  const revisedErr = new OperationalError('DUPLICATE_KEY');
  revisedErr.errors = [];

  if (
    // This condition ensures the error is specifically due to a duplicate email field
    Object.keys(uniqueProperties).length === 1 &&
    'email' in uniqueProperties
  ) {
    const message = `The email address "${uniqueProperties.email}" already exists.`;
    revisedErr.errors.push({
      isCompound: false,
      uniqueField: 'email',
      message,
    });
  }

  return revisedErr;
}
