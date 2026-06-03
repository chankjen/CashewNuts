# Chakin Farm Backend - Quick Reference Guide

## 🎯 Server Connection

**Server URL:** `http://localhost:3001`

**Base API URL:** `http://localhost:3001/api`

---

## 🚀 Start Backend

```bash
cd backend
npm install          # First time only
npm run seed         # Initialize database with sample data
npm run dev          # Start development server
```

**Expected Output:**
```
✅ Chakin Farm Backend Server running on http://localhost:3001
✅ Database initialized and seeded
```

---

## 📋 What's Been Created

### Core Files
- ✅ `server.js` - Express server with all routes
- ✅ `database.js` - Database initialization
- ✅ `seedDatabase.js` - Sample data seeding
- ✅ `package.json` - Dependencies

### Route Handlers
- ✅ `routes/farmers.js` - Farmer management (8 endpoints)
- ✅ `routes/products.js` - Products & listings (7 endpoints)
- ✅ `routes/marketplace.js` - Orders & trading (10 endpoints)
- ✅ `routes/farmingLogs.js` - Activity logs (8 endpoints)
- ✅ `routes/analytics.js` - Analytics & dashboard (9 endpoints)

### Documentation
- ✅ `README.md` - Full backend guide
- ✅ `API_DOCUMENTATION.md` - API reference
- ✅ `FRONTEND_INTEGRATION.js` - Frontend examples
- ✅ `BACKEND_SUMMARY.md` - Implementation summary

### Configuration
- ✅ `.env.example` - Environment template
- ✅ `.gitignore` - Git ignore rules
- ✅ `start.sh` - Quick start script

**Total: 45 API Endpoints Ready to Use**

---

## 🔗 Quick API Examples

### Get All Farmers
```bash
curl http://localhost:3001/api/farmers
```

### Create New Farmer
```bash
curl -X POST http://localhost:3001/api/farmers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Farmer",
    "location": "Lagos, Nigeria",
    "numberOfTrees": 500,
    "yearsOfExperience": 5
  }'
```

### Get All Products
```bash
curl http://localhost:3001/api/products
```

### Get Dashboard Stats
```bash
curl http://localhost:3001/api/analytics/dashboard
```

### Create Buy Order
```bash
curl -X POST http://localhost:3001/api/orders/buy \
  -H "Content-Type: application/json" \
  -d '{
    "buyerId": 2,
    "productName": "Raw Cashew Nuts",
    "quantity": 500,
    "pricePerUnit": 3.50
  }'
```

---

## 📊 Database Tables

| Table | Records | Purpose |
|-------|---------|---------|
| farmers | 6 | Farmer profiles |
| products | 8 | Product catalog |
| listings | 0 | Product listings |
| orders | 0 | Buy/sell orders |
| farmingLogs | 0 | Activity logs |
| farmStats | 1 | Farm metrics |

---

## 🧪 Testing Endpoints

### Using Postman
1. Import API collection
2. Set base URL to `http://localhost:3001/api`
3. Test each endpoint

### Using cURL
See examples above or check API_DOCUMENTATION.md

### Using VS Code REST Client
```http
@api = http://localhost:3001/api

### Get farmers
GET {{api}}/farmers

### Create farmer
POST {{api}}/farmers
Content-Type: application/json

{
  "name": "Test Farmer",
  "location": "Test State",
  "numberOfTrees": 100,
  "yearsOfExperience": 2
}
```

---

## 📱 Frontend Integration

### Option 1: Direct Fetch
```javascript
// In Farm.html
fetch('http://localhost:3001/api/farmers')
  .then(res => res.json())
  .then(farmers => console.log(farmers));
```

### Option 2: Use Integration File
```javascript
// Include FRONTEND_INTEGRATION.js in Farm.html
<script src="backend/FRONTEND_INTEGRATION.js"></script>

// Then use:
const farmers = await farmAPI.fetchAllFarmers();
const overview = await farmAPI.fetchDashboardOverview();
```

---

## 🔍 Key Endpoints by Feature

