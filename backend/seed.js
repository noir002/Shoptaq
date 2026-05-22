const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Sale = require('./models/Sale');

const connectDB = require('./config/db');

const categories = [
  'Apparel & Accessories',
  'Health & Wellness',
  'Home Essentials',
  'Outdoor & Fitness',
  'Beauty & Personal Care',
  'Office & Workspace',
  'Gourmet & Pantry',
  'Tech & Gadgets',
];

const sampleProducts = [
  { title: 'Meridian Performance Blazer', category: 'Apparel & Accessories', price: 228.00, stock: 34, description: 'Tailored stretch wool blend blazer engineered for all-day wear and travel.', tags: ['blazer', 'meridian', 'professional', 'fw25'], rating: 4.8, soldCount: 142, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400' },
  { title: 'Summit Cold Brew Starter Kit', category: 'Gourmet & Pantry', price: 64.50, stock: 88, description: 'Glass carafe, reusable filter, and single-origin beans for café-quality cold brew.', tags: ['coffee', 'cold-brew', 'kitchen', 'gift'], rating: 4.7, soldCount: 521, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400' },
  { title: 'Horizon Smart Body Composition Scale', category: 'Health & Wellness', price: 119.99, stock: 56, description: 'Wi-Fi enabled scale with trend tracking and multi-user household profiles.', tags: ['scale', 'wellness', 'connected', 'health'], rating: 4.6, soldCount: 298, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400' },
  { title: 'Alpine Trail Pack 42L', category: 'Outdoor & Fitness', price: 189.00, stock: 19, description: 'Ventilated back panel, hydration compatible, and reinforced base for multi-day hikes.', tags: ['backpack', 'hiking', 'outdoor', '42l'], rating: 4.9, soldCount: 167, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { title: 'Executive Leather Portfolio', category: 'Office & Workspace', price: 145.00, stock: 41, description: 'Full-grain leather folio with document sleeve and magnetic closure.', tags: ['portfolio', 'leather', 'office', 'executive'], rating: 4.8, soldCount: 203, image: 'https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=400' },
  { title: 'Lumina Vitamin C Brightening Serum', category: 'Beauty & Personal Care', price: 42.00, stock: 6, description: '15% stabilized vitamin C formula for even tone and daily radiance.', tags: ['serum', 'skincare', 'vitamin-c', 'lumina'], rating: 4.7, soldCount: 612, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400' },
  { title: 'Atlas Merino Quarter-Zip', category: 'Apparel & Accessories', price: 98.00, stock: 72, description: 'Fine-gauge merino layer with flatlock seams and odor-resistant finish.', tags: ['merino', 'layering', 'atlas', 'apparel'], rating: 4.8, soldCount: 445, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400' },
  { title: 'Nordic Linen Sheet Set — Queen', category: 'Home Essentials', price: 156.00, stock: 28, description: 'Stone-washed European flax linen in a breathable four-piece queen set.', tags: ['linen', 'bedding', 'home', 'queen'], rating: 4.9, soldCount: 334, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' },
  { title: 'Pulse Wireless ANC Earbuds', category: 'Tech & Gadgets', price: 179.99, stock: 47, description: 'Hybrid active noise cancellation with multipoint Bluetooth and 32-hour case life.', tags: ['earbuds', 'audio', 'anc', 'wireless'], rating: 4.6, soldCount: 389, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { title: 'Carbon Fiber Standing Desk Riser', category: 'Office & Workspace', price: 329.00, stock: 11, description: 'Electric lift desk converter with memory presets and cable management tray.', tags: ['desk', 'ergonomic', 'standing', 'workspace'], rating: 4.5, soldCount: 78, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400' },
  { title: 'Coastal Sea Salt Candle Trio', category: 'Home Essentials', price: 48.00, stock: 95, description: 'Hand-poured soy candles in coastal cedar, sea salt, and driftwood notes.', tags: ['candles', 'home', 'gift', 'soy'], rating: 4.7, soldCount: 478, image: 'https://images.unsplash.com/photo-1608181831718-c9a7b19b4a44?w=400' },
  { title: 'Velocity Carbon Running Shoe', category: 'Outdoor & Fitness', price: 164.00, stock: 2, description: 'Responsive foam midsole and engineered mesh upper for race-day performance.', tags: ['running', 'footwear', 'velocity', 'carbon'], rating: 4.8, soldCount: 256, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { title: 'Artisan Dark Chocolate Gift Box', category: 'Gourmet & Pantry', price: 38.50, stock: 120, description: 'Twelve single-origin dark chocolate squares with tasting notes card.', tags: ['chocolate', 'gift', 'artisan', 'gourmet'], rating: 4.9, soldCount: 701, image: 'https://images.unsplash.com/photo-1549007953-4f282517f1bf?w=400' },
  { title: 'Studio Pro USB-C Hub 7-in-1', category: 'Tech & Gadgets', price: 89.00, stock: 63, description: 'HDMI 4K, SD readers, and 100W pass-through charging for modern laptops.', tags: ['hub', 'usb-c', 'productivity', 'tech'], rating: 4.6, soldCount: 412, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400' },
  { title: 'Renewal Retinol Night Cream', category: 'Beauty & Personal Care', price: 58.00, stock: 4, description: 'Encapsulated retinol with peptide complex for overnight skin renewal.', tags: ['retinol', 'night-cream', 'skincare', 'renewal'], rating: 4.7, soldCount: 289, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400' },
  { title: 'Heritage Stoneware Dinner Set — 16pc', category: 'Home Essentials', price: 212.00, stock: 15, description: 'Matte glaze stoneware service for four with stackable, dishwasher-safe pieces.', tags: ['dinnerware', 'stoneware', 'kitchen', 'heritage'], rating: 4.8, soldCount: 134, image: 'https://images.unsplash.com/photo-1603199506018-ee9c4a1a0b6c?w=400' },
  { title: 'ProBalance Yoga Block Set', category: 'Outdoor & Fitness', price: 32.00, stock: 156, description: 'High-density EVA blocks with antimicrobial grip surface and carry strap.', tags: ['yoga', 'fitness', 'blocks', 'wellness'], rating: 4.5, soldCount: 567, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' },
  { title: 'Silk Recovery Sleep Mask', category: 'Beauty & Personal Care', price: 24.00, stock: 198, description: '22-momme mulberry silk mask with adjustable strap for light-blocking rest.', tags: ['sleep', 'silk', 'recovery', 'beauty'], rating: 4.6, soldCount: 823, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400' },
  { title: 'Smart Garden Herb Grow Kit', category: 'Gourmet & Pantry', price: 79.00, stock: 0, description: 'Countertop LED grow system with basil, thyme, and mint seed pods included.', tags: ['herbs', 'smart-garden', 'kitchen', 'indoor'], rating: 4.4, soldCount: 156, image: 'https://images.unsplash.com/photo-1416879595882-3373a0488b5d?w=400' },
  { title: 'Monarch Titanium Reading Glasses', category: 'Apparel & Accessories', price: 54.00, stock: 7, description: 'Featherweight titanium frames with blue-light filtering lenses.', tags: ['eyewear', 'reading', 'titanium', 'monarch'], rating: 4.7, soldCount: 198, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbbce1b?w=400' },
];

const generateSalesData = async (products) => {
  const sales = [];
  const now = new Date();

  for (const product of products) {
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
    console.log('Starting database seed…');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});
    console.log('Cleared existing data');

    const admin = await User.create({
<<<<<<< HEAD
      name: 'Admin User',
=======
      name: 'Operations Lead',
>>>>>>> 9f55e72
      email: 'admin@shoptaq.com',
      password: 'password123',
      role: 'admin',
    });
    console.log(`Created admin: ${admin.email}`);

    const products = await Product.insertMany(sampleProducts);
    console.log(`Created ${products.length} SKUs`);

    const salesData = await generateSalesData(products);
    await Sale.insertMany(salesData);
    console.log(`Created ${salesData.length} transaction records`);

<<<<<<< HEAD
    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Email:    admin@shoptaq.com');
    console.log('🔑 Admin Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
=======
    console.log('\nDatabase seeded successfully');
    console.log('Admin Email:    admin@shoptaq.com');
    console.log('Admin Password: password123\n');
>>>>>>> 9f55e72

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
