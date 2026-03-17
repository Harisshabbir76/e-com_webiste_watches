const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  replyToMessage,
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(sendMessage).get(protect, admin, getMessages);
router.post('/:id/reply', protect, admin, replyToMessage);

module.exports = router;
