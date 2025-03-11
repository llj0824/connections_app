import { NextResponse } from 'next/server';

export const createErrorResponse = (
  status: number,
  message: string
) => {
  return NextResponse.json({ error: message }, { status });
};

export const createSuccessResponse = <T>(
  data: T,
  status: number = 200
) => {
  return NextResponse.json(data, { status });
};

// CORS headers for API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}; 