import { NextRequest } from 'next/server';
import { findEventById } from '@/src/models/event';
import { createErrorResponse, createSuccessResponse, corsHeaders } from '@/src/utils/api';
import { getCurrentUser } from '@/src/utils/auth';

// GET /api/events/[id] - Get a specific event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getCurrentUser();
  
  if (!user) {
    return createErrorResponse(401, 'Unauthorized');
  }
  
  const eventId = params.id;
  const event = findEventById(eventId);
  
  if (!event) {
    return createErrorResponse(404, 'Event not found');
  }
  
  return createSuccessResponse({ event });
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
} 