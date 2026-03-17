const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  // Price range filter
  const filter = {};
  if (req.query.priceMin) {
    filter.price = { $gte: Number(req.query.priceMin) };
  }
  if (req.query.priceMax) {
    if (!filter.price) filter.price = {};
    filter.price.$lte = Number(req.query.priceMax);
  }

  // Strap material filter
  if (req.query.strapMaterial) {
    const strapMaterials = Array.isArray(req.query.strapMaterial) ? req.query.strapMaterial : [req.query.strapMaterial];
    filter.strapMaterial = { $in: strapMaterials };
  }

  const sort = req.query.sort === 'price-low' 
    ? { price: 1 } 
    : req.query.sort === 'price-high' 
    ? { price: -1 } 
    : { createdAt: -1 };

  const count = await Product.countDocuments({ ...keyword, ...category, ...filter });
  const products = await Product.find({ ...keyword, ...category, ...filter })
    .populate('category')
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    model,
    category,
    countInStock,
    movementType,
    strapMaterial,
    caseDiameter,
    waterResistance,
    isFeatured,
    variants,
  } = req.body;

  const product = new Product({
    name,
    price,
    user: req.user._id,
    brand,
    model,
    category,
    countInStock,
    description,
    movementType,
    strapMaterial,
    caseDiameter,
    waterResistance,
    images,
    isFeatured: isFeatured || false,
    variants: variants || [],
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    model,
    category,
    countInStock,
    movementType,
    strapMaterial,
    caseDiameter,
    waterResistance,
    isFeatured,
    variants,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.images = images;
    product.brand = brand;
    product.model = model;
    product.category = category;
    product.countInStock = countInStock;
    product.movementType = movementType;
    product.strapMaterial = strapMaterial;
    product.caseDiameter = caseDiameter;
    product.waterResistance = waterResistance || product.waterResistance;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.variants = variants || product.variants || [];

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Public (Allowing public reviews for now as per "customer can give stars and write review")
const createProductReview = async (req, res) => {
  const { rating, comment, name } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const review = {
      name: name || 'Anonymous Store Customer',
      rating: Number(rating),
      comment,
      user: req.user ? req.user._id : null,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
