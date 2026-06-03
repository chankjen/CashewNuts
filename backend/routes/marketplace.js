const { db } = require('../database');

// Get all orders
exports.getAllOrders = (req, res) => {
  db.all('SELECT * FROM orders ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Get orders by farmer (as buyer)
exports.getBuyerOrders = (req, res) => {
  const { farmerId } = req.params;
  
  db.all(
    'SELECT * FROM orders WHERE buyerId = ? ORDER BY createdAt DESC',
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

// Get orders by farmer (as seller)
exports.getSellerOrders = (req, res) => {
  const { farmerId } = req.params;
  
  db.all(
    'SELECT * FROM orders WHERE sellerId = ? ORDER BY createdAt DESC',
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

// Get order by ID
exports.getOrderById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(row);
  });
};

// Create buy order
exports.createBuyOrder = (req, res) => {
  const { buyerId, productName, quantity, pricePerUnit, sellerId } = req.body;

  if (!buyerId || !productName || !quantity || !pricePerUnit) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const totalPrice = quantity * pricePerUnit;

  db.run(
    `INSERT INTO orders (buyerId, sellerId, productName, quantity, pricePerUnit, totalPrice, orderType, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [buyerId, sellerId || null, productName, quantity, pricePerUnit, totalPrice, 'Buy', 'Pending'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        buyerId,
        sellerId: sellerId || null,
        productName,
        quantity,
        pricePerUnit,
        totalPrice,
        orderType: 'Buy',
        status: 'Pending'
      });
    }
  );
};

// Create sell order (listing from marketplace)
exports.createSellOrder = (req, res) => {
  const { sellerId, productName, quantity, pricePerUnit, minOrder } = req.body;

  if (!sellerId || !productName || !quantity || !pricePerUnit) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const totalPrice = quantity * pricePerUnit;

  db.run(
    `INSERT INTO orders (sellerId, productName, quantity, pricePerUnit, totalPrice, orderType, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [sellerId, productName, quantity, pricePerUnit, totalPrice, 'Sell', 'Available'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        sellerId,
        productName,
        quantity,
        pricePerUnit,
        totalPrice,
        orderType: 'Sell',
        status: 'Available'
      });
    }
  );
};

// Update order status
exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ error: 'Status required' });
    return;
  }

  db.run(
    'UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json({ message: 'Order status updated successfully' });
    }
  );
};

// Get marketplace listings (available sell orders)
exports.getMarketplaceListings = (req, res) => {
  db.all(
    'SELECT * FROM orders WHERE orderType = "Sell" AND status = "Available" ORDER BY createdAt DESC',
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get marketplace listings by product
exports.getMarketplaceByProduct = (req, res) => {
  const { productName } = req.params;
  
  db.all(
    'SELECT * FROM orders WHERE orderType = "Sell" AND status = "Available" AND productName = ? ORDER BY pricePerUnit ASC',
    [productName],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Cancel order
exports.cancelOrder = (req, res) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE orders SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    ['Cancelled', id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json({ message: 'Order cancelled successfully' });
    }
  );
};

// Delete order
exports.deleteOrder = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ message: 'Order deleted successfully' });
  });
};
