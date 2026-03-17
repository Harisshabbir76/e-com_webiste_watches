const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
  {
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
    },
    freeShippingAbove: {
      type: Number,
      required: true,
      default: 0,
    },
    storeEmail: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
