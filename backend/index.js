const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const webhookRoutes = require('./routes/webhookRoutes'); // Fixed Stripe error below
const bundleRoutes = require('./routes/bundleRoutes');
const discountRoutes = require('./routes/discountRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');

// Connect to database
connectDB();

const app = express();

// Stripe Webhook (must be before express.json() for raw body)
app.use('/api/webhook/stripe', webhookRoutes);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/messages', messageRoutes);
console.log('Messages routes mounted at /api/messages');
app.use('/api/subscribers', subscriberRoutes);

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
