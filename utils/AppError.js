// this is our error object extension class so we can set message and status code with throw new AppError("message", 400)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500; // well 500 is default
    this.isOperational = true; // it will be helping in distinguishing from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;