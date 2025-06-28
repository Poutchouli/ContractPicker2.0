import { writable, derived } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

// Central contract data store
export const contractData = writable({
  schemaVersion: "1.0.0",
  contractMetadata: {
    contractName: "",
    clientName: "",
    effectiveDate: "",
    projectDescription: ""
  },
  lineItems: [],
  discounts: []
});

// Derived store for real-time cost calculation
export const calculatedTotals = derived(
  contractData,
  ($contractData) => {
    let subtotal = 0;
    let monthlyRecurring = 0;
    let yearlyRecurring = 0;

    // Calculate line items subtotal
    $contractData.lineItems.forEach(item => {
      const itemTotal = (item.unitCost || 0) * (item.quantity || 1);
      
      switch(item.costType) {
        case 'one-off':
          subtotal += itemTotal;
          break;
        case 'monthly':
          monthlyRecurring += itemTotal;
          break;
        case 'yearly':
          yearlyRecurring += itemTotal;
          break;
      }
    });

    // Apply discounts to one-off subtotal
    let discountAmount = 0;
    $contractData.discounts.forEach(discount => {
      if (discount.type === 'percentage') {
        discountAmount += subtotal * (discount.value / 100);
      } else if (discount.type === 'fixed') {
        discountAmount += discount.value;
      }
    });

    const finalOneOffTotal = Math.max(0, subtotal - discountAmount);

    return {
      subtotal,
      discountAmount,
      finalOneOffTotal,
      monthlyRecurring,
      yearlyRecurring,
      totalFirstYear: finalOneOffTotal + (monthlyRecurring * 12) + yearlyRecurring
    };
  }
);

// Helper functions for managing contract data
export const contractActions = {
  addLineItem: () => {
    contractData.update(data => ({
      ...data,
      lineItems: [...data.lineItems, {
        id: uuidv4(),
        description: "",
        costType: "one-off",
        unitCost: 0,
        quantity: 1
      }]
    }));
  },

  removeLineItem: (id) => {
    contractData.update(data => ({
      ...data,
      lineItems: data.lineItems.filter(item => item.id !== id)
    }));
  },

  updateLineItem: (id, updates) => {
    contractData.update(data => ({
      ...data,
      lineItems: data.lineItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  },

  addDiscount: () => {
    contractData.update(data => ({
      ...data,
      discounts: [...data.discounts, {
        description: "",
        type: "percentage",
        value: 0
      }]
    }));
  },

  removeDiscount: (index) => {
    contractData.update(data => ({
      ...data,
      discounts: data.discounts.filter((_, i) => i !== index)
    }));
  },

  updateDiscount: (index, updates) => {
    contractData.update(data => ({
      ...data,
      discounts: data.discounts.map((discount, i) => 
        i === index ? { ...discount, ...updates } : discount
      )
    }));
  },

  updateMetadata: (updates) => {
    contractData.update(data => ({
      ...data,
      contractMetadata: { ...data.contractMetadata, ...updates }
    }));
  },

  resetContract: () => {
    contractData.set({
      schemaVersion: "1.0.0",
      contractMetadata: {
        contractName: "",
        clientName: "",
        effectiveDate: "",
        projectDescription: ""
      },
      lineItems: [],
      discounts: []
    });
  },

  loadContract: (contractJson) => {
    try {
      const parsedContract = typeof contractJson === 'string' 
        ? JSON.parse(contractJson) 
        : contractJson;
      
      // Validate basic structure
      if (parsedContract.schemaVersion && parsedContract.contractMetadata) {
        contractData.set(parsedContract);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid contract format' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to parse contract data' };
    }
  }
};

// Authentication store (simplified for MVP)
export const user = writable({
  isAuthenticated: false,
  username: '',
  contracts: []
});

// UI state store
export const uiState = writable({
  currentView: 'dashboard', // dashboard, contract-editor, template-creator
  sidebarOpen: true,
  notifications: []
});

export const uiActions = {
  setView: (view) => {
    uiState.update(state => ({ ...state, currentView: view }));
  },
  
  toggleSidebar: () => {
    uiState.update(state => ({ ...state, sidebarOpen: !state.sidebarOpen }));
  },
  
  addNotification: (message, type = 'info') => {
    const id = uuidv4();
    uiState.update(state => ({
      ...state,
      notifications: [...state.notifications, { id, message, type, timestamp: Date.now() }]
    }));
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      uiState.update(state => ({
        ...state,
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, 5000);
  }
};
