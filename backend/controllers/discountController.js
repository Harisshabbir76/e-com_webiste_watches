const Discount = require('../models/Discount');

// @desc    Get all discounts
// @route   GET /api/discounts
// @access  Private/Admin
const getDiscounts = async (req, res) => {
  const discounts = await Discount.find({});
  res.json(discounts);
};

// @desc    Validate discount code
// @route   GET /api/discounts/:code
// @access  Public
const validateDiscount = async (req, res) => {
  const discount = await Discount.findOne({
    code: req.params.code,
    isActive: true,
    expiryDate: { $gt: Date.now() },
  });

  if (discount) {
    res.json(discount);
  } else {
    res.status(404).json({ message: 'Invalid or expired discount code' });
  }
};

// @desc    Create a discount
// @route   POST /api/discounts
// @access  Private/Admin
const createDiscount = async (req, res) => {
  const { code, discountPercentage, expiryDate, minPurchase } = req.body;

  const discount = new Discount({
    code,
    discountPercentage,
    expiryDate,
    minPurchase,
  });

  const createdDiscount = await discount.save();
  res.status(201).json(createdDiscount);
};

module.exports = { getDiscounts, validateDiscount, createDiscount };
