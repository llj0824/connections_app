import { NextRequest } from 'next/server';
import { User, findUserById, updateUser } from '@/src/models/user';
import { createErrorResponse, createSuccessResponse, corsHeaders } from '@/src/utils/api';
import { getCurrentUser } from '@/src/utils/auth';

// GET /api/profile - Get the current user's profile
export async function GET(request: NextRequest) {
  // For simplicity, we'll use a mock user (ID:1) 
  // In a real app, this would validate a JWT token from headers
  const user = getCurrentUser();

  if (!user) {
    return createErrorResponse(401, 'Unauthorized');
  }

  // Don't return sensitive information like passwords
  const { id, name, email, bio } = user;
  return createSuccessResponse({ user: { id, name, email, bio } });
}

// PUT /api/profile - Update the current user's profile
export async function PUT(request: NextRequest) {
  // In a real app, this would validate a JWT token from headers
  const user = getCurrentUser();

  if (!user) {
    return createErrorResponse(401, 'Unauthorized');
  }

  // Parse request body
  try {
    const body = await request.json();
    const { name, bio } = body;

    // Validate input (simple validation for demonstration)
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return createErrorResponse(400, 'Name cannot be empty');
    }

    // Only update fields that were provided in the request
    const updates: Partial<User> = {};
    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;

    // Update the user
    const updatedUser = updateUser(user.id, updates);
    if (!updatedUser) {
      return createErrorResponse(404, 'User not found');
    }

    // Return the updated user (excluding sensitive info)
    const { id, name: updatedName, email, bio: updatedBio } = updatedUser;
    return createSuccessResponse({ user: { id, name: updatedName, email, bio: updatedBio } });
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