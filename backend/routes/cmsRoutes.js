const express = require('express');
const router = express.Router();
const {
  getFAQs,
  createFAQ,
  getHeroSlides,
  createHeroSlide,
  getSettings,
  updateSettings,
} = require('../controllers/cmsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/faqs').get(getFAQs).post(protect, admin, createFAQ);
router.route('/hero').get(getHeroSlides).post(protect, admin, createHeroSlide);
router.route('/settings').get(getSettings).put(protect, admin, updateSettings);

module.exports = router;
