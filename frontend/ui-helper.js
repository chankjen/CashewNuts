/**
 * Chakin Farm Frontend - UI Helper Library
 * Common UI functions and utilities
 */

class UIHelper {
  // Toast notifications
  static showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast') || this.createToastElement();
    const toastMessage = toast.querySelector('#toastMessage');
    
    toast.classList.remove('hidden', 'bg-gray-900', 'bg-green-600', 'bg-red-600', 'bg-blue-600');
    
    const bgColor = type === 'error' ? 'bg-red-600' : type === 'warning' ? 'bg-blue-600' : 'bg-green-600';
    toast.classList.add(bgColor);
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => toast.classList.add('hidden'), duration);
  }

  static createToastElement() {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'hidden fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] text-white px-6 py-3 rounded-xl shadow-xl text-sm font-medium transition-all duration-300';
    toast.innerHTML = '<span id="toastMessage"></span>';
    document.body.appendChild(toast);
    return toast;
  }

  // Loading spinner
  static showLoading(element = null) {
    if (element) {
      element.innerHTML = `
        <div class="flex items-center justify-center p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      `;
    }
  }

  static hideLoading(element = null) {
    if (element) {
      element.innerHTML = '';
    }
  }

  // Format currency
  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Format date
  static formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format date time
  static formatDateTime(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Create card element
  static createCard(title, content, className = '') {
    return `
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-amber-50 ${className}">
        <h3 class="font-bold text-gray-800 mb-4">${title}</h3>
        ${content}
      </div>
    `;
  }

  // Create stat card
  static createStatCard(icon, label, value, trend = null, trendClass = '') {
    const trendHTML = trend ? `<span class="text-xs font-semibold ${trendClass} px-2 py-1 rounded-full">${trend}</span>` : '';
    return `
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-amber-50">
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl">${icon}</span>
          ${trendHTML}
        </div>
        <p class="text-2xl font-bold text-gray-800">${value}</p>
        <p class="text-xs text-gray-500">${label}</p>
      </div>
    `;
  }

  // Create farmer card
  static createFarmerCard(farmer) {
    return `
      <div class="farmer-card bg-white rounded-2xl p-5 shadow-sm border border-amber-50 cursor-pointer hover:shadow-lg transition" onclick="viewFarmerDetails('${farmer.id}')">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-green-500 flex items-center justify-center text-white font-bold">
            ${farmer.name.substring(0, 1)}
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-gray-800 text-sm">${farmer.name}</h4>
            <p class="text-xs text-gray-500">${farmer.location}</p>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-yellow-500">⭐</span>
            <span class="text-xs font-semibold">${farmer.rating}</span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <div class="bg-green-50 p-2 rounded">
            <p class="font-bold text-green-700">${farmer.numberOfTrees}</p>
            <p class="text-gray-600">Trees</p>
          </div>
          <div class="bg-amber-50 p-2 rounded">
            <p class="font-bold text-amber-700">${farmer.totalHarvest}T</p>
            <p class="text-gray-600">Harvest</p>
          </div>
          <div class="bg-blue-50 p-2 rounded">
            <p class="font-bold text-blue-700">${farmer.yearsOfExperience}yr</p>
            <p class="text-gray-600">Exp</p>
          </div>
        </div>
      </div>
    `;
  }

  // Create product card
  static createProductCard(product) {
    const stockClass = product.quantity > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50';
    const stockText = product.quantity > 0 ? 'In Stock' : 'Out of Stock';
    return `
      <div class="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-50 cursor-pointer hover:shadow-lg transition" onclick="viewProductDetails('${product.id}')">
        <div class="w-full h-32 bg-gradient-to-br from-amber-100 to-green-100 flex items-center justify-center text-4xl">
          🥜
        </div>
        <div class="p-3">
          <h4 class="font-semibold text-gray-800 text-sm mb-1">${product.name}</h4>
          <p class="text-xs text-gray-500 mb-2">${product.origin || 'West Africa'}</p>
          <div class="flex justify-between items-center">
            <span class="font-bold text-green-600 text-sm">${UIHelper.formatCurrency(product.price)}</span>
            <span class="text-xs px-2 py-1 rounded-full ${stockClass}">${stockText}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Create order card
  static createOrderCard(order) {
    const statusColors = {
      'Pending': 'bg-yellow-50 text-yellow-700',
      'Completed': 'bg-green-50 text-green-700',
      'Available': 'bg-blue-50 text-blue-700',
      'Cancelled': 'bg-red-50 text-red-700'
    };
    const statusClass = statusColors[order.status] || 'bg-gray-50 text-gray-700';
    
    return `
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-amber-50">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-gray-800 text-sm">${order.productName}</h4>
            <p class="text-xs text-gray-500">Order #${order.id}</p>
          </div>
          <span class="text-xs px-2 py-1 rounded-full ${statusClass}">${order.status}</span>
        </div>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p class="text-gray-500">Qty</p>
            <p class="font-bold text-gray-800">${order.quantity}</p>
          </div>
          <div>
            <p class="text-gray-500">Price</p>
            <p class="font-bold text-gray-800">${UIHelper.formatCurrency(order.pricePerUnit)}</p>
          </div>
          <div>
            <p class="text-gray-500">Total</p>
            <p class="font-bold text-green-600">${UIHelper.formatCurrency(order.totalPrice)}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Modal helpers
  static openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
  }

  static closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  // Form validation
  static validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    return form.checkValidity();
  }

  static getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  static clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
  }

  // Loading state for buttons
  static setButtonLoading(buttonId, loading = true) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    
    if (loading) {
      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block animate-spin mr-2">⚙️</span>Loading...';
    } else {
      btn.disabled = false;
      btn.innerHTML = btn.dataset.originalText || 'Submit';
    }
  }

  // Progress bar animation
  static animateProgressBar(elementId, targetValue, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = startValue + (targetValue - startValue) * progress;
      
      element.style.width = currentValue + '%';
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
}

// Make UIHelper globally available
window.UIHelper = UIHelper;
