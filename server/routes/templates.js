import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory storage for MVP (replace with database in production)
let templates = [
  {
    id: 'default-service-template',
    name: 'Standard Service Contract',
    description: 'A comprehensive template for service-based contracts',
    category: 'Services',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schema: {
      schemaVersion: "1.0.0",
      contractMetadata: {
        contractName: "",
        clientName: "",
        effectiveDate: "",
        projectDescription: ""
      },
      lineItems: [
        {
          id: "sample-1",
          description: "Primary Service",
          costType: "one-off",
          unitCost: 0,
          quantity: 1
        }
      ],
      discounts: []
    }
  },
  {
    id: 'consulting-template',
    name: 'Consulting Agreement',
    description: 'Template for consulting and advisory services',
    category: 'Consulting',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schema: {
      schemaVersion: "1.0.0",
      contractMetadata: {
        contractName: "",
        clientName: "",
        effectiveDate: "",
        projectDescription: ""
      },
      lineItems: [
        {
          id: "consulting-1",
          description: "Consulting Hours",
          costType: "one-off",
          unitCost: 150,
          quantity: 1
        },
        {
          id: "consulting-2",
          description: "Monthly Retainer",
          costType: "monthly",
          unitCost: 2000,
          quantity: 1
        }
      ],
      discounts: []
    }
  }
];

// GET /api/templates - Get all templates
router.get('/', (req, res) => {
  const { category } = req.query;
  
  let filteredTemplates = templates;
  
  if (category) {
    filteredTemplates = templates.filter(t => 
      t.category.toLowerCase() === category.toLowerCase()
    );
  }

  const templateSummaries = filteredTemplates.map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    isDefault: template.isDefault,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt
  }));

  res.json({
    status: 'success',
    data: templateSummaries,
    count: templateSummaries.length
  });
});

// GET /api/templates/categories - Get all template categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(templates.map(t => t.category))];
  
  res.json({
    status: 'success',
    data: categories
  });
});

// GET /api/templates/:id - Get a specific template
router.get('/:id', (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  
  if (!template) {
    throw new NotFoundError('Template not found');
  }

  res.json({
    status: 'success',
    data: template
  });
});

// POST /api/templates - Create a new template
router.post('/', (req, res) => {
  const templateId = uuidv4();
  const now = new Date().toISOString();
  
  const newTemplate = {
    id: templateId,
    name: req.body.name,
    description: req.body.description || '',
    category: req.body.category || 'General',
    isDefault: false,
    createdAt: now,
    updatedAt: now,
    schema: req.body.schema
  };

  templates.push(newTemplate);

  res.status(201).json({
    status: 'success',
    message: 'Template created successfully',
    data: newTemplate
  });
});

// PUT /api/templates/:id - Update an existing template
router.put('/:id', (req, res) => {
  const templateIndex = templates.findIndex(t => t.id === req.params.id);
  
  if (templateIndex === -1) {
    throw new NotFoundError('Template not found');
  }

  const template = templates[templateIndex];
  
  // Don't allow updating default templates
  if (template.isDefault) {
    return res.status(403).json({
      status: 'error',
      message: 'Cannot modify default templates'
    });
  }

  const updatedTemplate = {
    ...template,
    name: req.body.name || template.name,
    description: req.body.description || template.description,
    category: req.body.category || template.category,
    schema: req.body.schema || template.schema,
    updatedAt: new Date().toISOString()
  };

  templates[templateIndex] = updatedTemplate;

  res.json({
    status: 'success',
    message: 'Template updated successfully',
    data: updatedTemplate
  });
});

// DELETE /api/templates/:id - Delete a template
router.delete('/:id', (req, res) => {
  const templateIndex = templates.findIndex(t => t.id === req.params.id);
  
  if (templateIndex === -1) {
    throw new NotFoundError('Template not found');
  }

  const template = templates[templateIndex];
  
  // Don't allow deleting default templates
  if (template.isDefault) {
    return res.status(403).json({
      status: 'error',
      message: 'Cannot delete default templates'
    });
  }

  templates.splice(templateIndex, 1);

  res.json({
    status: 'success',
    message: 'Template deleted successfully'
  });
});

// POST /api/templates/:id/use - Create a new contract from a template
router.post('/:id/use', (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  
  if (!template) {
    throw new NotFoundError('Template not found');
  }

  // Generate new IDs for line items
  const contractData = {
    ...template.schema,
    lineItems: template.schema.lineItems.map(item => ({
      ...item,
      id: uuidv4()
    }))
  };

  res.json({
    status: 'success',
    message: 'Contract initialized from template',
    data: contractData
  });
});

// POST /api/templates/:id/duplicate - Duplicate a template
router.post('/:id/duplicate', (req, res) => {
  const originalTemplate = templates.find(t => t.id === req.params.id);
  
  if (!originalTemplate) {
    throw new NotFoundError('Template not found');
  }

  const templateId = uuidv4();
  const now = new Date().toISOString();

  const duplicatedTemplate = {
    ...originalTemplate,
    id: templateId,
    name: `${originalTemplate.name} (Copy)`,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
    schema: {
      ...originalTemplate.schema,
      lineItems: originalTemplate.schema.lineItems.map(item => ({
        ...item,
        id: uuidv4()
      }))
    }
  };

  templates.push(duplicatedTemplate);

  res.status(201).json({
    status: 'success',
    message: 'Template duplicated successfully',
    data: duplicatedTemplate
  });
});

export default router;
