const FAQ = require('../models/FAQ');
const HeroSlide = require('../models/HeroSlide');
const Settings = require('../models/Settings');

// FAQ
const getFAQs = async (req, res) => {
  const faqs = await FAQ.find({});
  res.json(faqs);
};

const createFAQ = async (req, res) => {
  const { question, answer } = req.body;
  const faq = new FAQ({ question, answer });
  const createdFAQ = await faq.save();
  res.status(201).json(createdFAQ);
};

// Hero Slides
const getHeroSlides = async (req, res) => {
  const slides = await HeroSlide.find({ isActive: true });
  res.json(slides);
};

const createHeroSlide = async (req, res) => {
  const { image, title, subtitle, link } = req.body;
  const slide = new HeroSlide({ image, title, subtitle, link });
  const createdSlide = await slide.save();
  res.status(201).json(createdSlide);
};

// Settings
const getSettings = async (req, res) => {
  const settings = await Settings.findOne({});
  res.json(settings);
};

const updateSettings = async (req, res) => {
  const { shippingCost, freeShippingAbove, storeEmail, whatsappNumber } = req.body;
  let settings = await Settings.findOne({});

  if (settings) {
    settings.shippingCost = shippingCost;
    settings.freeShippingAbove = freeShippingAbove;
    settings.storeEmail = storeEmail;
    settings.whatsappNumber = whatsappNumber;
  } else {
    settings = new Settings({
      shippingCost,
      freeShippingAbove,
      storeEmail,
      whatsappNumber,
    });
  }

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
};

module.exports = {
  getFAQs,
  createFAQ,
  getHeroSlides,
  createHeroSlide,
  getSettings,
  updateSettings,
};
