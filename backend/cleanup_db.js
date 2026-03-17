const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Product = require('./models/Product');

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await Product.deleteMany({ name: 'Sample Name' });
    console.log(`Deleted ${result.deletedCount} sample products.`);
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

cleanup();
