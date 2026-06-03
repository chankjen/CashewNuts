const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { db, initializeDatabase } = require('./database');
require('./seedDatabase');

// Import route handlers
const authRoutes = require('./routes/auth');
const farmersRoutes = require('./routes/farmers');
const productsRoutes = require('./routes/products');
const marketplaceRoutes = require('./routes/marketplace');
const farmingLogsRoutes = require('./routes/farmingLogs');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initializeDatabase();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Compatibility alias for frontend /health checks
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// ===== AUTH ROUTES =====
app.post('/api/auth/login', authRoutes.login);
app.post('/api/auth/register', authRoutes.register);

// ===== FARMERS ROUTES =====
app.get('/api/farmers', farmersRoutes.getAllFarmers);
app.get('/api/farmers/search', farmersRoutes.searchFarmers);
app.get('/api/farmers/:id', farmersRoutes.getFarmerById);
app.post('/api/farmers', farmersRoutes.createFarmer);
app.put('/api/farmers/:id', farmersRoutes.updateFarmer);
app.delete('/api/farmers/:id', farmersRoutes.deleteFarmer);
app.get('/api/farmers/:id/stats', farmersRoutes.getFarmerStats);
app.put('/api/farmers/:id/stats', farmersRoutes.updateFarmerStats);

// ===== PRODUCTS ROUTES =====
app.get('/api/products', productsRoutes.getAllProducts);
app.get('/api/products/category/:category', productsRoutes.getProductsByCategory);
app.get('/api/products/search', productsRoutes.searchProducts);
app.get('/api/products/:id', productsRoutes.getProductById);
app.post('/api/products', productsRoutes.createProduct);
app.put('/api/products/:id', productsRoutes.updateProduct);
app.delete('/api/products/:id', productsRoutes.deleteProduct);

// ===== LISTINGS ROUTES =====
app.get('/api/listings/:farmerId', productsRoutes.getFarmerListings);
app.post('/api/listings', productsRoutes.createListing);
app.put('/api/listings/:id', productsRoutes.updateListing);

// ===== MARKETPLACE/ORDERS ROUTES =====
app.get('/api/marketplace', marketplaceRoutes.getMarketplaceListings);
app.get('/api/marketplace/:productName', marketplaceRoutes.getMarketplaceByProduct);
app.get('/api/orders', marketplaceRoutes.getAllOrders);
app.get('/api/orders/buyer/:farmerId', marketplaceRoutes.getBuyerOrders);
app.get('/api/orders/seller/:farmerId', marketplaceRoutes.getSellerOrders);
app.get('/api/orders/:id', marketplaceRoutes.getOrderById);
app.post('/api/orders/buy', marketplaceRoutes.createBuyOrder);
app.post('/api/orders/sell', marketplaceRoutes.createSellOrder);
app.put('/api/orders/:id/status', marketplaceRoutes.updateOrderStatus);
app.delete('/api/orders/:id', marketplaceRoutes.deleteOrder);
app.put('/api/orders/:id/cancel', marketplaceRoutes.cancelOrder);

// ===== FARMING LOGS ROUTES =====
app.get('/api/farming-logs', farmingLogsRoutes.getAllFarmingLogs);
app.get('/api/farming-logs/:farmerId', farmingLogsRoutes.getFarmerFarmingLogs);
app.get('/api/farming-logs/activity/:activity', farmingLogsRoutes.getFarmingLogsByActivity);
app.get('/api/farming-logs/:farmerId/block', farmingLogsRoutes.getFarmingLogsByBlock);
app.get('/api/farming-logs/:farmerId/summary', farmingLogsRoutes.getFarmingActivitySummary);
app.post('/api/farming-logs', farmingLogsRoutes.createFarmingLog);
app.put('/api/farming-logs/:id', farmingLogsRoutes.updateFarmingLog);
app.delete('/api/farming-logs/:id', farmingLogsRoutes.deleteFarmingLog);

// ===== ANALYTICS ROUTES =====
app.get('/api/analytics/dashboard', analyticsRoutes.getDashboardOverview);
app.get('/api/analytics/farm/:farmerId', analyticsRoutes.getFarmStatistics);
app.get('/api/analytics/market', analyticsRoutes.getMarketAnalytics);
app.get('/api/analytics/farmers/top', analyticsRoutes.getTopFarmers);
app.get('/api/analytics/products/top', analyticsRoutes.getTopProducts);
app.get('/api/analytics/revenue', analyticsRoutes.getRevenueAnalytics);
app.get('/api/analytics/farming-activity', analyticsRoutes.getFarmingActivityStats);
app.get('/api/analytics/trends/monthly', analyticsRoutes.getMonthlyTrends);
app.get('/api/analytics/performance/:farmerId', analyticsRoutes.getFarmerPerformanceMetrics);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Chakin Farm Backend Server running on http://localhost:${PORT}`);
  console.log(`\n📚 API Documentation:`);
  console.log(`   - Health Check: GET http://localhost:${PORT}/api/health`);
  console.log(`\n🌾 Available Endpoints:`);
  console.log(`   - Farmers: /api/farmers`);
  console.log(`   - Products: /api/products`);
  console.log(`   - Marketplace: /api/marketplace`);
  console.log(`   - Orders: /api/orders`);
  console.log(`   - Farming Logs: /api/farming-logs`);
  console.log(`   - Analytics: /api/analytics\n`);
});

module.exports = app;
