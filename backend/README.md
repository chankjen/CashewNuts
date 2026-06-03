# Chakin Farm Backend Server

A RESTful API backend for the Chakin Farm - Cashew Farm Manager application. This server handles all operations related to farmer management, product listings, marketplace trading, farming logs, and analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js v14.0 or higher
- npm or yarn

### Installation

1. **Clone or navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Copy environment variables:**
```bash
cp .env.example .env
```

4. **Seed the database with sample data:**
```bash
npm run seed
```

5. **Start the development server:**
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Production

To run in production:
```bash
npm start
```

---

## 📚 Features

### ✅ Farmer Management
- Create, read, update, delete farmer profiles
- Search farmers by name, location, or specialization
- Track farmer statistics and performance metrics
- Manage farmer ratings and transaction history

### 🥜 Product Management
- Manage cashew products in multiple categories (raw, processed)
- Track inventory and stock levels
- Create and manage product listings
- Product search and filtering

### 🏪 Marketplace
- Buy and sell order management
- Real-time marketplace listings
- Order status tracking
- Transaction management

### 📝 Farming Operations
- Log farming activities (planting, pruning, harvesting, etc.)
- Track activities by farm block
- Monitor activity status (Completed, In Progress, Scheduled, Upcoming)
- Generate activity summaries

### 📊 Analytics & Dashboard
- Dashboard overview with key metrics
- Farm performance statistics
- Market analytics and trends
- Top farmers and products rankings
- Revenue analytics
- Monthly trend analysis

---

## 📁 Project Structure

```
backend/
├── server.js                 # Main Express server
├── database.js               # Database initialization
├── seedDatabase.js           # Sample data seeding
├── package.json              # Dependencies
├── .env.example              # Environment template
├── API_DOCUMENTATION.md      # Complete API docs
├── README.md                 # This file
└── routes/
    ├── farmers.js            # Farmer endpoints
    ├── products.js           # Products & listings endpoints
    ├── marketplace.js        # Orders & marketplace endpoints
    ├── farmingLogs.js        # Farming activity endpoints
    └── analytics.js          # Analytics endpoints
```

---

## 🔌 API Endpoints

### Summary of Available Endpoints

```
FARMERS
├── GET    /api/farmers                      # Get all farmers
├── GET    /api/farmers/:id                  # Get farmer details
├── GET    /api/farmers/search?query=...     # Search farmers
├── POST   /api/farmers                      # Create new farmer
├── PUT    /api/farmers/:id                  # Update farmer
├── DELETE /api/farmers/:id                  # Delete farmer
├── GET    /api/farmers/:id/stats            # Get farm statistics
└── PUT    /api/farmers/:id/stats            # Update farm statistics

PRODUCTS
├── GET    /api/products                     # Get all products
├── GET    /api/products/category/:category  # Filter by category
├── GET    /api/products/search?query=...    # Search products
├── GET    /api/products/:id                 # Get product details
├── POST   /api/products                     # Create product
├── PUT    /api/products/:id                 # Update product
└── DELETE /api/products/:id                 # Delete product

LISTINGS
├── GET    /api/listings/:farmerId           # Get farmer listings
├── POST   /api/listings                     # Create listing
└── PUT    /api/listings/:id                 # Update listing

MARKETPLACE & ORDERS
├── GET    /api/marketplace                  # Get marketplace listings
├── GET    /api/marketplace/:productName     # Get listings by product
├── GET    /api/orders                       # Get all orders
├── GET    /api/orders/buyer/:farmerId       # Get buyer orders
├── GET    /api/orders/seller/:farmerId      # Get seller orders
├── GET    /api/orders/:id                   # Get order details
├── POST   /api/orders/buy                   # Create buy order
├── POST   /api/orders/sell                  # Create sell listing
├── PUT    /api/orders/:id/status            # Update order status
├── PUT    /api/orders/:id/cancel            # Cancel order
└── DELETE /api/orders/:id                   # Delete order

FARMING LOGS
├── GET    /api/farming-logs                 # Get all logs
├── GET    /api/farming-logs/:farmerId       # Get farmer's logs
├── GET    /api/farming-logs/activity/:type  # Filter by activity
├── GET    /api/farming-logs/:farmerId/block # Filter by block
├── GET    /api/farming-logs/:farmerId/summary # Get summary
├── POST   /api/farming-logs                 # Create log entry
├── PUT    /api/farming-logs/:id             # Update log
└── DELETE /api/farming-logs/:id             # Delete log

ANALYTICS
├── GET    /api/analytics/dashboard          # Dashboard overview
├── GET    /api/analytics/farm/:farmerId     # Farm statistics
├── GET    /api/analytics/market             # Market analytics
├── GET    /api/analytics/farmers/top        # Top farmers
├── GET    /api/analytics/products/top       # Top products
├── GET    /api/analytics/revenue            # Revenue data
├── GET    /api/analytics/farming-activity   # Activity stats
├── GET    /api/analytics/trends/monthly     # Monthly trends
└── GET    /api/analytics/performance/:farmerId # Performance metrics
```

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🗄️ Database

