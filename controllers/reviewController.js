const Review = require('../models/reviewModel');
// const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  // 1) Execute the query

  // Passing filter means we are finding the particular tour reviews
  const reviews = await Review.find(filter);

  if (!reviews || !reviews.length) {
    return next(new AppError('No reviews till yet!', 404));
  }

  // 2) SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews: reviews },
  });
});

exports.writeReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  // 1) Execute query
  const newTour = await Review.create(req.body);

  // 2) SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: { reviews: newTour },
  });
});
