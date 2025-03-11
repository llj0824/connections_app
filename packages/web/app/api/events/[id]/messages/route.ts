import { NextRequest } from 'next/server';
import { findEventById } from '@/src/models/event';
import { findMessagesByEventId, addMessage } from '@/src/models/message';
import { createErrorResponse, createSuccessResponse, corsHeaders } from '@/src/utils/api';
import { getCurrentUser } from '@/src/utils/auth';

// GET /api/events/[id]/messages - Get messages for an event
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
  
  // Check if the user is an attendee
  if (!event.attendees.includes(user.id)) {
    return createErrorResponse(403, 'You must be an attendee to view messages');
  }
  
  const messages = findMessagesByEventId(eventId);
  return createSuccessResponse({ messages });
}

// POST /api/events/[id]/messages - Add a message to an event
export async function POST(
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
  
  // Check if the user is an attendee
  if (!event.attendees.includes(user.id)) {
    return createErrorResponse(403, 'You must be an attendee to post messages');
  }
  
  try {
    const body = await request.json();
    const { text } = body;
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return createErrorResponse(400, 'Message text is required');
    }
    
    const message = addMessage({
      eventId,
      senderId: user.id,
      text: text.trim(),
    });
    
    return createSuccessResponse({ message });
  } catch (error) {
    return createErrorResponse(400, 'Invalid request body');
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
} 