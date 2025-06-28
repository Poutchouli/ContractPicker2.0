import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateContractData, validateContractManually } from '../middleware/validation.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory storage for MVP (replace with database in production)
let contracts = [];

// GET /api/contracts - Get all contracts for a user
router.get('/', (req, res) => {
  // In MVP, return all contracts (in production, filter by user)
  const contractSummaries = contracts.map(contract => ({
    id: contract.id,
    contractName: contract.contractMetadata.contractName,
    clientName: contract.contractMetadata.clientName,
    effectiveDate: contract.contractMetadata.effectiveDate,
    status: contract.status || 'Draft',
    createdAt: contract.createdAt,
    updatedAt: contract.updatedAt,
    totalValue: calculateContractTotal(contract)
  }));

  res.json({
    status: 'success',
    data: contractSummaries,
    count: contractSummaries.length
  });
});

// GET /api/contracts/:id - Get a specific contract
router.get('/:id', (req, res) => {
  const contract = contracts.find(c => c.id === req.params.id);
  
  if (!contract) {
    throw new NotFoundError('Contract not found');
  }

  res.json({
    status: 'success',
    data: contract
  });
});

// POST /api/contracts - Create a new contract
router.post('/', validateContractData, (req, res) => {
  const contractId = uuidv4();
  const now = new Date().toISOString();
  
  // Ensure all line items have IDs
  const lineItemsWithIds = req.body.lineItems.map(item => ({
    ...item,
    id: item.id || uuidv4()
  }));

  const newContract = {
    id: contractId,
    ...req.body,
    lineItems: lineItemsWithIds,
    status: 'Draft',
    createdAt: now,
    updatedAt: now
  };

  contracts.push(newContract);

  res.status(201).json({
    status: 'success',
    message: 'Contract created successfully',
    data: newContract
  });
});

// PUT /api/contracts/:id - Update an existing contract
router.put('/:id', validateContractData, (req, res) => {
  const contractIndex = contracts.findIndex(c => c.id === req.params.id);
  
  if (contractIndex === -1) {
    throw new NotFoundError('Contract not found');
  }

  // Ensure all line items have IDs
  const lineItemsWithIds = req.body.lineItems.map(item => ({
    ...item,
    id: item.id || uuidv4()
  }));

  const updatedContract = {
    ...contracts[contractIndex],
    ...req.body,
    lineItems: lineItemsWithIds,
    updatedAt: new Date().toISOString()
  };

  contracts[contractIndex] = updatedContract;

  res.json({
    status: 'success',
    message: 'Contract updated successfully',
    data: updatedContract
  });
});

// DELETE /api/contracts/:id - Delete a contract
router.delete('/:id', (req, res) => {
  const contractIndex = contracts.findIndex(c => c.id === req.params.id);
  
  if (contractIndex === -1) {
    throw new NotFoundError('Contract not found');
  }

  contracts.splice(contractIndex, 1);

  res.json({
    status: 'success',
    message: 'Contract deleted successfully'
  });
});

// POST /api/contracts/:id/duplicate - Duplicate a contract
router.post('/:id/duplicate', (req, res) => {
  const originalContract = contracts.find(c => c.id === req.params.id);
  
  if (!originalContract) {
    throw new NotFoundError('Contract not found');
  }

  const contractId = uuidv4();
  const now = new Date().toISOString();

  // Create new line items with new IDs
  const newLineItems = originalContract.lineItems.map(item => ({
    ...item,
    id: uuidv4()
  }));

  const duplicatedContract = {
    ...originalContract,
    id: contractId,
    lineItems: newLineItems,
    contractMetadata: {
      ...originalContract.contractMetadata,
      contractName: `${originalContract.contractMetadata.contractName} (Copy)`
    },
    status: 'Draft',
    createdAt: now,
    updatedAt: now
  };

  contracts.push(duplicatedContract);

  res.status(201).json({
    status: 'success',
    message: 'Contract duplicated successfully',
    data: duplicatedContract
  });
});

// POST /api/contracts/validate - Validate contract data without saving
router.post('/validate', (req, res) => {
  const validationResult = validateContractManually(req.body);
  
  if (!validationResult.isValid) {
    return res.status(400).json({
      status: 'validation_failed',
      message: 'Contract validation failed',
      errors: validationResult.errors
    });
  }

  const totals = calculateContractTotal(req.body);

  res.json({
    status: 'valid',
    message: 'Contract data is valid',
    totals
  });
});

// Helper function to calculate contract totals
function calculateContractTotal(contract) {
  let subtotal = 0;
  let monthlyRecurring = 0;
  let yearlyRecurring = 0;

  // Calculate line items
  contract.lineItems.forEach(item => {
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
  if (contract.discounts) {
    contract.discounts.forEach(discount => {
      if (discount.type === 'percentage') {
        discountAmount += subtotal * (discount.value / 100);
      } else if (discount.type === 'fixed') {
        discountAmount += discount.value;
      }
    });
  }

  const finalOneOffTotal = Math.max(0, subtotal - discountAmount);
  const totalFirstYear = finalOneOffTotal + (monthlyRecurring * 12) + yearlyRecurring;

  return {
    subtotal,
    discountAmount,
    finalOneOffTotal,
    monthlyRecurring,
    yearlyRecurring,
    totalFirstYear
  };
}

export default router;
