const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllReviews,
  writeReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });
// mergeParams enabled because we need to use other routes params as well as per the nested routes

// these were used as nested routes as POST or GET /tour/:tourId/reviews
// Nested Routes
// POST /tour/123456/reviews
// Get /tour/123456/reviews
// Get /tour/123456/reviews/098765

// Get /reviews
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), writeReview);

module.exports = router;
