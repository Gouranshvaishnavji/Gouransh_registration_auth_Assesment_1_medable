import dotenv from "dotenv";

dotenv.config(); // with this we are populating process.env with variables from .env file and we dont have to call dotenv.config() in other files

const env = {
  JWT_SECRET: process.env.JWT_SECRET ,
};

export default env;
