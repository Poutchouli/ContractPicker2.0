<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Dynamic Contract Management Platform - Copilot Instructions

## Project Overview
This is a full-stack contract management platform built with Svelte frontend and Node.js backend, featuring real-time cost calculation and JSON Schema-driven architecture.

## Technology Stack
- **Frontend**: Svelte 4 + Vite
- **Backend**: Node.js + Express
- **Validation**: JSON Schema with AJV
- **State Management**: Svelte stores with reactive calculations
- **Containerization**: Docker + Docker Compose
- **Deployment**: Cross-platform (Windows development → Linux production)

## Key Architecture Principles
1. **JSON Schema as Single Source of Truth**: All contract validation uses the same schema on client and server
2. **Reactive State Management**: Use Svelte stores for real-time updates
3. **Modular Components**: Each component has a single responsibility
4. **Error Handling**: Comprehensive error handling with custom error classes
5. **Security**: Input validation, rate limiting, secure headers

## Code Style Guidelines

### Svelte Components
- Use composition over inheritance
- Keep components focused on single responsibilities
- Use stores for shared state, props for local state
- Prefer semantic HTML with ARIA attributes
- Use CSS custom properties for theming

### Node.js Backend
- Use ES modules (import/export)
- Implement proper error handling with custom error classes
- Validate all inputs using middleware
- Use async/await for asynchronous operations
- Follow RESTful API conventions

### JSON Schema
- Always include descriptive titles and descriptions
- Use proper validation constraints (min/max, patterns)
- Include examples in schema documentation
- Version schemas appropriately

## Component Patterns

### Store Usage
```javascript
// Read from store
let data;
store.subscribe(value => { data = value; });

// Update store
import { storeActions } from '../stores/index.js';
storeActions.updateData(newData);
```

### Error Handling in Components
```javascript
try {
  await apiCall();
  uiActions.addNotification('Success message', 'success');
} catch (error) {
  uiActions.addNotification('Error message', 'error');
}
```

### API Route Structure
```javascript
router.post('/endpoint', validationMiddleware, async (req, res) => {
  try {
    const result = await processData(req.body);
    res.json({ status: 'success', data: result });
  } catch (error) {
    throw new CustomError('Descriptive error message');
  }
});
```

## File Organization
- Components in `/src/components/`
- Stores in `/src/stores/`
- API routes in `/server/routes/`
- Schemas in both `/src/schemas/` and `/server/schemas/`
- Middleware in `/server/middleware/`

## Testing Considerations
- Test business logic in stores
- Test API endpoints with proper validation
- Test component behavior with user interactions
- Mock external dependencies

## Performance Guidelines
- Use Svelte's reactive declarations for computed values
- Implement proper memoization for expensive calculations
- Use derived stores for dependent calculations
- Optimize bundle size with tree shaking

## Security Requirements
- Validate all user inputs on both client and server
- Use HTTPS in production
- Implement proper CORS policies
- Sanitize data before database operations
- Use parameterized queries to prevent injection

## Deployment Practices
- Use multi-stage Docker builds for optimization
- Separate development and production configurations
- Use environment variables for configuration
- Implement health checks for monitoring

When generating code, please follow these patterns and principles to maintain consistency with the existing codebase.
