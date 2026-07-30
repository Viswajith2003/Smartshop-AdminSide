const mongoose = require('mongoose');
const Banner = require('./models/Banner');
const config = require('./config/config');

async function updateBanner() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to DB');

    const result = await Banner.updateOne(
      { title: 'Summer Tech Sale' },
      { $set: { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000&h=800' } }
    );
    console.log('Banner updated successfully', result);
    process.exit(0);
  } catch (error) {
    console.error('Error updating banner:', error);
    process.exit(1);
  }
}

updateBanner();
