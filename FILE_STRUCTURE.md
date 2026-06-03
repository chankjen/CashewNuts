# CashewNuts Application - File Structure

Below is the directory layout and description of the components of the CashewNuts (Chakin Farm) application.

```text
CashewNuts/
├── Farm.html                 # Main frontend user interface (dashboard, charts, forms)
├── FILE_STRUCTURE.md         # Document outlining the application file layout (this file)
│
├── frontend/                 # Client-side JavaScript logic
│   ├── api-client.js         # API wrapper functions for interacting with the backend
│   ├── app.js                # Core frontend application state, event handlers, and page routing
│   └── ui-helper.js          # Helpers for rendering UI components, charts, and tables dynamically
│
└── backend/                  # RESTful API Backend Server (Node.js & Express)
    ├── server.js             # Main Express server and application entry point
    ├── database.js           # Database connection and SQLite schema initialization
    ├── database.db           # SQLite database (auto-generated on startup)
    ├── seedDatabase.js       # Script to populate the database with mock records
    ├── routes/               # Modular Express API route controllers
    │   ├── analytics.js      # Endpoint handlers for farm statistics & dashboard charts
    │   ├── farmers.js        # CRUD operations for farmer profile management
    │   ├── farmingLogs.js    # Activity logging and tracking endpoints
    │   ├── marketplace.js    # Buy and sell order operations
    │   └── products.js       # Product inventory and category listing endpoints
    │
    ├── package.json          # Server-side package dependencies and run scripts
    ├── package-lock.json     # Locked package dependency tree
    ├── .env.example          # Template for backend environment variables
    ├── .gitignore            # Git ignore pattern rules for dependencies and build artifacts
    ├── start.sh              # Shell script to quick-launch the backend in development
    ├── API_DOCUMENTATION.md  # Detailed reference for backend API endpoints
    ├── README.md             # Developer setup, execution, and troubleshooting guide
    ├── BACKEND_SUMMARY.md    # Summary of backend architectural decisions
    ├── START_HERE.md         # Onboarding manual for new developer setup
    ├── COMPLETION_REPORT.md  # Completion notes on backend implementation
    └── FILE_MANIFEST.md      # Listing of backend files and contents manifest
```

---

## Component Details

### 1. Frontend
* **[Farm.html](file:///d:/CashewNuts/Farm.html)**: The single-page interface powered by Tailwind CSS and Chart.js.
* **[frontend/api-client.js](file:///d:/CashewNuts/frontend/api-client.js)**: Performs HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) to the Express backend.
* **[frontend/app.js](file:///d:/CashewNuts/frontend/app.js)**: Handles tab switching, event listeners for forms, and state syncing.
* **[frontend/ui-helper.js](file:///d:/CashewNuts/frontend/ui-helper.js)**: Dynamically injects HTML elements (cards, lists, modals) into the DOM.

### 2. Backend
* **[backend/server.js](file:///d:/CashewNuts/backend/server.js)**: Boots the HTTP listener, sets up middleware (CORS, body parser), and registers route handlers.
* **[backend/database.js](file:///d:/CashewNuts/backend/database.js)**: Opens the SQLite3 database file `database.db` and establishes tables.
* **[backend/routes/](file:///d:/CashewNuts/backend/routes/)**: Houses modular endpoints separating concerns into farmers, products, transactions, farming logs, and analytics.
