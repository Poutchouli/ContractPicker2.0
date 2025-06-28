import express from 'express';
import { validateContractManually } from '../middleware/validation.js';

const router = express.Router();

// POST /api/validation/contract - Validate contract data
router.post('/contract', (req, res) => {
  const validationResult = validateContractManually(req.body);
  
  if (!validationResult.isValid) {
    return res.json({
      status: 'invalid',
      isValid: false,
      message: 'Contract validation failed',
      errors: validationResult.errors,
      errorCount: validationResult.errors.length
    });
  }

  res.json({
    status: 'valid',
    isValid: true,
    message: 'Contract data is valid',
    schema: 'contract-schema-v1.0.0'
  });
});

// GET /api/validation/schema - Get the current contract schema
router.get('/schema', (req, res) => {
  import('../schemas/contract-schema.json', { assert: { type: 'json' } })
    .then(schema => {
      res.json({
        status: 'success',
        data: schema.default
      });
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        message: 'Failed to load schema'
      });
    });
});

// POST /api/validation/bulk - Validate multiple contracts
router.post('/bulk', (req, res) => {
  const { contracts } = req.body;
  
  if (!Array.isArray(contracts)) {
    return res.status(400).json({
      status: 'error',
      message: 'Expected an array of contracts'
    });
  }

  const results = contracts.map((contract, index) => {
    const validationResult = validateContractManually(contract);
    
    return {
      index,
      isValid: validationResult.isValid,
      errors: validationResult.errors || []
    };
  });

  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.length - validCount;

  res.json({
    status: 'success',
    summary: {
      total: results.length,
      valid: validCount,
      invalid: invalidCount
    },
    results
  });
});

// GET /api/validation/rules - Get validation rules and constraints
router.get('/rules', (req, res) => {
  const rules = {
    contractMetadata: {
      contractName: {
        required: true,
        minLength: 1,
        maxLength: 200,
        description: 'A unique name for the contract'
      },
      clientName: {
        required: true,
        minLength: 1,
        maxLength: 200,
        description: 'Name of the client organization or individual'
      },
      effectiveDate: {
        required: true,
        format: 'date',
        description: 'Date when the contract becomes effective (YYYY-MM-DD)'
      },
      projectDescription: {
        required: false,
        maxLength: 1000,
        description: 'Optional description of the project or services'
      }
    },
    lineItems: {
      description: {
        required: true,
        minLength: 1,
        maxLength: 500,
        description: 'Description of the service or product'
      },
      costType: {
        required: true,
        enum: ['one-off', 'monthly', 'yearly'],
        description: 'Type of cost: one-time, monthly recurring, or yearly recurring'
      },
      unitCost: {
        required: true,
        type: 'number',
        minimum: 0,
        maximum: 1000000,
        description: 'Cost per unit in dollars'
      },
      quantity: {
        required: true,
        type: 'integer',
        minimum: 1,
        maximum: 10000,
        description: 'Number of units'
      }
    },
    discounts: {
      description: {
        required: true,
        minLength: 1,
        maxLength: 200,
        description: 'Description of the discount'
      },
      type: {
        required: true,
        enum: ['percentage', 'fixed'],
        description: 'Type of discount: percentage or fixed amount'
      },
      value: {
        required: true,
        type: 'number',
        minimum: 0,
        description: 'Discount value (0-100 for percentage, any positive number for fixed)'
      }
    },
    businessRules: {
      maxLineItems: 100,
      maxDiscounts: 10,
      supportedCurrencies: ['USD'],
      dateFormat: 'YYYY-MM-DD',
      schemaVersion: '1.0.0'
    }
  };

  res.json({
    status: 'success',
    data: rules
  });
});

export default router;
