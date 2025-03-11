import { createSuccessResponse, corsHeaders } from '@/src/utils/api';

export async function GET() {
  return createSuccessResponse({
    status: 'ok',
    message: 'API is up and running',
    timestamp: new Date().toISOString()
  });
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
} 