const { db } = require('../database');

// Get all farming logs
exports.getAllFarmingLogs = (req, res) => {
  db.all('SELECT * FROM farmingLogs ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Get farming logs by farmer
exports.getFarmerFarmingLogs = (req, res) => {
  const { farmerId } = req.params;
  
  db.all(
    'SELECT * FROM farmingLogs WHERE farmerId = ? ORDER BY date DESC',
    [farmerId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get farming log by ID
exports.getFarmingLogById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM farmingLogs WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Farming log not found' });
      return;
    }
    res.json(row);
  });
};

// Create farming log
exports.createFarmingLog = (req, res) => {
  const {
    farmerId,
    block,
    activity,
    description,
    quantity,
    unit,
    status,
    date
  } = req.body;

  if (!farmerId || !block || !activity) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const logDate = date || new Date().toISOString();

  db.run(
    `INSERT INTO farmingLogs (farmerId, block, activity, description, quantity, unit, status, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [farmerId, block, activity, description || null, quantity || null, unit || null, status || 'Completed', logDate],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        farmerId,
        block,
        activity,
        description: description || null,
        quantity: quantity || null,
        unit: unit || null,
        status: status || 'Completed',
        date: logDate
      });
    }
  );
};

// Update farming log
exports.updateFarmingLog = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const fields = [];
  const values = [];
  
  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
  
  values.push(id);

  const query = `UPDATE farmingLogs SET ${fields.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Farming log not found' });
      return;
    }
    res.json({ message: 'Farming log updated successfully', id });
  });
};

// Delete farming log
exports.deleteFarmingLog = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM farmingLogs WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Farming log not found' });
      return;
    }
    res.json({ message: 'Farming log deleted successfully' });
  });
};

// Get farming logs by activity type
exports.getFarmingLogsByActivity = (req, res) => {
  const { activity } = req.params;
  
  db.all(
    'SELECT * FROM farmingLogs WHERE activity = ? ORDER BY date DESC',
    [activity],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get farming logs by block
exports.getFarmingLogsByBlock = (req, res) => {
  const { farmerId } = req.params;
  const { block } = req.query;
  
  if (!block) {
    res.status(400).json({ error: 'Block parameter required' });
    return;
  }

  db.all(
    'SELECT * FROM farmingLogs WHERE farmerId = ? AND block = ? ORDER BY date DESC',
    [farmerId, block],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get farming activity summary for farmer
exports.getFarmingActivitySummary = (req, res) => {
  const { farmerId } = req.params;
  
  db.all(
    `SELECT activity, COUNT(*) as count, SUM(quantity) as totalQuantity, status
     FROM farmingLogs 
     WHERE farmerId = ? 
     GROUP BY activity, status 
     ORDER BY createdAt DESC`,
    [farmerId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};
