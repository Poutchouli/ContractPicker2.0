// Custom error classes for better error handling
export class ValidationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.details = details;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  constructor(message = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  // Handle specific error types
  switch (err.name) {
    case 'ValidationError':
      statusCode = 400;
      break;
    case 'JsonSchemaValidationError':
      statusCode = 400;
      message = 'JSON Schema validation failed';
      details = err.details;
      break;
    case 'SyntaxError':
      if (err.message.includes('JSON')) {
        statusCode = 400;
        message = 'Invalid JSON format';
      }
      break;
    case 'CastError':
      statusCode = 400;
      message = 'Invalid data format';
      break;
    default:
      // Don't expose internal errors in production
      if (process.env.NODE_ENV === 'production') {
        message = 'Internal server error';
        details = null;
      }
  }

  const errorResponse = {
    status: 'error',
    message,
    timestamp: new Date().toISOString()
  };

  if (details && process.env.NODE_ENV !== 'production') {
    errorResponse.details = details;
  }

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
