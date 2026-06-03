(async function(){
  // Ensure API client is loaded
  if (!window.farmAPI) {
    console.error('farmAPI not loaded');
    return;
  }

  const api = window.farmAPI;

  // On page load, populate farmers and products
  async function init() {
    try {
      // Check backend health
      const connected = await api.checkConnection();
      if (!connected) {
        UIHelper.showToast('Backend not reachable. Run the backend server.', 'error', 5000);
        return;
      }

      // Check if user is logged in
      if (!api.getCurrentFarmer()) {
        window.location.href = 'login.html';
        return;
      }

      // Load logged in farmer info to personalize UI
      try {
        const currentFarmer = await api.getFarmer(api.getCurrentFarmer());
        if (currentFarmer) {
          const greetingEl = document.getElementById('currentFarmerGreetingName');
          if (greetingEl) {
            greetingEl.textContent = currentFarmer.name;
          }
          const avatarEl = document.getElementById('currentFarmerAvatar');
          if (avatarEl) {
            avatarEl.textContent = currentFarmer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
          }
          // Pre-populate add farming log or orders with current farmer name
          const stats = await api.getFarmerStats(currentFarmer.id).catch(() => null);
          if (stats) {
            const statEls = document.querySelectorAll('.stat-value');
            if (statEls && statEls.length >= 4) {
              statEls[0].textContent = stats.totalTrees || currentFarmer.numberOfTrees || '0';
              statEls[1].textContent = (stats.totalHarvest ? stats.totalHarvest + 'T' : '0T');
              statEls[2].textContent = UIHelper.formatCurrency(stats.totalRevenue || 0);
              statEls[3].textContent = currentFarmer.transactionCount || '0';
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load current farmer profile details:', err);
      }

      // Fetch dashboard overview and populate stats
      const overview = await api.getDashboardOverview();

      // Map to dashboard stat elements
      const statEls = document.querySelectorAll('.stat-value');
      if (statEls && statEls.length >= 4) {
        statEls[0].textContent = overview.totalTrees || '2,450';
        statEls[1].textContent = (overview.totalHarvest ? overview.totalHarvest + 'T' : '5.2T');
        statEls[2].textContent = '$84K';
        statEls[3].textContent = overview.totalFarmers || '128';
      }

      // Fetch and display farmers
      const farmers = await api.getAllFarmers();
      const farmersGrid = document.getElementById('farmersGrid');
      if (farmersGrid) {
        farmersGrid.innerHTML = farmers.map(f => UIHelper.createFarmerCard(f)).join('');
      }

      // Fetch and display products
      const products = await api.getAllProducts();
      const productsGrid = document.getElementById('productsGrid');
      if (productsGrid) {
        productsGrid.innerHTML = products.map(p => UIHelper.createProductCard(p)).join('');
      }

      // Attach global view handlers
      window.viewFarmerDetails = async (id) => {
        const farmer = await api.getFarmer(id);
        if (!farmer) return;
        // populate modal
        const modal = document.getElementById('farmerModalContent');
        modal.innerHTML = `
          <div class="p-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-green-500 flex items-center justify-center text-white font-bold text-2xl">${farmer.name.substring(0,2).toUpperCase()}</div>
              <div>
                <h3 class="text-xl font-bold text-gray-800">${farmer.name}</h3>
                <p class="text-sm text-gray-500">📍 ${farmer.location}</p>
                <div class="flex items-center gap-2 mt-1"><span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span><span class="text-xs text-gray-500">⭐ ${farmer.rating}</span></div>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-6">${farmer.bio || ''}</p>
            <div class="grid grid-cols-3 gap-3 mb-6">
              <div class="bg-green-50 rounded-xl p-3 text-center"><p class="font-bold text-green-700">${farmer.numberOfTrees}</p><p class="text-xs text-green-600">Trees</p></div>
              <div class="bg-amber-50 rounded-xl p-3 text-center"><p class="font-bold text-amber-700">${farmer.totalHarvest}T</p><p class="text-xs text-amber-600">Harvest</p></div>
              <div class="bg-blue-50 rounded-xl p-3 text-center"><p class="font-bold text-blue-700">${farmer.yearsOfExperience}yr</p><p class="text-xs text-blue-600">Exp</p></div>
            </div>
            <div class="flex gap-3">
              <button onclick="UIHelper.closeModal('farmerModal');" class="flex-1 border-2 border-amber-200 text-amber-700 py-3 rounded-xl font-medium hover:bg-amber-50 transition">Close</button>
              <button onclick="UIHelper.closeModal('farmerModal');" class="flex-1 gradient-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition">Trade</button>
            </div>
          </div>
        `;
        UIHelper.openModal('farmerModal');
      };

      window.viewProductDetails = async (id) => {
        const product = await api.getProduct(id);
        if (!product) return;
        const modal = document.getElementById('productModalContent');
        modal.innerHTML = `
          <div class="text-center mb-4">
            <div class="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-amber-100 to-green-100 flex items-center justify-center text-6xl mb-4">🥜</div>
            <h3 class="text-xl font-bold text-gray-800">${product.name}</h3>
            <p class="text-2xl font-bold text-green-600 mt-2">${UIHelper.formatCurrency(product.price)}</p>
          </div>
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm p-3 bg-gray-50 rounded-lg"><span class="text-gray-500">Grade</span><span class="font-medium">${product.grade || 'A'}</span></div>
            <div class="flex justify-between text-sm p-3 bg-gray-50 rounded-lg"><span class="text-gray-500">Origin</span><span class="font-medium">${product.origin || 'West Africa'}</span></div>
            <div class="flex justify-between text-sm p-3 bg-gray-50 rounded-lg"><span class="text-gray-500">Stock</span><span class="font-medium text-green-600">${product.quantity} ${product.unit || ''}</span></div>
            <div class="flex justify-between text-sm p-3 bg-gray-50 rounded-lg"><span class="text-gray-500">Min Order</span><span class="font-medium">${product.minOrder || 1}</span></div>
          </div>
          <div class="flex gap-3">
            <button onclick="UIHelper.closeModal('productModal');" class="flex-1 gradient-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition">Buy Now</button>
            <button onclick="UIHelper.closeModal('productModal');" class="flex-1 border-2 border-amber-200 text-amber-700 py-3 rounded-xl font-medium hover:bg-amber-50 transition">Add to Cart</button>
          </div>
        `;
        UIHelper.openModal('productModal');
      };

      window.handleLogout = () => {
        api.logout();
        window.location.href = 'login.html';
      };

      // Hook up add farmer form
      const addFarmerForm = document.getElementById('addFarmerForm');
      if (addFarmerForm) {
        addFarmerForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const data = UIHelper.getFormData('addFarmerForm');
          const payload = {
            name: data.firstName + ' ' + data.lastName,
            location: data.location,
            phone: data.phone,
            email: data.email,
            numberOfTrees: parseInt(data.numberOfTrees),
            yearsOfExperience: parseInt(data.yearsOfExperience),
            specialization: data.specialization || 'General',
            bio: data.bio || ''
          };
          try {
            UIHelper.setButtonLoading('addFarmerSubmit', true);
            await api.createFarmer(payload);
            UIHelper.showToast('Farmer added successfully');
            UIHelper.closeModal('addFarmerModal');
            const farmers = await api.getAllFarmers();
            document.getElementById('farmersGrid').innerHTML = farmers.map(f => UIHelper.createFarmerCard(f)).join('');
          } catch (err) {
            UIHelper.showToast('Failed to add farmer', 'error');
          } finally {
            UIHelper.setButtonLoading('addFarmerSubmit', false);
          }
        });
      }

      // Hook up farming log form
      const farmingLogForm = document.getElementById('farmingLogForm');
      if (farmingLogForm) {
        farmingLogForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const data = UIHelper.getFormData('farmingLogForm');
          const payload = {
            farmerId: api.getCurrentFarmer(),
            block: data.block,
            activity: data.activity,
            description: data.description,
            quantity: parseFloat(data.quantity),
            unit: data.unit || null,
            status: data.status || 'Completed',
            date: data.date || new Date().toISOString()
          };
          try {
            UIHelper.setButtonLoading('farmingLogSubmit', true);
            await api.createFarmingLog(payload);
            UIHelper.showToast('Activity logged successfully');
            UIHelper.closeModal('farmingLogModal');
            const logs = await api.getFarmerLogs(api.getCurrentFarmer());
            document.getElementById('farmingLogs').innerHTML = logs.map(l => `\n              <div class="flex items-center gap-4 p-3 bg-green-50 rounded-xl border border-green-100">\n                <div class="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center text-green-700 font-bold text-sm">${UIHelper.formatDate(l.date)}</div>\n                <div class="flex-1">\n                  <p class="font-medium text-gray-800">${l.activity}</p>\n                  <p class="text-sm text-gray-500">${l.block} • ${UIHelper.formatDate(l.date)}</p>\n                </div>\n                <span class="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">${l.status}</span>\n              </div>\n            `).join('');
          } catch (err) {
            UIHelper.showToast('Failed to log activity', 'error');
          } finally {
            UIHelper.setButtonLoading('farmingLogSubmit', false);
          }
        });
      }

      // Hook up trade submit
      const tradeForm = document.getElementById('tradeForm');
      if (tradeForm) {
        tradeForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const data = UIHelper.getFormData('tradeForm');
          const type = document.getElementById('tradeModalTitle').textContent.includes('Buy') ? 'buy' : 'sell';
          const payload = {
            buyerId: api.getCurrentFarmer(),
            sellerId: api.getCurrentFarmer(),
            productName: document.getElementById('tradeModalProduct').textContent,
            quantity: parseFloat(data.quantity),
            pricePerUnit: parseFloat(data.price),
            minOrder: parseFloat(data.minOrder)
          };
          try {
            UIHelper.setButtonLoading('tradeSubmit', true);
            if (type === 'buy') await api.createBuyOrder(payload);
            else await api.createSellOrder({ sellerId: payload.sellerId, productName: payload.productName, quantity: payload.quantity, pricePerUnit: payload.pricePerUnit, minOrder: payload.minOrder });
            UIHelper.showToast('Order submitted successfully');
            UIHelper.closeModal('tradeModal');
          } catch (err) {
            UIHelper.showToast('Failed to submit order', 'error');
          } finally {
            UIHelper.setButtonLoading('tradeSubmit', false);
          }
        });
      }

      // Initialize mobile nav buttons (if any)
      document.querySelectorAll('.mobile-nav').forEach(btn => btn.addEventListener('click', (e) => {
        const tab = btn.dataset.tab;
        if (tab) switchTab(tab);
      }));

    } catch (err) {
      console.error('Initialization error:', err);
      UIHelper.showToast('Initialization failed', 'error');
    }
  }

  // Run initialization after DOM content loaded
  document.addEventListener('DOMContentLoaded', init);
})();
