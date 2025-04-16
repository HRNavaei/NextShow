import express from 'express';

import * as authController from '../controllers/auth.js';
import * as userController from '../controllers/users.js';

const router = new express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin'));

router.route('/sign-up').post(authController.signUp);

router.route('/sign-in').post(authController.signIn);

router
  .route('/change-role')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.changeRole,
  );

router
  .route('/my-profile')
  .get(authController.protect, userController.getMyProfile);

export default router;
