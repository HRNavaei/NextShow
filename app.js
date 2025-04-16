import express from 'express';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';

import globalErrorHandler from './src/utils/global-error-handler.js';
import roomsRouter from './src/routes/rooms.js';
import moviesRouter from './src/routes/movies.js';
import usersRouter from './src/routes/users.js';

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/movie-posters', express.static('public/movie-posters'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/movie-posters');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

app.post('/api/v1/uploadMoviePoster', upload.single('image'), (req, res) => {
  const filePath = `/movie-posters/${req.file.filename}`;

  res.status(201).json({
    status: 'success',
    data: {
      imageUrl: filePath,
    },
  });
});

app.use('/api/v1/rooms', roomsRouter);

app.use('/api/v1/movies', moviesRouter);

app.use('/api/v1/users', usersRouter);

app.use(globalErrorHandler);

export default app;
