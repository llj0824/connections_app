import { User, findUserById } from '../models/user';

// For simplicity, we'll mock authentication without actual JWT
// In a real app, this would use JWT or similar tokens

// This is just for mock purposes
export interface AuthRequest {
  user?: User;
}

// Mock function to simulate auth middleware
export const getCurrentUser = (userId: string = '1'): User | undefined => {
  // In a real app, this would decode a JWT token and find the user
  // For now, we'll always return our test user if userId matches
  return findUserById(userId);
}; 