const { db } = require('../database');

// Get dashboard overview
exports.getDashboardOverview = (req, res) => {
  const queries = [
    { name: 'totalFarmers', sql: 'SELECT COUNT(*) as count FROM farmers' },
    { name: 'totalProducts', sql: 'SELECT COUNT(*) as count FROM products' },
    { name: 'totalTrees', sql: 'SELECT SUM(numberOfTrees) as total FROM farmers' },
    { name: 'totalHarvest', sql: 'SELECT SUM(totalHarvest) as total FROM farmers' },
    { name: 'averageRating', sql: 'SELECT AVG(rating) as average FROM farmers' }
  ];

  const overview = {};
  let completed = 0;

  queries.forEach(({ name, sql }) => {
    db.get(sql, (err, row) => {
      if (err) {
        console.error(`Error fetching ${name}:`, err);
      } else {
        overview[name] = name === 'averageRating' 
          ? (row.average || 0).toFixed(1) 
          : (row.count || row.total || 0);
      }
      completed++;
      if (completed === queries.length) {
        res.json(overview);
      }
    });
  });
};

// Get farm statistics by farmer
exports.getFarmStatistics = (req, res) => {
  const { farmerId } = req.params;
  
  db.get(
    `SELECT * FROM farmStats WHERE farmerId = ?`,
    [farmerId],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Farm statistics not found' });
        return;
      }
      res.json(row);
    }
  );
};

// Get market analytics
exports.getMarketAnalytics = (req, res) => {
  const { fromDate, toDate } = req.query;

  let query = `
    SELECT 
      productName,
      COUNT(*) as totalOrders,
      SUM(quantity) as totalQuantity,
      AVG(pricePerUnit) as avgPrice,
      orderType
    FROM orders
  `;

  const params = [];

  if (fromDate || toDate) {
    query += ' WHERE ';
    const conditions = [];
    if (fromDate) {
      conditions.push('createdAt >= ?');
      params.push(fromDate);
    }
    if (toDate) {
      conditions.push('createdAt <= ?');
      params.push(toDate);
    }
    query += conditions.join(' AND ');
  }

  query += ' GROUP BY productName, orderType ORDER BY totalQuantity DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

// Get top farmers by rating
exports.getTopFarmers = (req, res) => {
  const { limit = 10 } = req.query;
  
  db.all(
    `SELECT id, name, location, rating, totalHarvest, transactionCount, numberOfTrees
     FROM farmers 
     ORDER BY rating DESC 
     LIMIT ?`,
    [parseInt(limit)],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get top products by sales
exports.getTopProducts = (req, res) => {
  const { limit = 10 } = req.query;
  
  db.all(
    `SELECT 
       productName,
       COUNT(*) as totalSales,
       SUM(quantity) as totalQuantity,
       AVG(pricePerUnit) as avgPrice
     FROM orders 
     WHERE orderType = 'Sell'
     GROUP BY productName 
     ORDER BY totalQuantity DESC 
     LIMIT ?`,
    [parseInt(limit)],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get revenue analytics
exports.getRevenueAnalytics = (req, res) => {
  db.all(
    `SELECT 
       sellerId,
       orderType,
       COUNT(*) as totalOrders,
       SUM(totalPrice) as totalRevenue,
       AVG(totalPrice) as avgOrderValue
     FROM orders 
     WHERE orderType = 'Sell' AND status IN ('Completed', 'Available')
     GROUP BY sellerId 
     ORDER BY totalRevenue DESC`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get farming activity statistics
exports.getFarmingActivityStats = (req, res) => {
  db.all(
    `SELECT 
       activity,
       COUNT(*) as count,
       SUM(quantity) as totalQuantity,
       status
     FROM farmingLogs 
     GROUP BY activity, status 
     ORDER BY count DESC`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get monthly trends
exports.getMonthlyTrends = (req, res) => {
  db.all(
    `SELECT 
       strftime('%Y-%m', createdAt) as month,
       COUNT(*) as totalOrders,
       SUM(totalPrice) as totalValue,
       orderType
     FROM orders 
     WHERE createdAt >= date('now', '-12 months')
     GROUP BY month, orderType 
     ORDER BY month DESC`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
};

// Get farmer performance metrics
exports.getFarmerPerformanceMetrics = (req, res) => {
  const { farmerId } = req.params;
  
  let metrics = {};
  let completed = 0;

  // Total orders
  db.get(
    `SELECT COUNT(*) as count FROM orders WHERE sellerId = ?`,
    [farmerId],
    (err, row) => {
      metrics.totalOrders = row?.count || 0;
      completed++;
      if (completed === 5) sendResponse();
    }
  );

  // Total revenue
  db.get(
    `SELECT SUM(totalPrice) as total FROM orders WHERE sellerId = ? AND status = 'Completed'`,
    [farmerId],
    (err, row) => {
      metrics.totalRevenue = row?.total || 0;
      completed++;
      if (completed === 5) sendResponse();
    }
  );

  // Avg order value
  db.get(
    `SELECT AVG(totalPrice) as avg FROM orders WHERE sellerId = ?`,
    [farmerId],
    (err, row) => {
      metrics.avgOrderValue = (row?.avg || 0).toFixed(2);
      completed++;
      if (completed === 5) sendResponse();
    }
  );

  // Total quantity sold
  db.get(
    `SELECT SUM(quantity) as total FROM orders WHERE sellerId = ?`,
    [farmerId],
    (err, row) => {
      metrics.totalQuantitySold = row?.total || 0;
      completed++;
      if (completed === 5) sendResponse();
    }
  );

  // Completion rate
  db.get(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
     FROM orders 
     WHERE sellerId = ?`,
    [farmerId],
    (err, row) => {
      const total = row?.total || 0;
      const completed_count = row?.completed || 0;
      metrics.completionRate = total > 0 ? ((completed_count / total) * 100).toFixed(1) : 0;
      completed++;
      if (completed === 5) sendResponse();
    }
  );

  function sendResponse() {
    res.json(metrics);
  }
};
