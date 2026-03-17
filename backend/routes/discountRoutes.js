const express = require('express');
const router = express.Router();
const { getDiscounts, validateDiscount, createDiscount } = require('../controllers/discountController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getDiscounts).post(protect, admin, createDiscount);
router.route('/:code').get(validateDiscount);

module.exports = router;
