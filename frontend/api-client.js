/**
 * Chakin Farm API Client
 * Handles all backend communication for the Cashew Farm Manager
 */

class ChakinFarmAPI {
  constructor(baseURL = 'http://localhost:3001/api') {
    this.baseURL = baseURL;
    this.currentFarmerId = parseInt(sessionStorage.getItem('currentFarmerId')) || null;
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: { 'Content-Type': 'application/json' }
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // ============================================
  // FARMERS API
  // ============================================

  async getAllFarmers() {
    return this.request('/farmers');
  }

  async getFarmer(id) {
    return this.request(`/farmers/${id}`);
  }

  async searchFarmers(query) {
    return this.request(`/farmers/search?query=${encodeURIComponent(query)}`);
  }

  async createFarmer(data) {
    return this.request('/farmers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateFarmer(id, data) {
    return this.request(`/farmers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteFarmer(id) {
    return this.request(`/farmers/${id}`, { method: 'DELETE' });
  }

  async getFarmerStats(id) {
    return this.request(`/farmers/${id}/stats`);
  }

  async updateFarmerStats(id, data) {
    return this.request(`/farmers/${id}/stats`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // ============================================
  // PRODUCTS API
  // ============================================

  async getAllProducts() {
    return this.request('/products');
  }

  async getProductsByCategory(category) {
    return this.request(`/products/category/${category}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async searchProducts(query) {
    return this.request(`/products/search?query=${encodeURIComponent(query)}`);
  }

  async createProduct(data) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateProduct(id, data) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  // ============================================
  // LISTINGS API
  // ============================================

  async getFarmerListings(farmerId) {
    return this.request(`/listings/${farmerId}`);
  }

  async createListing(data) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateListing(id, status) {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // ============================================
  // ORDERS/MARKETPLACE API
  // ============================================

  async getMarketplaceListings() {
    return this.request('/marketplace');
  }

  async getMarketplaceByProduct(productName) {
    return this.request(`/marketplace/${encodeURIComponent(productName)}`);
  }

  async getAllOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async getBuyerOrders(farmerId) {
    return this.request(`/orders/buyer/${farmerId}`);
  }

  async getSellerOrders(farmerId) {
    return this.request(`/orders/seller/${farmerId}`);
  }

  async createBuyOrder(data) {
    return this.request('/orders/buy', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async createSellOrder(data) {
    return this.request('/orders/sell', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel`, { method: 'PUT' });
  }

  async deleteOrder(id) {
    return this.request(`/orders/${id}`, { method: 'DELETE' });
  }

  // ============================================
  // FARMING LOGS API
  // ============================================

  async getAllFarmingLogs() {
    return this.request('/farming-logs');
  }

  async getFarmerLogs(farmerId) {
    return this.request(`/farming-logs/${farmerId}`);
  }

  async getLogsByActivity(activity) {
    return this.request(`/farming-logs/activity/${activity}`);
  }

  async getLogsByBlock(farmerId, block) {
    return this.request(`/farming-logs/${farmerId}/block?block=${encodeURIComponent(block)}`);
  }

  async getActivitySummary(farmerId) {
    return this.request(`/farming-logs/${farmerId}/summary`);
  }

  async createFarmingLog(data) {
    return this.request('/farming-logs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateFarmingLog(id, data) {
    return this.request(`/farming-logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteFarmingLog(id) {
    return this.request(`/farming-logs/${id}`, { method: 'DELETE' });
  }

  // ============================================
  // ANALYTICS API
  // ============================================

  async getDashboardOverview() {
    return this.request('/analytics/dashboard');
  }

  async getFarmStatistics(farmerId) {
    return this.request(`/analytics/farm/${farmerId}`);
  }

  async getMarketAnalytics(fromDate, toDate) {
    let endpoint = '/analytics/market';
    if (fromDate || toDate) {
      const params = new URLSearchParams();
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      endpoint += '?' + params.toString();
    }
    return this.request(endpoint);
  }

  async getTopFarmers(limit = 10) {
    return this.request(`/analytics/farmers/top?limit=${limit}`);
  }

  async getTopProducts(limit = 10) {
    return this.request(`/analytics/products/top?limit=${limit}`);
  }

  async getRevenueAnalytics() {
    return this.request('/analytics/revenue');
  }

  async getFarmingActivityStats() {
    return this.request('/analytics/farming-activity');
  }

  async getMonthlyTrends() {
    return this.request('/analytics/trends/monthly');
  }

  async getPerformanceMetrics(farmerId) {
    return this.request(`/analytics/performance/${farmerId}`);
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  setCurrentFarmer(farmerId) {
    this.currentFarmerId = farmerId;
    if (farmerId) {
      sessionStorage.setItem('currentFarmerId', farmerId);
    } else {
      sessionStorage.removeItem('currentFarmerId');
    }
  }

  getCurrentFarmer() {
    return this.currentFarmerId;
  }

  // ============================================
  // AUTHENTICATION API
  // ============================================

  async login(email, password) {
    const user = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (user && user.id) {
      this.currentFarmerId = user.id;
      sessionStorage.setItem('currentFarmerId', user.id);
      sessionStorage.setItem('currentFarmerName', user.name);
      sessionStorage.setItem('currentFarmerEmail', user.email);
    }
    return user;
  }

  async register(data) {
    const user = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (user && user.id) {
      this.currentFarmerId = user.id;
      sessionStorage.setItem('currentFarmerId', user.id);
      sessionStorage.setItem('currentFarmerName', user.name);
      sessionStorage.setItem('currentFarmerEmail', user.email);
    }
    return user;
  }

  logout() {
    this.currentFarmerId = null;
    sessionStorage.removeItem('currentFarmerId');
    sessionStorage.removeItem('currentFarmerName');
    sessionStorage.removeItem('currentFarmerEmail');
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create global instance
window.farmAPI = new ChakinFarmAPI();
