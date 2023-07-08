const express = require('express');
const {
  getAllTours,
  createTour,
  getATour,
  updateATour,
  deleteATour,
  aliasTop5Tours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
// const { createReview } = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Nested Routes
// POST /tour/123456/reviews
// Get /tour/123456/reviews
// Get /tour/123456/reviews/098765

router.use('/:tourId/reviews', reviewRouter);

// Param parameter of Router has a handler, and it accepts req, res, next and val as parameters
// router.param('id', checkID);

// Aliasing
router.route('/top-5-cheap-tours').get(aliasTop5Tours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getATour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateATour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteATour);

// Nested Routes
// POST /tour/123456/reviews
// Get /tour/123456/reviews
// Get /tour/123456/reviews/098765

// removing this below line and used the express use for nested route. Please check above code which takes you to reviewRouter
// router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview);

module.exports = router;
