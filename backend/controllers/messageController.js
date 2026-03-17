const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  const newMessage = new Message({
    name,
    email,
    subject,
    message,
  });

  const createdMessage = await newMessage.save();
  res.status(201).json(createdMessage);
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 });
  res.json(messages);
};

// @desc    Reply to a message
// @route   POST /api/messages/:id/reply
// @access  Private/Admin
const replyToMessage = async (req, res) => {
  const { reply } = req.body;
  const message = await Message.findById(req.params.id);

  if (message) {
    message.reply = reply;
    message.isReplied = true;
    message.isRead = true;

    const updatedMessage = await message.save();
    
    // Send email using nodemailer
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: message.email,
      replyTo: process.env.EMAIL_USER,
      subject: `Re: ${message.subject}`,
      text: reply,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Reply from iWrist Watches</h2>
        <p>${reply.replace(/\n/g, '<br>')}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated reply from iWrist Watches support.
        </p>
      </div>`
    });
    
    console.log(`Email sent to ${message.email}`);
    
    
    res.json(updatedMessage);
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  replyToMessage,
};
