const mongoose = require('mongoose');
const Banner = require('./models/Banner');
const config = require('./config/config');

const BANNERS_DATA = [
  {
    title: 'Next-Gen\nElectronics',
    subtitle: 'Upgrade your lifestyle with premium tech',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000&h=800',
    link: '/products?category=electronics',
    isActive: true,
  },
  {
    title: 'Minimalist\nEssentials',
    subtitle: 'Curated additions for your home & life',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000&h=800',
    link: '/products',
    isActive: true,
  },
  {
    title: 'Refresh Your\nWardrobe',
    subtitle: 'Discover the latest trends with up to 40% off',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000&h=800',
    link: '/products?category=fashion',
    isActive: true,
  },
  {
    title: 'Smart\nHome Living',
    subtitle: 'Automate your life with smart devices',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=2000&h=800',
    link: '/products?category=electronics',
    isActive: true,
  }
];

async function seedBanners() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to DB');

    // Optional: Clear existing banners if you want exactly 4, or just add them.
    // We will clear them first to avoid duplicates
    await Banner.deleteMany({});
    console.log('Cleared existing banners');

    await Banner.insertMany(BANNERS_DATA);
    console.log('Successfully seeded 4 banners');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding banners:', error);
    process.exit(1);
  }
}

seedBanners();
