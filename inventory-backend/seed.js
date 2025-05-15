const mongoose = require('mongoose');
const Product = require('./models/Product');
const Dealer = require('./models/Dealer');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/inventoryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  seedData();
}).catch((err) => {
  console.error(err);
});

async function seedData() {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Dealer.deleteMany({});

    // Create dealers
    const dealers = await Dealer.insertMany([
      { name: 'Dealer 1' },
      { name: 'Dealer 2' },
    ]);

    console.log('Dealers created');

    // Create 10 sample products (pending)
    const sampleProducts = Array.from({ length: 10 }).map((_, i) => ({
      barcode: `PRD${1000 + i}`,
      status: 'pending',
    }));

    await Product.insertMany(sampleProducts);
    console.log('Sample products created');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}
