const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Category = require('./models/Category');

const checkCategory = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const catId = '69b7081a50c7150cdb1cbf4a';
    const cat = await Category.findById(catId);
    console.log(`Category ${catId}:`, cat ? 'EXISTS' : 'NOT FOUND');
    if (cat) console.log('Category Data:', JSON.stringify(cat, null, 2));
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkCategory();
