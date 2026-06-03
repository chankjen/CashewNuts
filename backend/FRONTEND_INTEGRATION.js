// Chakin Farm Frontend - Backend Integration Examples
// Add these functions to Farm.html to connect with the backend API

const API_BASE = 'http://localhost:3001/api';

// ============================================
// FARMERS - API Integration
// ============================================

async function fetchAllFarmers() {
  try {
    const response = await fetch(`${API_BASE}/farmers`);
    const farmers = await response.json();
    return farmers;
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return [];
  }
}

async function fetchFarmerProfile(farmerId) {
  try {
    const response = await fetch(`${API_BASE}/farmers/${farmerId}`);
    const farmer = await response.json();
    return farmer;
  } catch (error) {
    console.error('Error fetching farmer:', error);
    return null;
  }
}

async function searchFarmersAPI(query) {
  try {
    const response = await fetch(`${API_BASE}/farmers/search?query=${encodeURIComponent(query)}`);
    const farmers = await response.json();
    return farmers;
  } catch (error) {
    console.error('Error searching farmers:', error);
    return [];
  }
}

async function createFarmerAPI(farmerData) {
  try {
    const response = await fetch(`${API_BASE}/farmers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerData)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating farmer:', error);
    return null;
  }
}

// ============================================
// PRODUCTS - API Integration
// ============================================

async function fetchAllProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function fetchProductsByCategory(category) {
  try {
    const response = await fetch(`${API_BASE}/products/category/${category}`);
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function searchProductsAPI(query) {
  try {
    const response = await fetch(`${API_BASE}/products/search?query=${encodeURIComponent(query)}`);
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

// ============================================
// MARKETPLACE - API Integration
// ============================================

async function fetchMarketplaceListings() {
  try {
    const response = await fetch(`${API_BASE}/marketplace`);
    const listings = await response.json();
    return listings;
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    return [];
  }
}

async function createBuyOrder(orderData) {
  try {
    const response = await fetch(`${API_BASE}/orders/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating buy order:', error);
    return null;
  }
}

async function createSellListing(listingData) {
  try {
    const response = await fetch(`${API_BASE}/orders/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating sell listing:', error);
    return null;
  }
}

// ============================================
// FARMING LOGS - API Integration
// ============================================

async function createFarmingLogAPI(logData) {
  try {
    const response = await fetch(`${API_BASE}/farming-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating farming log:', error);
    return null;
  }
}

async function fetchFarmerLogs(farmerId) {
  try {
    const response = await fetch(`${API_BASE}/farming-logs/${farmerId}`);
    const logs = await response.json();
    return logs;
  } catch (error) {
    console.error('Error fetching farming logs:', error);
    return [];
  }
}

// ============================================
// ANALYTICS - API Integration
// ============================================

async function fetchDashboardOverview() {
  try {
    const response = await fetch(`${API_BASE}/analytics/dashboard`);
    const overview = await response.json();
    return overview;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return {};
  }
}

async function fetchFarmStatistics(farmerId) {
  try {
    const response = await fetch(`${API_BASE}/analytics/farm/${farmerId}`);
    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error('Error fetching farm stats:', error);
    return null;
  }
}

async function fetchFarmerPerformance(farmerId) {
  try {
    const response = await fetch(`${API_BASE}/analytics/performance/${farmerId}`);
    const metrics = await response.json();
    return metrics;
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return {};
  }
}

// ============================================
// UPDATED FUNCTIONS IN Farm.html
// ============================================

// Updated searchFarmers to use API
async function searchFarmersUpdated(query) {
  if (!query.trim()) {
    // Show all farmers
    const farmers = await fetchAllFarmers();
    populateFarmersList(farmers);
  } else {
    const farmers = await searchFarmersAPI(query);
    populateFarmersList(farmers);
  }
}

function populateFarmersList(farmers) {
  const grid = document.getElementById('farmersGrid');
  grid.innerHTML = farmers.map(farmer => `
    <div class="farmer-card bg-white rounded-2xl p-5 shadow-sm border border-amber-50 card-hover cursor-pointer" onclick="showFarmerProfile('${farmer.id}')">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-14 h-14 rounded-full gradient-green flex items-center justify-center text-white font-bold text-lg">${farmer.name.substring(0, 2).toUpperCase()}</div>
        <div class="flex-1">
          <h4 class="font-bold text-gray-800">${farmer.name}</h4>
          <p class="text-xs text-gray-500">📍 ${farmer.location}</p>
        </div>
        <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">${farmer.status}</span>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="bg-green-50 rounded-lg p-2">
          <p class="font-bold text-green-700 text-sm">${farmer.numberOfTrees}</p>
          <p class="text-xs text-green-600">Trees</p>
        </div>
        <div class="bg-amber-50 rounded-lg p-2">
          <p class="font-bold text-amber-700 text-sm">${farmer.totalHarvest}T</p>
          <p class="text-xs text-amber-600">Harvest</p>
        </div>
        <div class="bg-blue-50 rounded-lg p-2">
          <p class="font-bold text-blue-700 text-sm">${farmer.yearsOfExperience}yr</p>
          <p class="text-xs text-blue-600">Exp</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Updated addFarmer to use API
async function addFarmerAPI(e) {
  e.preventDefault();
  
  const firstName = document.querySelector('[placeholder="Enter first name"]').value;
  const lastName = document.querySelector('[placeholder="Enter last name"]').value;
  const location = document.querySelector('[placeholder*="State"]').value;
  const phone = document.querySelector('[placeholder*="+234"]').value;
  const email = document.querySelector('[placeholder*="email"]').value;
  const numberOfTrees = parseInt(document.querySelector('[placeholder*="number of trees"]').value);
  const yearsOfExperience = parseInt(document.querySelector('[placeholder*="Years of farming"]').value);

  const result = await createFarmerAPI({
    name: `${firstName} ${lastName}`,
    location,
    email,
    phone,
    numberOfTrees,
    yearsOfExperience,
    specialization: 'General Farming',
    bio: `Farmer with ${yearsOfExperience} years of experience`
  });

  if (result) {
    closeAddFarmerModal();
    showToast('✅ Farmer added successfully!');
    // Refresh farmer list
    const farmers = await fetchAllFarmers();
    populateFarmersList(farmers);
  } else {
    showToast('❌ Failed to add farmer');
  }
}

// Updated submitTrade to use API
async function submitTradeAPI(e) {
  e.preventDefault();
  
  const type = document.getElementById('tradeModalTitle').textContent.includes('Buy') ? 'buy' : 'sell';
  const product = document.getElementById('tradeModalProduct').textContent;
  const quantity = parseInt(document.querySelector('[placeholder="Enter quantity"]').value);
  const price = parseFloat(document.querySelector('[placeholder="0.00"]').value);
  const minOrder = parseInt(document.querySelector('[placeholder="Minimum order"]').value);

  let result;
  if (type === 'buy') {
    result = await createBuyOrder({
      buyerId: 1, // Replace with current user ID
      productName: product,
      quantity,
      pricePerUnit: price
    });
  } else {
    result = await createSellListing({
      sellerId: 1, // Replace with current user ID
      productName: product,
      quantity,
      pricePerUnit: price,
      minOrder
    });
  }

  if (result) {
    closeTradeModal();
    showToast('✅ Order submitted successfully!');
  } else {
    showToast('❌ Failed to submit order');
  }
}

// Updated addFarmingLog to use API
async function addFarmingLogAPI(e) {
  e.preventDefault();
  
  const block = document.querySelector('[placeholder*="Block"]').value;
  const date = document.querySelector('[type="date"]').value;
  const activity = 'General Activity'; // Can be enhanced with a select dropdown

  const result = await createFarmingLogAPI({
    farmerId: 1, // Replace with current user ID
    block,
    activity,
    description: `Activity on ${new Date(date).toLocaleDateString()}`,
    status: 'Completed',
    date: new Date(date).toISOString()
  });

  if (result) {
    closeFarmingLogModal();
    showToast('✅ Activity logged successfully!');
  } else {
    showToast('❌ Failed to log activity');
  }
}

// Initialize dashboard with API data on page load
async function initializeDashboard() {
  try {
    const overview = await fetchDashboardOverview();
    
    // Update stats on dashboard
    document.querySelectorAll('.stat-value').forEach((el, index) => {
      const values = [
        overview.totalTrees || '2,450',
        overview.totalHarvest + 'T' || '5.2T',
        '$84K', // Revenue - can be added to API
        overview.totalFarmers || '128'
      ];
      el.textContent = values[index] || el.textContent;
    });
  } catch (error) {
    console.error('Error initializing dashboard:', error);
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Export for use in Farm.html
window.farmAPI = {
  fetchAllFarmers,
  fetchFarmerProfile,
  searchFarmersAPI,
  fetchAllProducts,
  fetchMarketplaceListings,
  createBuyOrder,
  createFarmingLogAPI,
  fetchDashboardOverview
};
