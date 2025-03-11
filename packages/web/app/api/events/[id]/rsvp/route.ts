import { NextRequest } from 'next/server';
import { findEventById, events } from '@/src/models/event';
import { createErrorResponse, createSuccessResponse, corsHeaders } from '@/src/utils/api';
import { getCurrentUser } from '@/src/utils/auth';

// POST /api/events/[id]/rsvp - Join an event
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
  
  // Check if the user is already attending
  if (event.attendees.includes(user.id)) {
    return createSuccessResponse({ 
      message: 'You are already attending this event',
      event 
    });
  }
  
  // Add the user to the attendees list
  event.attendees.push(user.id);
  
  return createSuccessResponse({ 
    message: 'RSVP successful',
    event 
  });
}

// DELETE /api/events/[id]/rsvp - Leave an event
export async function DELETE(
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
  
  // Check if the user is attending
  const attendeeIndex = event.attendees.indexOf(user.id);
  if (attendeeIndex === -1) {
    return createSuccessResponse({ 
      message: 'You are not attending this event',
      event 
    });
  }
  
  // Prevent organizers from leaving their own event
  if (event.organizerId === user.id) {
    return createErrorResponse(400, 'Organizers cannot leave their own events');
  }
  
  // Remove the user from the attendees list
  event.attendees.splice(attendeeIndex, 1);
  
  return createSuccessResponse({ 
    message: 'You have left the event',
    event 
  });
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
} 