The backend uses **SQLite3** for data persistence. The database file (`database.db`) is automatically created on first run.

### Database Tables:
- **farmers** - Farmer profiles and information
- **products** - Available products
- **listings** - Farmer product listings
- **orders** - Buy/sell orders and marketplace transactions
- **farmingLogs** - Farming activity logs
- **farmStats** - Farm statistics and metrics

---

## 🔧 Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development
```

### Environment Variables:
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

---

## 📖 Usage Examples

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
    "location": "Ogun State, Nigeria",
    "numberOfTrees": 500,
    "yearsOfExperience": 5
  }'
```

### Create Buy Order
```bash
curl -X POST http://localhost:3001/api/orders/buy \
  -H "Content-Type: application/json" \
  -d '{
    "buyerId": 2,
    "productName": "Raw Cashew Nuts",
    "quantity": 500,
    "pricePerUnit": 3.50,
    "sellerId": 1
  }'
```

### Log Farming Activity
```bash
curl -X POST http://localhost:3001/api/farming-logs \
  -H "Content-Type: application/json" \
  -d '{
    "farmerId": 1,
    "block": "Block A",
    "activity": "Harvesting",
    "quantity": 500,
    "unit": "kg"
  }'
```

---

## 🧪 Testing

To test the API, you can use:
- **Postman** - GUI client for API testing
- **curl** - Command line tool
- **Thunder Client** - VS Code extension
- **REST Client** - VS Code extension

---

## 📦 Dependencies

- **express** (v4.18.2) - Web framework
- **cors** (v2.8.5) - Cross-origin resource sharing
- **sqlite3** (v5.1.6) - Database driver
- **body-parser** (v1.20.2) - Request body parser
- **dotenv** (v16.0.3) - Environment variables

### Dev Dependencies
- **nodemon** (v2.0.22) - Auto-restart server on changes

---

## 🚀 Deployment

### Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create app-name`
4. Deploy: `git push heroku main`

### Deploy to Other Platforms

The backend is a standard Node.js/Express application and can be deployed to:
- AWS (EC2, Elastic Beanstalk)
- Google Cloud Platform
- Microsoft Azure
- DigitalOcean
- Railway
- Render

---

## 🔒 Security Notes

**Current Status:** Development mode, no authentication

**For Production, implement:**
- JWT authentication
- Input validation and sanitization
- Rate limiting
- HTTPS/SSL
- CORS restrictions
- Database encryption
- API key management
- Error logging
- Audit trails

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3001 is in use
# Try running on different port:
PORT=3002 npm run dev
```

### Database errors
```bash
# Reset database and reseed:
rm database.db
npm run seed
```

### CORS issues
Ensure CORS is enabled in the frontend requests:
```javascript
fetch('http://localhost:3001/api/farmers', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
```

---

## 📞 Support

For issues or questions:
1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Review route handlers in `/routes`
3. Check database schema in `database.js`

---

## 📄 License

MIT License - Feel free to use and modify

---

## 🙏 Acknowledgments

Built for the Chakin Farm project to streamline cashew farm operations and marketplace management across West Africa.

---

**Happy Farming! 🌾**
