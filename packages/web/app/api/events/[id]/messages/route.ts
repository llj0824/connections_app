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
  // Authenticate user
  const user = getCurrentUser();
  
  if (!user) {
    return createErrorResponse(401, 'Unauthorized');
  }
  
  const eventId = params.id;
  const event = findEventById(eventId);
  
  if (!event) {
    return createErrorResponse(404, 'Event not found');
  }
  
  // Optionally check if user is an event attendee for access control
  if (!event.attendees.includes(user.id)) {
    return createErrorResponse(403, 'You must be an attendee to view messages');
  }
  
  // Get messages for this event
  const messages = findMessagesByEventId(eventId);
  
  // Sort messages by timestamp
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  return createSuccessResponse({ messages: sortedMessages });
}

// POST /api/events/[id]/messages - Add a new message to an event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Authenticate user
  const user = getCurrentUser();
  
  if (!user) {
    return createErrorResponse(401, 'Unauthorized');
  }
  
  const eventId = params.id;
  const event = findEventById(eventId);
  
  if (!event) {
    return createErrorResponse(404, 'Event not found');
  }
  
  // Ensure user is an attendee
  if (!event.attendees.includes(user.id)) {
    return createErrorResponse(403, 'You must be an attendee to send messages');
  }
  
  try {
    const body = await request.json();
    const { text } = body;
    
    // Validate message text
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return createErrorResponse(400, 'Message text is required');
    }
    
    if (text.length > 500) {
      return createErrorResponse(400, 'Message text is too long (max 500 characters)');
    }
    
    // Add the message
    const newMessage = addMessage({
      eventId,
      senderId: user.id,
      text: text.trim()
    });
    
    return createSuccessResponse({ message: newMessage }, 201);
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