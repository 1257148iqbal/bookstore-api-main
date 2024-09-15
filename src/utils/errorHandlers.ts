// src/utils/errorHandlers.ts

import { Response } from 'express';

/**
 * Handles resource not found errors.
 * 
 * @param res - Express response object.
 * @param message - Custom error message, defaults to 'Resource not found'.
 */
export const handleNotFoundError = (res: Response, message = 'Resource not found') => {
  res.status(404).json({ error: message });
};

/**
 * Handles validation errors.
 * 
 * @param res - Express response object.
 * @param errors - Array of validation errors.
 */
export const handleValidationError = (res: Response, errors: string[]) => {
  res.status(400).json({ errors });
};

/**
 * Handles database connection errors.
 * 
 * @param res - Express response object.
 * @param error - The caught error object.
 */
export const handleDatabaseConnectionError = (res: Response, error: any) => {
  console.error('Database connection error:', error);
  res.status(500).json({ error: 'Database connection error' });
};

/**
 * Handles general server errors.
 * 
 * @param res - Express response object.
 * @param error - The caught error object.
 * @param message - Custom error message, defaults to 'Internal server error'.
 */
export const handleServerError = (res: Response, error: any, message = 'Internal server error') => {
  console.error(message, error);
  res.status(500).json({ error: message });
};
