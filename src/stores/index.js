import { writable, derived } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import Ajv from 'ajv';
import contractSchema from '../schemas/contract-schema.json';
import { contractAPI } from '../services/api.js';

// Initialize AJV validator with schema
const ajv = new Ajv({ allErrors: true });
const validateContract = ajv.compile(contractSchema);

/**
 * @typedef {Object} LineItem
 * @property {string} id
 * @property {string} description
 * @property {'one-off'|'monthly'|'yearly'} costType
 * @property {number} unitCost
 * @property {number} quantity
 */

/**
 * @typedef {Object} Discount
 * @property {string} description
 * @property {'percentage'|'fixed'} type
 * @property {number} value
 */

/**
 * @typedef {Object} ContractMetadata
 * @property {string} contractName
 * @property {string} clientName
 * @property {string} effectiveDate
 * @property {string} projectDescription
 */

/**
 * @typedef {Object} ContractData
 * @property {string} schemaVersion
 * @property {ContractMetadata} contractMetadata
 * @property {LineItem[]} lineItems
 * @property {Discount[]} discounts
 */

// Central contract data store
export const contractData = writable(/** @type {ContractData} */ ({
  schemaVersion: "1.0.0",
  contractMetadata: {
    contractName: "",
    clientName: "",
    effectiveDate: "",
    projectDescription: ""
  },
  lineItems: /** @type {LineItem[]} */ ([]),
  discounts: /** @type {Discount[]} */ ([])
}));

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
      totalFirstYear: finalOneOffTotal + (monthlyRecurring * 12) + yearlyRecurring,
      lineItemCount: $contractData.lineItems.length,
      discountCount: $contractData.discounts.length
    };
  }
);

// Helper functions for managing contract data
export const contractActions = {
  addLineItem: () => {
    contractData.update(data => ({
      ...data,
      lineItems: [...data.lineItems, /** @type {LineItem} */ ({
        id: uuidv4(),
        description: "",
        costType: "one-off",
        unitCost: 0,
        quantity: 1
      })]
    }));
  },

  /**
   * @param {string} id
   */
  removeLineItem: (id) => {
    contractData.update(data => ({
      ...data,
      lineItems: data.lineItems.filter(item => item.id !== id)
    }));
  },

  /**
   * @param {string} id
   * @param {Partial<LineItem>} updates
   */
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
      discounts: [...data.discounts, /** @type {Discount} */ ({
        description: "",
        type: "percentage",
        value: 0
      })]
    }));
  },

  /**
   * @param {number} index
   */
  removeDiscount: (index) => {
    contractData.update(data => ({
      ...data,
      discounts: data.discounts.filter((_, i) => i !== index)
    }));
  },

  /**
   * @param {number} index
   * @param {Partial<Discount>} updates
   */
  updateDiscount: (index, updates) => {
    contractData.update(data => ({
      ...data,
      discounts: data.discounts.map((discount, i) => 
        i === index ? { ...discount, ...updates } : discount
      )
    }));
  },

  /**
   * @param {Partial<ContractMetadata>} updates
   */
  updateMetadata: (updates) => {
    contractData.update(data => ({
      ...data,
      contractMetadata: { ...data.contractMetadata, ...updates }
    }));
  },

  resetContract: () => {
    contractData.set(/** @type {ContractData} */ ({
      schemaVersion: "1.0.0",
      contractMetadata: {
        contractName: "",
        clientName: "",
        effectiveDate: "",
        projectDescription: ""
      },
      lineItems: [],
      discounts: []
    }));
  },

  /**
   * @param {string | Object} contractJson
   */
  loadContract: (contractJson) => {
    try {
      const parsedContract = typeof contractJson === 'string' 
        ? JSON.parse(contractJson) 
        : contractJson;
      
      // Validate against JSON Schema
      const isValid = validateContract(parsedContract);
      
      if (!isValid) {
        const errors = validateContract.errors || [];
        const errorMessages = errors.map(err => `${err.instancePath || 'root'}: ${err.message}`);
        return { 
          success: false, 
          error: `Schema validation failed: ${errorMessages.join(', ')}`,
          validationErrors: errors
        };
      }
      
      // Ensure line items have IDs
      if (parsedContract.lineItems && Array.isArray(parsedContract.lineItems)) {
        parsedContract.lineItems = parsedContract.lineItems.map(/** @param {any} item */ item => ({
          ...item,
          id: item.id || uuidv4()
        }));
      }
      
      contractData.set(/** @type {ContractData} */ (parsedContract));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to parse contract data: ' + (error instanceof Error ? error.message : 'Unknown error') };
    }
  },

  validateCurrentContract: () => {
    let currentContract;
    const unsubscribe = contractData.subscribe(data => { currentContract = data; });
    unsubscribe();
    
    const isValid = validateContract(currentContract);
    return {
      isValid,
      errors: validateContract.errors || []
    };
  },

  /**
   * Save contract to backend
   * @param {Object} contractDataToSave 
   * @returns {Promise<Object>}
   */
  async saveToBackend(contractDataToSave) {
    try {
      const result = await contractAPI.saveContract(contractDataToSave);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Load contract from backend
   * @param {string} contractId 
   * @returns {Promise<Object>}
   */
  async loadFromBackend(contractId) {
    try {
      const contractData = await contractAPI.getContract(contractId);
      const loadResult = contractActions.loadContract(contractData);
      if (loadResult.success) {
        return { success: true, data: contractData };
      } else {
        return { success: false, error: loadResult.error };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  /**
   * Get all contracts from backend
   * @returns {Promise<Object>}
   */
  async getAllContracts() {
    try {
      const contracts = await contractAPI.getContracts();
      return { success: true, data: contracts };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} message
 * @property {'success'|'error'|'warning'|'info'} type
 * @property {number} timestamp
 */

/**
 * @typedef {Object} UIState
 * @property {'dashboard'|'contract-editor'|'template-creator'} currentView
 * @property {boolean} sidebarOpen
 * @property {Notification[]} notifications
 */

// Authentication store (simplified for MVP)
export const user = writable({
  isAuthenticated: false,
  username: '',
  contracts: []
});

// UI state store
export const uiState = writable(/** @type {UIState} */ ({
  currentView: 'dashboard', // dashboard, contract-editor, template-creator
  sidebarOpen: true,
  notifications: /** @type {Notification[]} */ ([])
}));

export const uiActions = {
  /**
   * @param {'dashboard'|'contract-editor'|'template-creator'} view
   */
  setView: (view) => {
    uiState.update(state => ({ ...state, currentView: view }));
  },
  
  toggleSidebar: () => {
    uiState.update(state => ({ ...state, sidebarOpen: !state.sidebarOpen }));
  },
  
  /**
   * @param {string} message
   * @param {'success'|'error'|'warning'|'info'} type
   */
  addNotification: (message, type = 'info') => {
    const id = uuidv4();
    uiState.update(state => ({
      ...state,
      notifications: [...state.notifications, /** @type {Notification} */ ({ id, message, type, timestamp: Date.now() })]
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
