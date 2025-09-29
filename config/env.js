import dotenv from "dotenv";

dotenv.config(); // with this we are populating process.env with variables from .env file and we dont have to call dotenv.config() in other files

const env = {
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 8888,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_DIR: process.env.LOG_DIR || 'logs',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

export default env;
