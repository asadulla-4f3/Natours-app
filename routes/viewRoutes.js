const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
} = require('../controllers/viewController');
const { isLoggedIn, protect } = require('../controllers/authController');

const router = express.Router();

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);

// /login
router.get('/login', isLoggedIn, getLoginForm);
// /me
router.get('/me', protect, getAccount);

// submit user data
// WITHOUT API
// router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
