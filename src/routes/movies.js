import express from 'express';

import * as moviesController from '../controllers/movies.js';
import * as authController from '../controllers/auth.js';

const router = new express.Router();

router
  .route('/')
  .get(moviesController.getAllMovies)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    moviesController.addMovie,
  );

router
  .route('/:id')
  .get(moviesController.getMovie)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    moviesController.updateMovie,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    moviesController.deleteMovie,
  );

router
  .route('/:id/booked-seats')
  .post(authController.protect, moviesController.bookASeat);

export default router;
