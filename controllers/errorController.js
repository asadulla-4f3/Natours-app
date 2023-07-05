const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  //   console.log('\n--->>', err.errmsg, '<---err.errmsg\n');
  //   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use a different value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  const message = `Invalid token. Please login again`;
  return new AppError(message, 401);
};
const handleJWTExpiredError = () => {
  const message = 'Token has expired. Please login again';
  return new AppError(message, 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('Error 🔥', err);
    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack, '\n');
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(process.env.NODE_ENV, '\n');

  if (process.env.NODE_ENV === 'development') {
    console.log(err, '<---err object before sendErrorDev');
    // console.log('\n--->>', err.errmsg, '<---err.errmsg\n');
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error;
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    } else if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    } else if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(err);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    } else {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      error = { message: err.message, ...err };
      //   error = Object.assign(err); // This is not the same as above line
    }
    console.log(error, '<---error object before sendErrorProd');
    sendErrorProd(error, res);
  }
};
