# Connection App Backend

This is the Next.js backend for the Connection App. It provides API endpoints for the mobile frontend.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### User Profile
- `GET /api/profile` - Get the current user's profile
- `PUT /api/profile` - Update the current user's profile

### Event Management
- `GET /api/events` - Get a list of all events
- `POST /api/events` - Create a new event
- `GET /api/events/[id]` - Get details for a specific event
- `POST /api/events/[id]/rsvp` - Join an event (RSVP)
- `DELETE /api/events/[id]/rsvp` - Leave an event

### Chat Functionality
- `GET /api/events/[id]/messages` - Get all messages for an event
- `POST /api/events/[id]/messages` - Add a new message to an event's chat

## Testing the API with cURL

### Check API health:
```bash
curl http://localhost:3000/api/health
```

### Get user profile:
```bash
curl http://localhost:3000/api/profile
```

### Update user profile:
```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name":"Updated User", "bio":"This is an updated bio"}' http://localhost:3000/api/profile
```

### Get all events:
```bash
curl http://localhost:3000/api/events
```

### Get a specific event:
```bash
curl http://localhost:3000/api/events/1
```

### Create a new event:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"New Event", "description":"This is a new event", "datetime":"2023-12-31T20:00:00Z", "location":"Virtual"}' http://localhost:3000/api/events
```

### Join an event (RSVP):
```bash
curl -X POST http://localhost:3000/api/events/1/rsvp
```

### Leave an event:
```bash
curl -X DELETE http://localhost:3000/api/events/1/rsvp
```

### Get messages for an event:
```bash
curl http://localhost:3000/api/events/1/messages
```

### Send a message in an event:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"text":"Hello everyone!"}' http://localhost:3000/api/events/1/messages
```

## Error Handling

The API uses standardized error responses with the following format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  }
}
```

Common error codes include:
- `UNAUTHORIZED` (401) - Authentication required
- `FORBIDDEN` (403) - Permission denied
- `NOT_FOUND` (404) - Resource not found
- `BAD_REQUEST` (400) - Invalid request
- `VALIDATION_ERROR` (400) - Input validation failed

## Implementation Details

The backend uses in-memory storage for simplicity. In a production environment, this would be replaced with a database.

For authentication, we're currently using a simple mock implementation that always returns the default test user. In a real application, this would be replaced with JWT authentication.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
