const { db } = require('../database');
const crypto = require('crypto');

// Helper to hash password with SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Login handler
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const hashedPassword = hashPassword(password);

  db.get(
    'SELECT * FROM farmers WHERE email = ? AND password = ?',
    [email, hashedPassword],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
      // Return user info (exclude password from response for security best practices)
      const { password: _, ...user } = row;
      res.json(user);
    }
  );
};

// Register handler
exports.register = (req, res) => {
  const {
    name,
    location,
    email,
    password,
    phone,
    numberOfTrees,
    yearsOfExperience,
    specialization,
    bio
  } = req.body;

  if (!name || !location || !email || !password || !numberOfTrees || !yearsOfExperience) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const hashedPassword = hashPassword(password);
  const treesVal = parseInt(numberOfTrees);
  const expVal = parseInt(yearsOfExperience);

  // Check if email already exists
  db.get('SELECT id FROM farmers WHERE email = ?', [email], (err, exists) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (exists) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    db.run(
      `INSERT INTO farmers (name, location, email, password, phone, numberOfTrees, yearsOfExperience, specialization, bio, rating, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, location, email, hashedPassword, phone, treesVal, expVal, specialization || 'General', bio || '', 4.5, 'Active'],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        const newFarmerId = this.lastID;

        // Seed default farm stats for the new farmer
        db.run(
          `INSERT INTO farmStats (farmerId, totalTrees, totalHarvest, totalRevenue, treeHealth, soilMoisture, harvestProgress, storageCapacity)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [newFarmerId, treesVal, 0.0, 0.0, 90.0, 70.0, 0.0, 0.0],
          (statsErr) => {
            if (statsErr) {
              console.error('Error creating default farm stats for new farmer:', statsErr);
            }
            
            res.status(201).json({
              id: newFarmerId,
              name,
              location,
              email,
              phone,
              numberOfTrees: treesVal,
              yearsOfExperience: expVal,
              specialization: specialization || 'General',
              bio: bio || '',
              rating: 4.5,
              status: 'Active'
            });
          }
        );
      }
    );
  });
};
