import dotenv, { config } from 'dotenv';

dotenv.config({ path: './.env' });

export default {
  NODE_ENV: config.NODE_ENV,
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
