export interface Event {
  id: string;
  title: string;
  description: string;
  datetime: string;
  location: string;
  organizerId: string;
  attendees: string[];
}

// In-memory storage for events
export const events: Event[] = [
  {
    id: '1',
    title: 'Demo Event',
    description: 'This is a demo event for testing the API.',
    datetime: '2023-12-31T19:00:00Z',
    location: 'Virtual',
    organizerId: '1', // Matches our default Test User
    attendees: ['1']
  }
];

// Helper functions to work with the events array
export const findEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};

export const findEventsByUserId = (userId: string): Event[] => {
  return events.filter(event => 
    event.organizerId === userId || event.attendees.includes(userId)
  );
}; 