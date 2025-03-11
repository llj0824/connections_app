import { NextResponse } from 'next/server';

// Enhanced error types for better client feedback
export type ApiError = {
  code: string;
  message: string;
  details?: any;
}

export const createErrorResponse = (
  status: number,
  message: string,
  code: string = 'ERROR',
  details?: any
) => {
  const error: ApiError = {
    code,
    message
  };
  
  if (details) {
    error.details = details;
  }
  
  return NextResponse.json({ error }, { 
    status,
    headers: corsHeaders
  });
};

export const createSuccessResponse = <T>(
  data: T,
  status: number = 200
) => {
  return NextResponse.json(data, { 
    status,
    headers: corsHeaders 
  });
};

// Predefined error types for consistency
export const ErrorTypes = {
  UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401, message: 'Authentication required' },
  FORBIDDEN: { code: 'FORBIDDEN', status: 403, message: 'You do not have permission to access this resource' },
  NOT_FOUND: { code: 'NOT_FOUND', status: 404, message: 'Resource not found' },
  BAD_REQUEST: { code: 'BAD_REQUEST', status: 400, message: 'Invalid request' },
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 400, message: 'Validation error' },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500, message: 'Internal server error' },
};

// Helper function to create standardized errors
export const createStandardError = (errorType: keyof typeof ErrorTypes, message?: string, details?: any) => {
  const error = ErrorTypes[errorType];
  return createErrorResponse(
    error.status,
    message || error.message,
    error.code,
    details
  );
};

// CORS headers for API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}; 