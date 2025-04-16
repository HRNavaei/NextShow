import express from 'express';

import * as roomsController from '../controllers/rooms.js';
import * as authController from '../controllers/auth.js';

const router = new express.Router();

router
  .route('/')
  .get(roomsController.getAllRooms)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    roomsController.addRoom,
  );

router
  .route('/:id')
  .get(roomsController.getRoom)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    roomsController.updateRoom,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    roomsController.deleteRoom,
  );

router.route('/:id/movies').get(roomsController.getRoomMovies);

export default router;
