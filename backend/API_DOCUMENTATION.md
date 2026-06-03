# Chakin Farm Backend API Documentation

## Overview
This is the backend API for the Chakin Farm - Cashew Farm Manager application. It provides RESTful endpoints to manage farmers, products, marketplace listings, trading orders, farming activities, and analytics.

## Base URL
```
http://localhost:3001/api
```

## Authentication
Currently, no authentication is required. In production, implement JWT or OAuth2.

---

## 🌾 FARMERS ENDPOINTS

### Get All Farmers
```http
GET /api/farmers
```
Returns all farmers with their information.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Adebayo Adeyemi",
    "location": "Ondo State, Nigeria",
    "email": "adebayo@cashewfarm.ng",
    "phone": "+234 801 234 5678",
    "numberOfTrees": 450,
    "yearsOfExperience": 5,
    "rating": 4.8,
    "totalHarvest": 1.2,
    "specialization": "Organic Raw Cashew",
    "bio": "Experienced cashew farmer...",
    "status": "Active",
    "transactionCount": 128
  }
]
```

### Get Farmer by ID
```http
GET /api/farmers/:id
```
Returns a specific farmer's details.

### Search Farmers
```http
GET /api/farmers/search?query=organic
```
Search farmers by name, location, or specialization.

### Create New Farmer
```http
POST /api/farmers
Content-Type: application/json

{
  "name": "John Smith",
  "location": "Enugu State, Nigeria",
  "email": "john@farm.ng",
  "phone": "+234 801 234 5678",
  "numberOfTrees": 500,
  "yearsOfExperience": 5,
  "specialization": "Organic Farming",
  "bio": "Experienced farmer"
}
```

### Update Farmer
```http
PUT /api/farmers/:id
Content-Type: application/json

{
  "rating": 4.9,
  "totalHarvest": 2.0,
  "transactionCount": 150
}
```

### Delete Farmer
```http
DELETE /api/farmers/:id
```

### Get Farmer Statistics
```http
GET /api/farmers/:id/stats
```
Returns farm statistics including tree health, soil moisture, harvest progress, etc.

### Update Farmer Statistics
```http
PUT /api/farmers/:id/stats
Content-Type: application/json

{
  "totalTrees": 2450,
  "totalHarvest": 5.2,
  "totalRevenue": 84000,
  "treeHealth": 92,
  "soilMoisture": 68,
  "harvestProgress": 75,
  "storageCapacity": 45
}
```

---

## 🥜 PRODUCTS ENDPOINTS

### Get All Products
```http
GET /api/products
```
Returns all available products.

### Get Products by Category
```http
GET /api/products/category/raw
GET /api/products/category/processed
```
Returns products filtered by category (raw or processed).

### Search Products
```http
GET /api/products/search?query=cashew
```
Search products by name, description, or origin.

### Get Product by ID
```http
GET /api/products/:id
```

### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Raw Cashew Nuts",
  "category": "raw",
  "price": 3.50,
  "quantity": 5000,
  "unit": "kg",
  "origin": "West Africa",
  "grade": "A+ Premium",
  "minOrder": 100,
  "description": "Premium grade, organic raw cashew nuts"
}
```

### Update Product
```http
PUT /api/products/:id
Content-Type: application/json

{
  "price": 3.75,
  "quantity": 4500
}
```

### Delete Product
```http
DELETE /api/products/:id
```

---

## 📦 LISTINGS ENDPOINTS

### Get Farmer Listings
```http
GET /api/listings/:farmerId
```
Returns all active listings for a specific farmer.

### Create Listing
```http
POST /api/listings
Content-Type: application/json

{
  "farmerId": 1,
  "productName": "Raw Cashew Nuts",
  "quantity": 1000,
  "pricePerUnit": 3.50,
  "minOrder": 100
}
```

### Update Listing Status
```http
PUT /api/listings/:id
Content-Type: application/json

{
  "status": "Inactive"
}
```

---

## 🏪 MARKETPLACE & ORDERS ENDPOINTS

### Get Marketplace Listings
```http
GET /api/marketplace
```
Returns all available sell listings on the marketplace.

### Get Marketplace by Product
```http
GET /api/marketplace/:productName
```
Returns all listings for a specific product, sorted by price.

### Get All Orders
```http
GET /api/orders
```

### Get Buyer Orders
```http
GET /api/orders/buyer/:farmerId
```
Returns all purchase orders for a specific buyer.

### Get Seller Orders
```http
GET /api/orders/seller/:farmerId
```
Returns all sale orders for a specific seller.

### Get Order by ID
```http
GET /api/orders/:id
```

### Create Buy Order
```http
POST /api/orders/buy
Content-Type: application/json

{
  "buyerId": 2,
  "productName": "Raw Cashew Nuts",
  "quantity": 500,
  "pricePerUnit": 3.50,
  "sellerId": 1
}
```

### Create Sell Listing
```http
POST /api/orders/sell
Content-Type: application/json

{
  "sellerId": 1,
  "productName": "Raw Cashew Nuts",
  "quantity": 1000,
  "pricePerUnit": 3.50,
  "minOrder": 100
}
```

