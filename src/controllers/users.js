import OperationalError from '../utils/OperationalError.js';
import User from './../models/User.js';
import wrapAsyncMiddleware from '../utils/wrap-async-middleware.js';

export const getMyProfile = wrapAsyncMiddleware(async (req, res, next) => {
  const user = {
    name: req.user.name,
    email: req.user.email,
  };
  if (req.user.role === 'admin') {
    user.admin = true;
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Admin specific features
export const changeRole = wrapAsyncMiddleware(async (req, res, next) => {
  const userEmail = req.body.email;
  const targetRole = req.body.role;

  const updatedUser = await User.findOneAndUpdate(
    { email: userEmail },
    { role: targetRole },
    { runValidators: true, new: true },
  );

  if (!updatedUser) throw new OperationalError('USER_NOT_FOUND');

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});
