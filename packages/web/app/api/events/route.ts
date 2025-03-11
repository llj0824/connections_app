import { NextRequest } from 'next/server';
import { Event, events } from '@/src/models/event';
import { createErrorResponse, createSuccessResponse, corsHeaders } from '@/src/utils/api';
import { getCurrentUser } from '@/src/utils/auth';

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  // For security, in a real app we'd check if the user is authenticated
  // But for now we'll make this endpoint public
  const user = getCurrentUser();
  
  if (!user) {
    return createErrorResponse(401, 'Unauthorized');
  }
  
  return createSuccessResponse({ events });
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  const user = getCurrentUser();
  
  if (!user) {
    return createErrorResponse(401, 'Unauthorized');
  }
  
  try {
    const body = await request.json();
    const { title, description, datetime, location } = body;
    
    // Basic validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return createErrorResponse(400, 'Title is required');
    }
    if (!description || typeof description !== 'string') {
      return createErrorResponse(400, 'Description is required');
    }
    if (!datetime || typeof datetime !== 'string') {
      return createErrorResponse(400, 'Datetime is required');
    }
    if (!location || typeof location !== 'string') {
      return createErrorResponse(400, 'Location is required');
    }
    
    // Create a new event
    const newEvent: Event = {
      id: String(events.length + 1), // Simple ID generation for demo
      title,
      description,
      datetime,
      location,
      organizerId: user.id,
      attendees: [user.id], // Organizer is automatically an attendee
    };
    
    // Add to events array
    events.push(newEvent);
    
    return createSuccessResponse({ event: newEvent }, 201);
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