### Update Order Status
```http
PUT /api/orders/:id/status
Content-Type: application/json

{
  "status": "Completed"
}
```

Possible statuses: Pending, Completed, Shipped, Available, Cancelled

### Cancel Order
```http
PUT /api/orders/:id/cancel
```

### Delete Order
```http
DELETE /api/orders/:id
```

---

## 📝 FARMING LOGS ENDPOINTS

### Get All Farming Logs
```http
GET /api/farming-logs
```

### Get Farmer's Farming Logs
```http
GET /api/farming-logs/:farmerId
```
Returns all farming logs for a specific farmer.

### Get Logs by Activity Type
```http
GET /api/farming-logs/activity/pruning
```

### Get Logs by Block
```http
GET /api/farming-logs/:farmerId/block?block=Block%20A
```

### Get Farming Activity Summary
```http
GET /api/farming-logs/:farmerId/summary
```
Returns summarized activity data by type and status.

### Create Farming Log
```http
POST /api/farming-logs
Content-Type: application/json

{
  "farmerId": 1,
  "block": "Block A",
  "activity": "Pruning",
  "description": "Pruned 450 trees",
  "quantity": 450,
  "unit": "trees",
  "status": "Completed",
  "date": "2024-02-15T10:30:00Z"
}
```

### Update Farming Log
```http
PUT /api/farming-logs/:id
Content-Type: application/json

{
  "status": "In Progress"
}
```

### Delete Farming Log
```http
DELETE /api/farming-logs/:id
```

---

## 📊 ANALYTICS ENDPOINTS

### Get Dashboard Overview
```http
GET /api/analytics/dashboard
```
Returns overall statistics like total farmers, products, trees, harvest, and average rating.

**Response:**
```json
{
  "totalFarmers": 128,
  "totalProducts": 35,
  "totalTrees": 312450,
  "totalHarvest": 5.2,
  "averageRating": "4.7"
}
```

### Get Farm Statistics
```http
GET /api/analytics/farm/:farmerId
```
Returns specific farm statistics.

### Get Market Analytics
```http
GET /api/analytics/market
```
Returns market data by product with order counts, quantities, and average prices.

**Optional Query Parameters:**
- `fromDate`: Start date for analysis
- `toDate`: End date for analysis

### Get Top Farmers
```http
GET /api/analytics/farmers/top?limit=10
```
Returns top-rated farmers.

### Get Top Products
```http
GET /api/analytics/products/top?limit=10
```
Returns best-selling products.

### Get Revenue Analytics
```http
GET /api/analytics/revenue
```
Returns revenue data per farmer.

### Get Farming Activity Statistics
```http
GET /api/analytics/farming-activity
```
Returns statistics on farming activities.

### Get Monthly Trends
```http
GET /api/analytics/trends/monthly
```
Returns monthly sales and value trends for the last 12 months.

### Get Farmer Performance Metrics
```http
GET /api/analytics/performance/:farmerId
```
Returns performance metrics for a specific farmer including:
- Total orders
- Total revenue
- Average order value
- Total quantity sold
- Completion rate

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Server Error

Error Response Format:
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## Installation & Running

### Prerequisites
- Node.js (v14+)
- npm

### Setup
```bash
cd backend
npm install
```

### Seed Database
```bash
npm run seed
```

### Start Development Server
```bash
npm run dev
```

### Start Production Server
```bash
npm start
```

The server will run on `http://localhost:3001`

---

## Database Schema

### Farmers Table
- id, name, location, email, phone, numberOfTrees, yearsOfExperience, rating, totalHarvest, specialization, bio, status, transactionCount, createdAt, updatedAt

### Products Table
- id, name, category, price, quantity, unit, origin, grade, minOrder, inStock, description, createdAt, updatedAt

### Listings Table
- id, farmerId, productName, quantity, pricePerUnit, minOrder, status, createdAt, updatedAt

### Orders Table
- id, buyerId, sellerId, productName, quantity, pricePerUnit, totalPrice, orderType, status, createdAt, updatedAt

### FarmingLogs Table
- id, farmerId, block, activity, description, quantity, unit, status, date, createdAt

### FarmStats Table
- id, farmerId, totalTrees, totalHarvest, totalRevenue, treeHealth, soilMoisture, harvestProgress, storageCapacity, updatedAt

---

## Integration with Frontend

Update the frontend Farm.html to use these API endpoints. Replace placeholder functions with fetch calls:

```javascript
// Example: Get all farmers
fetch('http://localhost:3001/api/farmers')
  .then(res => res.json())
  .then(data => {
    // Handle farmer data
  });

// Example: Create new farmer
fetch('http://localhost:3001/api/farmers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    location: 'Ogun State',
    numberOfTrees: 500,
    yearsOfExperience: 5
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Notes
- Database uses SQLite for persistence
- All timestamps are in ISO 8601 format
- Currency is in USD
- Quantities are in standard units (kg, liters, etc.)
- Consider implementing rate limiting and pagination in production