### Farmers (8 endpoints)
- `GET /api/farmers` - List all
- `POST /api/farmers` - Create
- `GET /api/farmers/:id` - Get one
- `PUT /api/farmers/:id` - Update
- `DELETE /api/farmers/:id` - Delete
- `GET /api/farmers/search?query=...` - Search
- `GET /api/farmers/:id/stats` - Get stats
- `PUT /api/farmers/:id/stats` - Update stats

### Products (7 endpoints)
- `GET /api/products` - List all
- `GET /api/products/category/raw` - By category
- `POST /api/products` - Create
- `PUT /api/products/:id` - Update
- `DELETE /api/products/:id` - Delete
- `GET /api/products/search?query=...` - Search
- `GET /api/products/:id` - Get one

### Orders (10 endpoints)
- `GET /api/orders` - List all
- `GET /api/orders/:id` - Get one
- `POST /api/orders/buy` - Buy order
- `POST /api/orders/sell` - Sell listing
- `GET /api/orders/buyer/:id` - Buyer's orders
- `GET /api/orders/seller/:id` - Seller's orders
- `PUT /api/orders/:id/status` - Update status
- `PUT /api/orders/:id/cancel` - Cancel
- `DELETE /api/orders/:id` - Delete
- `GET /api/marketplace` - Marketplace listings

### Farming Logs (8 endpoints)
- `GET /api/farming-logs` - List all
- `GET /api/farming-logs/:farmerId` - Get farmer's
- `POST /api/farming-logs` - Create
- `PUT /api/farming-logs/:id` - Update
- `DELETE /api/farming-logs/:id` - Delete
- `GET /api/farming-logs/activity/:type` - By activity
- `GET /api/farming-logs/:farmerId/block` - By block
- `GET /api/farming-logs/:farmerId/summary` - Summary

### Analytics (9 endpoints)
- `GET /api/analytics/dashboard` - Overview
- `GET /api/analytics/farm/:id` - Farm stats
- `GET /api/analytics/market` - Market data
- `GET /api/analytics/farmers/top` - Top farmers
- `GET /api/analytics/products/top` - Top products
- `GET /api/analytics/revenue` - Revenue data
- `GET /api/analytics/farming-activity` - Activities
- `GET /api/analytics/trends/monthly` - Trends
- `GET /api/analytics/performance/:id` - Performance

---

## ⚙️ Environment Setup

### Development (.env)
```env
PORT=3001
NODE_ENV=development
```

### Production (.env)
```env
PORT=3001
NODE_ENV=production
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
PORT=3002 npm run dev

# Or kill process on port 3001
# Windows: netstat -ano | findstr :3001
# Linux: lsof -i :3001 | grep LISTEN
```

### Database Issues
```bash
# Reset database
rm database.db
npm run seed
```

### CORS Error
- Ensure CORS is enabled in server.js (✅ Already enabled)
- Frontend must be on different port from backend

### Connection Refused
- Check if server is running: `npm run dev`
- Check URL: `http://localhost:3001` (not 3000)

---

## 📚 Documentation Map

1. **API_DOCUMENTATION.md** - Complete API reference with all endpoints
2. **README.md** - Backend setup and overview
3. **BACKEND_SUMMARY.md** - Implementation details
4. **FRONTEND_INTEGRATION.js** - Frontend examples
5. **This file** - Quick reference

---

## ✅ Pre-Flight Checklist

Before using backend:
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] In backend directory (`cd backend`)
- [ ] Dependencies installed (`npm install`)
- [ ] Database seeded (`npm run seed`)
- [ ] Server running (`npm run dev`)
- [ ] Server accessible (`http://localhost:3001/api/health`)

---

## 🎉 You're Ready!

All endpoints are configured and ready to use. Start the server and connect your frontend!

```bash
cd backend && npm install && npm run seed && npm run dev
```

Then access the API at: **http://localhost:3001/api**

---

## 📞 Need Help?

1. Check **API_DOCUMENTATION.md** for endpoint details
2. Review **FRONTEND_INTEGRATION.js** for examples
3. Check route files in **/routes** for implementation
4. Review **README.md** for setup issues

**Happy Farming! 🌾**
