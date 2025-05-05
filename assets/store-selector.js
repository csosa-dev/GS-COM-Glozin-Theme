/**
 * Store Selector functionality
 * Handles store selection, localStorage persistence, and UI updates
 */

var StoreSelector = (function() {
  return {
    init: function() {
      this.bindEvents();
      this.initializeSelectedStore();
    },

    bindEvents: function() {
      const storeSelectors = document.querySelectorAll('[data-store-select]');
      
      storeSelectors.forEach(selector => {
        selector.addEventListener('click', this.handleStoreSelection.bind(this));
      });
    },

    handleStoreSelection: function(e) {
      e.preventDefault();
      const target = e.currentTarget;
      const storeId = target.getAttribute('data-store-id');
      const storeName = target.querySelector('span').textContent;
      
      // Save selected store to localStorage
      this.saveStoreSelection(storeId, storeName);
      
      // Update the header display
      this.updateStoreDisplay(storeName);
      
      // Close dropdown (optional)
      this.closeDropdown(target);
      
      // Publish event for other components to listen to
      this.publishStoreChangeEvent(storeId, storeName);
    },

    saveStoreSelection: function(storeId, storeName) {
      localStorage.setItem('selectedStoreId', storeId);
      localStorage.setItem('selectedStoreName', storeName);
    },

    updateStoreDisplay: function(storeName) {
      const storeDisplay = document.querySelector('#store-selector-bubble .w-store-selector');
      if (storeDisplay) {
        storeDisplay.textContent = storeName;
      }
    },

    closeDropdown: function(target) {
      const dropdown = target.closest('.submenu');
      if (dropdown) {
        dropdown.classList.add('hidden');
        setTimeout(() => dropdown.classList.remove('hidden'), 10);
      }
    },

    publishStoreChangeEvent: function(storeId, storeName) {
      // Use the existing publish function from global.js if available
      if (typeof publish === 'function') {
        publish('store:changed', { id: storeId, name: storeName });
      } else {
        // Fallback to standard event
        const event = new CustomEvent('store:changed', { 
          detail: { id: storeId, name: storeName }
        });
        document.dispatchEvent(event);
      }
    },

    initializeSelectedStore: function() {
      const savedStoreId = localStorage.getItem('selectedStoreId');
      const savedStoreName = localStorage.getItem('selectedStoreName');
      
      if (savedStoreName) {
        this.updateStoreDisplay(savedStoreName);
      }
    }
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  StoreSelector.init();
});