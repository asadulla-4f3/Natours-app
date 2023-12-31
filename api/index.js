/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/errorController');

// 2. Route handlers
const tourRouter = require('../routes/tourRoutes');
const userRouter = require('../routes/userRoutes');
const reviewRouter = require('../routes/reviewRoutes');
const viewRouter = require('../routes/viewRoutes');

const app = express();

// Sets view engine as pug
app.set('view engine', 'pug');

// Sets static view files path
app.set('views', path.join(__dirname, '/../views'));

// 1. Global middlewares

app.use(cors());

app.options('*', cors());
// Serving static files
app.use(express.static(path.join(__dirname, '/../public')));

// set security http headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // one hour
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // middleware
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution other than whitelist
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// creating our own middleware
/*
app.use((req, res, next) => {
  next();
});
*/

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getATour);
// app.patch('/api/v1/tours/:id', updateATour);
// app.delete('/api/v1/tours/:id', deleteATour);

// 3. Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
