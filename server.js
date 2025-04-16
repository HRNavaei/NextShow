import mongoose from 'mongoose';
import config from './config.js';
import app from './app.js';

await mongoose.connect(config.DB_URI);
console.log('🚀 Successfully connected to database.');

app.listen(config.PORT, () => console.log('🚀 Listening on port 3000.'));
