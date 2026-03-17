const express = require('express');
const router = express.Router();
const { getBundles, createBundle, deleteBundle } = require('../controllers/bundleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getBundles).post(protect, admin, createBundle);
router.route('/:id').delete(protect, admin, deleteBundle);

module.exports = router;
