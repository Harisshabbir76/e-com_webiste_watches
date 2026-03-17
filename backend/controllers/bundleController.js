const Bundle = require('../models/Bundle');

// @desc    Get all bundles
// @route   GET /api/bundles
// @access  Public
const getBundles = async (req, res) => {
  const bundles = await Bundle.find({}).populate('products');
  res.json(bundles);
};

// @desc    Create a bundle
// @route   POST /api/bundles
// @access  Private/Admin
const createBundle = async (req, res) => {
  const { name, description, products, price, image } = req.body;

  const bundle = new Bundle({
    name,
    description,
    products,
    price,
    image,
  });

  const createdBundle = await bundle.save();
  res.status(201).json(createdBundle);
};

// @desc    Delete a bundle
// @route   DELETE /api/bundles/:id
// @access  Private/Admin
const deleteBundle = async (req, res) => {
  const bundle = await Bundle.findById(req.params.id);

  if (bundle) {
    await Bundle.deleteOne({ _id: bundle._id });
    res.json({ message: 'Bundle removed' });
  } else {
    res.status(404).json({ message: 'Bundle not found' });
  }
};

module.exports = { getBundles, createBundle, deleteBundle };
