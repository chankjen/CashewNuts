const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Farmers table
    db.run(`
      CREATE TABLE IF NOT EXISTS farmers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT,
        email TEXT UNIQUE,
        password TEXT DEFAULT 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
        phone TEXT,
        numberOfTrees INTEGER,
        yearsOfExperience INTEGER,
        rating REAL DEFAULT 4.5,
        totalHarvest REAL DEFAULT 0,
        specialization TEXT,
        bio TEXT,
        status TEXT DEFAULT 'Active',
        transactionCount INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating farmers table:', err);
      else console.log('Farmers table initialized');
    });

    // Products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        price REAL NOT NULL,
        quantity INTEGER DEFAULT 0,
        unit TEXT,
        origin TEXT,
        grade TEXT,
        minOrder INTEGER,
        inStock BOOLEAN DEFAULT 1,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating products table:', err);
      else console.log('Products table initialized');
    });

    // Listings table (for farmers selling products)
    db.run(`
      CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        farmerId INTEGER,
        productName TEXT,
        quantity INTEGER,
        pricePerUnit REAL,
        minOrder INTEGER,
        status TEXT DEFAULT 'Active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(farmerId) REFERENCES farmers(id)
      )
    `, (err) => {
      if (err) console.error('Error creating listings table:', err);
      else console.log('Listings table initialized');
    });

    // Orders table (for marketplace trades)
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        buyerId INTEGER,
        sellerId INTEGER,
        productName TEXT,
        quantity INTEGER,
        pricePerUnit REAL,
        totalPrice REAL,
        orderType TEXT,
        status TEXT DEFAULT 'Pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(buyerId) REFERENCES farmers(id),
        FOREIGN KEY(sellerId) REFERENCES farmers(id)
      )
    `, (err) => {
      if (err) console.error('Error creating orders table:', err);
      else console.log('Orders table initialized');
    });

    // Farming logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS farmingLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        farmerId INTEGER,
        block TEXT,
        activity TEXT,
        description TEXT,
        quantity REAL,
        unit TEXT,
        status TEXT DEFAULT 'Completed',
        date DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(farmerId) REFERENCES farmers(id)
      )
    `, (err) => {
      if (err) console.error('Error creating farming logs table:', err);
      else console.log('Farming logs table initialized');
    });

    // Farm stats table
    db.run(`
      CREATE TABLE IF NOT EXISTS farmStats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        farmerId INTEGER,
        totalTrees INTEGER,
        totalHarvest REAL,
        totalRevenue REAL,
        treeHealth REAL,
        soilMoisture REAL,
        harvestProgress REAL,
        storageCapacity REAL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(farmerId) REFERENCES farmers(id)
      )
    `, (err) => {
      if (err) console.error('Error creating farm stats table:', err);
      else console.log('Farm stats table initialized');
    });
  });
}

module.exports = { db, initializeDatabase };
