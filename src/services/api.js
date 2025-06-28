/**
 * API Service for Contract Management Platform
 * Provides centralized API communication with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic API request handler with error handling
 * @param {string} endpoint 
 * @param {RequestInit} options 
 * @returns {Promise<any>}
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Contract API endpoints
 */
export const contractAPI = {
  /**
   * Get all contracts for the current user
   * @returns {Promise<Array>}
   */
  async getContracts() {
    return apiRequest('/api/contracts');
  },

  /**
   * Save a new or updated contract
   * @param {Object} contractData 
   * @returns {Promise<Object>}
   */
  async saveContract(contractData) {
    return apiRequest('/api/contracts', {
      method: 'POST',
      body: JSON.stringify(contractData),
    });
  },

  /**
   * Get a specific contract by ID
   * @param {string} contractId 
   * @returns {Promise<Object>}
   */
  async getContract(contractId) {
    return apiRequest(`/api/contracts/${contractId}`);
  },

  /**
   * Update an existing contract
   * @param {string} contractId 
   * @param {Object} contractData 
   * @returns {Promise<Object>}
   */
  async updateContract(contractId, contractData) {
    return apiRequest(`/api/contracts/${contractId}`, {
      method: 'PUT',
      body: JSON.stringify(contractData),
    });
  },

  /**
   * Delete a contract
   * @param {string} contractId 
   * @returns {Promise<Object>}
   */
  async deleteContract(contractId) {
    return apiRequest(`/api/contracts/${contractId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Validate contract data against schema
   * @param {Object} contractData 
   * @returns {Promise<Object>}
   */
  async validateContract(contractData) {
    return apiRequest('/api/validation/contract', {
      method: 'POST',
      body: JSON.stringify(contractData),
    });
  }
};

/**
 * Template API endpoints
 */
export const templateAPI = {
  /**
   * Get all available templates
   * @returns {Promise<Array>}
   */
  async getTemplates() {
    return apiRequest('/api/templates');
  },

  /**
   * Create a new template
   * @param {Object} templateData 
   * @returns {Promise<Object>}
   */
  async createTemplate(templateData) {
    return apiRequest('/api/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>}
 */
export async function healthCheck() {
  return apiRequest('/health');
}
