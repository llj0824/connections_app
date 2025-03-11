export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

// In-memory storage for users
export const users: User[] = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    bio: 'This is a default test user for development.'
  }
];

// Helper functions to work with the users array
export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    return updatedUser;
  }
  return undefined;
}; 