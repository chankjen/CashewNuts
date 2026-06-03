const { db } = require('../database');

// Get all products
exports.getAllProducts = (req, res) => {
  db.all('SELECT * FROM products ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Get products by category
exports.getProductsByCategory = (req, res) => {
  const { category } = req.params;
  
  db.all(
    'SELECT * FROM products WHERE category = ? ORDER BY name',
    [category],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get product by ID
exports.getProductById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(row);
  });
};

// Create new product
exports.createProduct = (req, res) => {
  const {
    name,
    category,
    price,
    quantity,
    unit,
    origin,
    grade,
    minOrder,
    description
  } = req.body;

  if (!name || !category || !price) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  db.run(
    `INSERT INTO products (name, category, price, quantity, unit, origin, grade, minOrder, description, inStock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, category, price, quantity || 0, unit || 'kg', origin, grade, minOrder, description, quantity > 0 ? 1 : 0],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        name,
        category,
        price,
        quantity: quantity || 0,
        unit: unit || 'kg',
        origin,
        grade,
        minOrder,
        description,
        inStock: quantity > 0
      });
    }
  );
};

// Update product
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const fields = [];
  const values = [];
  
  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
  
  fields.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(id);

  const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product updated successfully', id });
  });
};

// Delete product
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
};

// Search products
exports.searchProducts = (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    res.status(400).json({ error: 'Search query required' });
    return;
  }

  const searchTerm = `%${query}%`;
  db.all(
    `SELECT * FROM products 
     WHERE name LIKE ? OR description LIKE ? OR origin LIKE ? 
     ORDER BY name`,
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

// Get listings by farmer
exports.getFarmerListings = (req, res) => {
  const { farmerId } = req.params;
  
  db.all(
    'SELECT * FROM listings WHERE farmerId = ? AND status = "Active" ORDER BY createdAt DESC',
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

// Create product listing
exports.createListing = (req, res) => {
  const { farmerId, productName, quantity, pricePerUnit, minOrder } = req.body;

  if (!farmerId || !productName || !quantity || !pricePerUnit) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  db.run(
    `INSERT INTO listings (farmerId, productName, quantity, pricePerUnit, minOrder, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [farmerId, productName, quantity, pricePerUnit, minOrder || quantity, 'Active'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        farmerId,
        productName,
        quantity,
        pricePerUnit,
        minOrder: minOrder || quantity,
        status: 'Active'
      });
    }
  );
};

// Update listing status
exports.updateListing = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ error: 'Status required' });
    return;
  }

  db.run(
    'UPDATE listings SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Listing not found' });
        return;
      }
      res.json({ message: 'Listing updated successfully' });
    }
  );
};
