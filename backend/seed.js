const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Sale = require('./models/Sale');

const connectDB = require('./config/db');

const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys', 'Food & Beverage'];

const sampleProducts = [
  { title: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 149.99, stock: 45, description: 'Premium audio experience with 30-hour battery life and active noise cancellation.', tags: ['headphones', 'wireless', 'audio', 'noise-cancelling'], rating: 4.8, soldCount: 234, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { title: 'Smart Fitness Tracker Pro', category: 'Electronics', price: 89.99, stock: 78, description: 'Track your health metrics 24/7 with heart rate, sleep, and GPS monitoring.', tags: ['fitness', 'smartwatch', 'health', 'tracker'], rating: 4.5, soldCount: 389, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400' },
  { title: 'Premium Leather Backpack', category: 'Fashion', price: 199.99, stock: 23, description: 'Handcrafted genuine leather backpack with laptop compartment and USB charging port.', tags: ['backpack', 'leather', 'laptop bag', 'fashion'], rating: 4.9, soldCount: 156, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { title: 'Ergonomic Office Chair', category: 'Home & Garden', price: 349.99, stock: 12, description: 'Lumbar support, adjustable armrests, and breathable mesh back for all-day comfort.', tags: ['office chair', 'ergonomic', 'furniture', 'home office'], rating: 4.7, soldCount: 89, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400' },
  { title: 'Professional Yoga Mat Set', category: 'Sports', price: 59.99, stock: 134, description: 'Non-slip, eco-friendly yoga mat with carrying strap and alignment guides.', tags: ['yoga', 'fitness', 'mat', 'exercise'], rating: 4.6, soldCount: 512, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' },
  { title: 'Vitamin C Serum 30ml', category: 'Beauty', price: 34.99, stock: 8, description: 'Brightening serum with 20% pure Vitamin C for radiant, glowing skin.', tags: ['serum', 'vitamin c', 'skincare', 'brightening'], rating: 4.8, soldCount: 678, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400' },
  { title: 'Mechanical Keyboard RGB', category: 'Electronics', price: 129.99, stock: 56, description: 'Tactile blue switches with per-key RGB lighting and aluminum frame.', tags: ['keyboard', 'mechanical', 'gaming', 'rgb'], rating: 4.7, soldCount: 301, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400' },
  { title: 'Stainless Steel Water Bottle', category: 'Sports', price: 29.99, stock: 203, description: 'Double-wall insulated 32oz bottle keeps drinks cold 24h or hot 12h.', tags: ['water bottle', 'insulated', 'hydration', 'eco-friendly'], rating: 4.9, soldCount: 892, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' },
  { title: 'Scented Soy Candle Set', category: 'Home & Garden', price: 44.99, stock: 67, description: 'Set of 3 hand-poured soy wax candles in lavender, vanilla, and cedarwood.', tags: ['candles', 'home decor', 'aromatherapy', 'gift'], rating: 4.6, soldCount: 445, image: 'https://images.unsplash.com/photo-1608181831718-c9a7b19b4a44?w=400' },
  { title: '4K Drone with Camera', category: 'Electronics', price: 499.99, stock: 7, description: '4K HDR camera drone with 30-min flight time, obstacle avoidance, and 5km range.', tags: ['drone', '4k', 'photography', 'aerial'], rating: 4.5, soldCount: 67, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400' },
  { title: 'Bamboo Cutting Board Set', category: 'Home & Garden', price: 39.99, stock: 89, description: 'Set of 3 eco-friendly bamboo cutting boards with juice groove and handle.', tags: ['cutting board', 'kitchen', 'bamboo', 'eco-friendly'], rating: 4.7, soldCount: 334, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { title: 'Running Shoes Ultra Lite', category: 'Sports', price: 119.99, stock: 3, description: 'Lightweight responsive foam cushioning for marathon training and everyday runs.', tags: ['running shoes', 'sport', 'lightweight', 'athletic'], rating: 4.8, soldCount: 223, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { title: 'Silk Sleep Mask', category: 'Beauty', price: 19.99, stock: 145, description: 'Pure mulberry silk eye mask for deeper, more restful sleep.', tags: ['sleep mask', 'silk', 'eye mask', 'sleep'], rating: 4.5, soldCount: 567, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400' },
  { title: 'Portable Bluetooth Speaker', category: 'Electronics', price: 79.99, stock: 34, description: 'Waterproof 360° sound speaker with 20-hour battery and built-in microphone.', tags: ['speaker', 'bluetooth', 'portable', 'waterproof'], rating: 4.6, soldCount: 412, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
  { title: 'Plant-Based Protein Powder', category: 'Food & Beverage', price: 54.99, stock: 91, description: '25g protein per serving, chocolate flavor, no artificial sweeteners.', tags: ['protein', 'vegan', 'supplement', 'plant-based'], rating: 4.4, soldCount: 289, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400' },
  { title: 'Minimalist Wall Clock', category: 'Home & Garden', price: 49.99, stock: 5, description: 'Silent quartz movement, 12-inch brushed metal face, no ticking sound.', tags: ['wall clock', 'minimalist', 'home decor', 'modern'], rating: 4.7, soldCount: 178, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { title: 'LEGO Architecture Set', category: 'Toys', price: 79.99, stock: 28, description: 'Build iconic world landmarks with this 800-piece detailed architecture set.', tags: ['lego', 'architecture', 'building', 'collectible'], rating: 4.9, soldCount: 134, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400' },
  { title: 'French Press Coffee Maker', category: 'Food & Beverage', price: 34.99, stock: 72, description: '34oz borosilicate glass French press with double-wall stainless steel filter.', tags: ['coffee', 'french press', 'coffee maker', 'kitchen'], rating: 4.8, soldCount: 456, image: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=400' },
  { title: 'Leather Minimalist Wallet', category: 'Fashion', price: 49.99, stock: 4, description: 'Slim 4-card RFID-blocking genuine leather wallet, available in 5 colors.', tags: ['wallet', 'leather', 'minimalist', 'rfid'], rating: 4.6, soldCount: 321, image: 'https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=400' },
  { title: 'Smart LED Desk Lamp', category: 'Electronics', price: 69.99, stock: 0, description: 'Touch-controlled desk lamp with color temperature adjustment and USB charging port.', tags: ['desk lamp', 'led', 'smart', 'lighting'], rating: 4.5, soldCount: 198, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
];

const generateSalesData = async (products) => {
  const sales = [];
  const now = new Date();

  for (const product of products) {
    // Generate 2-8 sales per product over last 12 months
    const numSales = Math.floor(Math.random() * 7) + 2;
    for (let i = 0; i < numSales; i++) {
      const daysAgo = Math.floor(Math.random() * 365);
      const saleDate = new Date(now);
      saleDate.setDate(saleDate.getDate() - daysAgo);

      const quantity = Math.floor(Math.random() * 10) + 1;
      sales.push({
        product: product._id,
        productTitle: product.title,
        productCategory: product.category,
        quantity,
        revenue: quantity * product.price,
        date: saleDate,
      });
    }
  }

  return sales;
};

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sage.com',
      password: 'password123',
      role: 'admin',
    });
    console.log(`👤 Created admin user: ${admin.email}`);

    // Create products
    const products = await Product.insertMany(sampleProducts);
    console.log(`📦 Created ${products.length} products`);

    // Generate and create sales
    const salesData = await generateSalesData(products);
    await Sale.insertMany(salesData);
    console.log(`💰 Created ${salesData.length} sales records`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Email:    admin@sage.com');
    console.log('🔑 Admin Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
