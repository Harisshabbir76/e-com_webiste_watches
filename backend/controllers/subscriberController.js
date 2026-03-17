const Subscriber = require('../models/Subscriber');

// @desc    Add subscriber
// @route   POST /api/subscribers
// @access  Public
const addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = new Subscriber({
      email,
    });

    const createdSubscriber = await subscriber.save();
    res.status(201).json(createdSubscriber);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
const getSubscribers = async (req, res) => {
  const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
  res.json(subscribers);
};

module.exports = {
  addSubscriber,
  getSubscribers,
};
