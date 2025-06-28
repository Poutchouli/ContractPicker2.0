import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { ValidationError } from './errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize AJV with formats support
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load the contract schema
const schemaPath = path.join(__dirname, '../schemas/contract-schema.json');
let contractSchema;

try {
  contractSchema = JSON.parse(readFileSync(schemaPath, 'utf8'));
} catch (error) {
  console.error('Failed to load contract schema:', error);
  throw new Error('Contract schema not found or invalid');
}

const validateContract = ajv.compile(contractSchema);

// Contract validation middleware
export const validateContractData = (req, res, next) => {
  const isValid = validateContract(req.body);
  
  if (!isValid) {
    const errors = validateContract.errors.map(error => ({
      field: error.instancePath || error.schemaPath,
      message: error.message,
      value: error.data
    }));
    
    throw new ValidationError('Contract validation failed', errors);
  }
  
  next();
};

// Generic request validation middleware
export const validateRequest = (schema) => {
  const validate = ajv.compile(schema);
  
  return (req, res, next) => {
    const dataToValidate = {
      ...req.body,
      ...req.query,
      ...req.params
    };
    
    const isValid = validate(dataToValidate);
    
    if (!isValid) {
      const errors = validate.errors.map(error => ({
        field: error.instancePath || error.schemaPath,
        message: error.message,
        value: error.data
      }));
      
      throw new ValidationError('Request validation failed', errors);
    }
    
    next();
  };
};

// Manual validation function for use in route handlers
export const validateContractManually = (contractData) => {
  const isValid = validateContract(contractData);
  
  if (!isValid) {
    const errors = validateContract.errors.map(error => ({
      field: error.instancePath || error.schemaPath,
      message: error.message,
      value: error.data
    }));
    
    return { isValid: false, errors };
  }
  
  return { isValid: true };
};
