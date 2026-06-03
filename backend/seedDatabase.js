const { db } = require('./database');

// Sample farmer data
const farmers = [
  {
    name: 'Adebayo Adeyemi',
    location: 'Ondo State, Nigeria',
    email: 'adebayo@cashewfarm.ng',
    phone: '+234 801 234 5678',
    numberOfTrees: 450,
    yearsOfExperience: 5,
    rating: 4.8,
    totalHarvest: 1.2,
    specialization: 'Organic Raw Cashew',
    bio: 'Experienced cashew farmer specializing in organic farming practices. Member of the Nigeria Cashew Farmers Association.',
    transactionCount: 128
  },
  {
    name: 'Emmanuel Okafor',
    location: 'Enugu State, Nigeria',
    email: 'emmanuel@premiumcashews.ng',
    phone: '+234 803 456 7890',
    numberOfTrees: 820,
    yearsOfExperience: 8,
    rating: 4.9,
    totalHarvest: 2.8,
    specialization: 'Export Grade',
    bio: 'Top-rated cashew producer with 8 years of experience. Expert in large-scale commercial farming and export-grade processing.',
    transactionCount: 256
  },
  {
    name: 'Mariam Bello',
    location: 'Kwara State, Nigeria',
    email: 'mariam@greenfarm.ng',
    phone: '+234 805 678 9012',
    numberOfTrees: 320,
    yearsOfExperience: 3,
    rating: 4.6,
    totalHarvest: 0.9,
    specialization: 'Sustainable Farming',
    bio: 'Young and innovative farmer focusing on sustainable farming methods and community development.',
    transactionCount: 67
  },
  {
    name: 'Kwame Asante',
    location: 'Ashanti Region, Ghana',
    email: 'kwame@goldcoastcashew.gh',
    phone: '+233 24 123 4567',
    numberOfTrees: 200,
    yearsOfExperience: 2,
    rating: 4.5,
    totalHarvest: 0.5,
    specialization: 'Premium Quality',
    bio: 'New to the platform but growing fast. Passionate about quality cashew production.',
    transactionCount: 23
  },
  {
    name: 'Fatima Ndiaye',
    location: 'Kolda Region, Senegal',
    email: 'fatima@senegalcashew.sn',
    phone: '+221 77 123 4567',
    numberOfTrees: 680,
    yearsOfExperience: 10,
    rating: 4.9,
    totalHarvest: 2.1,
    specialization: 'Export & Processing',
    bio: 'Veteran cashew farmer with over a decade of experience. Leading exporter to European markets.',
    transactionCount: 312
  },
  {
    name: 'Samuel Osei',
    location: 'Central Region, Ghana',
    email: 'samuel@goldcashew.gh',
    phone: '+233 27 987 6543',
    numberOfTrees: 540,
    yearsOfExperience: 7,
    rating: 4.7,
    totalHarvest: 1.6,
    specialization: 'By-products & Oil',
    bio: 'Specialized in cashew shell oil production and by-product utilization.',
    transactionCount: 189
  }
];

// Sample products
const products = [
  {
    name: 'Raw Cashew Nuts',
    category: 'raw',
    price: 3.50,
    quantity: 5000,
    unit: 'kg',
    origin: 'West Africa',
    grade: 'A+ Premium',
    minOrder: 100,
    description: 'Premium grade, organic raw cashew nuts'
  },
  {
    name: 'Roasted Cashews',
    category: 'processed',
    price: 8.00,
    quantity: 2000,
    unit: 'kg',
    origin: 'West Africa',
    grade: 'A',
    minOrder: 50,
    description: 'Salted, honey & plain roasted cashews'
  },
  {
    name: 'Cashew Butter',
    category: 'processed',
    price: 12.00,
    quantity: 500,
    unit: 'jar',
    origin: 'West Africa',
    grade: 'A+',
    minOrder: 10,
    description: '100% pure, smooth cashew butter'
  },
  {
    name: 'Cashew Milk',
    category: 'processed',
    price: 4.50,
    quantity: 1000,
    unit: 'liter',
    origin: 'West Africa',
    grade: 'A',
    minOrder: 25,
    description: 'Unsweetened, organic cashew milk'
  },
  {
    name: 'Cashew Apple Juice',
    category: 'raw',
    price: 5.00,
    quantity: 800,
    unit: 'liter',
    origin: 'West Africa',
    grade: 'A',
    minOrder: 20,
    description: 'Fresh, natural cashew apple juice'
  },
  {
    name: 'Cashew Shell Oil',
    category: 'raw',
    price: 2.80,
    quantity: 3000,
    unit: 'kg',
    origin: 'West Africa',
    grade: 'Industrial',
    minOrder: 200,
    description: 'Industrial grade cashew shell oil'
  },
  {
    name: 'Cashew Flour',
    category: 'processed',
    price: 6.50,
    quantity: 1200,
    unit: 'kg',
    origin: 'West Africa',
    grade: 'A',
    minOrder: 25,
    description: 'Gluten-free, fine cashew flour'
  },
  {
    name: 'Dried Cashew Apple',
    category: 'raw',
    price: 4.00,
    quantity: 600,
    unit: 'kg',
    origin: 'West Africa',
    grade: 'A',
    minOrder: 15,
    description: 'Sun-dried, chewy dried cashew apple'
  }
];

// Seed the database
function seedDatabase() {
  db.serialize(() => {
    // Check if data already exists
    db.get('SELECT COUNT(*) as count FROM farmers', (err, row) => {
      if (err) {
        console.error('Error checking farmers:', err);
        return;
      }

      if (row.count === 0) {
        console.log('Seeding farmers...');
        const stmt = db.prepare(`
          INSERT INTO farmers (name, location, email, password, phone, numberOfTrees, yearsOfExperience, rating, totalHarvest, specialization, bio, transactionCount)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        farmers.forEach(farmer => {
          stmt.run(
            farmer.name,
            farmer.location,
            farmer.email,
            'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // SHA-256 for 'password123'
            farmer.phone,
            farmer.numberOfTrees,
            farmer.yearsOfExperience,
            farmer.rating,
            farmer.totalHarvest,
            farmer.specialization,
            farmer.bio,
            farmer.transactionCount
          );
        });
        stmt.finalize();
        console.log('Farmers seeded successfully');
      }
    });

    // Seed products
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) {
        console.error('Error checking products:', err);
        return;
      }

      if (row.count === 0) {
        console.log('Seeding products...');
        const stmt = db.prepare(`
          INSERT INTO products (name, category, price, quantity, unit, origin, grade, minOrder, description)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        products.forEach(product => {
          stmt.run(
            product.name,
            product.category,
            product.price,
            product.quantity,
            product.unit,
            product.origin,
            product.grade,
            product.minOrder,
            product.description
          );
        });
        stmt.finalize();
        console.log('Products seeded successfully');
      }
    });

    // Seed farm stats for first farmer
    db.get('SELECT COUNT(*) as count FROM farmStats', (err, row) => {
      if (err) {
        console.error('Error checking farm stats:', err);
        return;
      }

      if (row.count === 0) {
        console.log('Seeding farm stats...');
        db.run(`
          INSERT INTO farmStats (farmerId, totalTrees, totalHarvest, totalRevenue, treeHealth, soilMoisture, harvestProgress, storageCapacity)
          VALUES (1, 2450, 5.2, 84000, 92, 68, 75, 45)
        `, (err) => {
          if (err) console.error('Error seeding farm stats:', err);
          else console.log('Farm stats seeded successfully');
        });
      }
    });
  });
}

// Run seeding
setTimeout(seedDatabase, 500);

module.exports = { seedDatabase };
