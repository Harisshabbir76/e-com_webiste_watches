const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Product = require('./models/Product');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const count = await Product.countDocuments();
    console.log(`Total Products: ${count}`);
    
    if (count > 0) {
      const p = await Product.findOne();
      console.log('Sample Product:', JSON.stringify(p, null, 2));
    }
    
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkDB();
