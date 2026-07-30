const mongoose = require('mongoose');
const Banner = require('./models/Banner');
const config = require('./config/config');

async function seedBanner() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to DB');

    const newBanner = new Banner({
      title: 'Summer Tech Sale',
      subtitle: 'Up to 50% Off on Latest Gadgets',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf6d973145?auto=format&fit=crop&q=80&w=2000&h=800',
      link: '/products?category=electronics',
      isActive: true,
    });

    await newBanner.save();
    console.log('Banner created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating banner:', error);
    process.exit(1);
  }
}

seedBanner();
