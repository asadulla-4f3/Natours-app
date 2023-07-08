const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getReview,
} = require('../controllers/reviewController');
const { setTourUserIds } = require('../controllers/tourController');

const router = express.Router({ mergeParams: true });
// mergeParams enabled because we need to use other routes params as well as per the nested routes

// these were used as nested routes as POST or GET /tour/:tourId/reviews
// Nested Routes
// POST /tour/123456/reviews
// Get /tour/123456/reviews
// Get /tour/123456/reviews/098765

router.use(protect);
// Get /reviews
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
