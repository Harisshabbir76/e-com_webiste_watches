let stripe;
try {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} catch (error) {
  console.log('Stripe not configured in stripeController - checkout disabled (check STRIPE_SECRET_KEY in .env)');
  stripe = null;
}
const Order = require('../models/Order');

// @desc    Create checkout session
// @route   POST /api/stripe/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ message: 'Stripe not configured' });
  }

  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (order) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'pkr',
            product_data: {
              name: 'Watch Order',
              metadata: {
                orderId: order._id.toString()
              }
            },
            unit_amount: Math.round(order.totalPrice * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/order/${order._id}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/checkout?cancelled=true`,
        metadata: {
          orderId: order._id.toString()
        }
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Stripe session error:', error);
      res.status(500).json({ message: 'Payment setup failed' });
    }
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Create Payment Intent for embedded card form
// @route   POST /api/stripe/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ message: 'Stripe not configured' });
  }

  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId).populate('user', 'email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Stripe uses smallest unit
      currency: 'pkr',
      metadata: {
        orderId: order._id.toString(),
      },
      // Optional: Add customer if user logged in
      // customer: order.user?.stripeCustomerId,
    });

    res.json({ 
      client_secret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('PaymentIntent creation error:', error);
    res.status(500).json({ message: 'Payment setup failed' });
  }
};

module.exports = { 
  createCheckoutSession, 
  createPaymentIntent 
};
