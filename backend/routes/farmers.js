const { db } = require('../database');

// Get all farmers
exports.getAllFarmers = (req, res) => {
  db.all('SELECT * FROM farmers ORDER BY rating DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Get farmer by ID
exports.getFarmerById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM farmers WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Farmer not found' });
      return;
    }
    res.json(row);
  });
};

// Create new farmer
exports.createFarmer = (req, res) => {
  const {
    name,
    location,
    email,
    phone,
    numberOfTrees,
    yearsOfExperience,
    specialization,
    bio
  } = req.body;

  if (!name || !location || !numberOfTrees || !yearsOfExperience) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  db.run(
    `INSERT INTO farmers (name, location, email, phone, numberOfTrees, yearsOfExperience, specialization, bio, rating, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, location, email, phone, numberOfTrees, yearsOfExperience, specialization, bio, 4.5, 'Active'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        name,
        location,
        email,
        phone,
        numberOfTrees,
        yearsOfExperience,
        specialization,
        bio,
        rating: 4.5,
        status: 'Active'
      });
    }
  );
};

// Update farmer
exports.updateFarmer = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Build dynamic update query
  const fields = [];
  const values = [];
  
  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
  
  fields.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);

  const query = `UPDATE farmers SET ${fields.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Farmer not found' });
      return;
    }
    res.json({ message: 'Farmer updated successfully', id });
  });
};

// Delete farmer
exports.deleteFarmer = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM farmers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Farmer not found' });
      return;
    }
    res.json({ message: 'Farmer deleted successfully' });
  });
};

// Search farmers by name or location
exports.searchFarmers = (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    res.status(400).json({ error: 'Search query required' });
    return;
  }

  const searchTerm = `%${query}%`;
  db.all(
    `SELECT * FROM farmers 
     WHERE name LIKE ? OR location LIKE ? OR specialization LIKE ? 
     ORDER BY rating DESC`,
    [searchTerm, searchTerm, searchTerm],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get farmer dashboard stats
exports.getFarmerStats = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM farmStats WHERE farmerId = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Farm stats not found' });
      return;
    }
    res.json(row);
  });
};

// Update farmer stats
exports.updateFarmerStats = (req, res) => {
  const { id } = req.params;
  const { totalTrees, totalHarvest, totalRevenue, treeHealth, soilMoisture, harvestProgress, storageCapacity } = req.body;

  db.run(
    `INSERT INTO farmStats (farmerId, totalTrees, totalHarvest, totalRevenue, treeHealth, soilMoisture, harvestProgress, storageCapacity)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(farmerId) DO UPDATE SET 
       totalTrees = excluded.totalTrees,
       totalHarvest = excluded.totalHarvest,
       totalRevenue = excluded.totalRevenue,
       treeHealth = excluded.treeHealth,
       soilMoisture = excluded.soilMoisture,
       harvestProgress = excluded.harvestProgress,
       storageCapacity = excluded.storageCapacity,
       updatedAt = CURRENT_TIMESTAMP`,
    [id, totalTrees, totalHarvest, totalRevenue, treeHealth, soilMoisture, harvestProgress, storageCapacity],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Farm stats updated successfully' });
    }
  );
};
