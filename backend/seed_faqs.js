const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const FAQ = require('./models/FAQ');

const seedFAQs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await FAQ.countDocuments();
    
    if (count === 0) {
      const sampleFAQs = [
        { 
          question: "Are your watches authentic?", 
          answer: "Yes, we only sell 100% authentic timepieces sourced directly from authorized distributors. Each watch comes with its original box, papers, and manufacturer warranty." 
        },
        { 
          question: "What is your return policy?", 
          answer: "We offer a 14-day return policy for unused watches in their original condition. Please refer to our returns page for full details and instructions." 
        },
        { 
          question: "How long is the shipping time?", 
          answer: "Standard shipping typically takes 3-5 business days within the country. International shipping varies by location but usually takes 7-14 business days." 
        },
        { 
          question: "Do you offer a warranty?", 
          answer: "Every watch we sell is covered by the manufacturer's international warranty, which usually ranges from 2 to 5 years depending on the brand." 
        }
      ];
      await FAQ.insertMany(sampleFAQs);
      console.log('Sample FAQs seeded successfully!');
    } else {
      console.log(`Found ${count} existing FAQs.`);
    }
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

seedFAQs();
