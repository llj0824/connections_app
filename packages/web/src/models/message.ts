export interface Message {
  id: string;
  eventId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

// In-memory storage for messages
export const messages: Message[] = [
  {
    id: '1',
    eventId: '1', // Demo event
    senderId: '1', // Test user
    text: 'Welcome to the demo event chat!',
    timestamp: '2023-12-30T18:00:00Z'
  }
];

// Helper functions to work with the messages array
export const findMessagesByEventId = (eventId: string): Message[] => {
  return messages.filter(message => message.eventId === eventId);
};

export const addMessage = (message: Omit<Message, 'id' | 'timestamp'>): Message => {
  const newMessage: Message = {
    ...message,
    id: String(messages.length + 1), // Simple ID generation for demo
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  return newMessage;
}; 