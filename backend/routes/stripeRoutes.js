const express = require('express');
const router = express.Router();
const { createCheckoutSession, createPaymentIntent } = require('../controllers/stripeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-checkout-session', protect, createCheckoutSession);

router.post('/create-payment-intent', protect, createPaymentIntent);

module.exports = router;
