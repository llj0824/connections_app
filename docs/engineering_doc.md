Great! I'll structure the engineering document as follows:

1. **High-Level Architecture Overview** - How each component interacts with the others.
2. **Monorepo Directory Structure** - A logical and scalable structure.
3. **Component Breakdown & Responsibilities** - What each component is responsible for.
4. **Implementation Guide** - Step-by-step instructions for each component.
5. **Interaction Flow & API Contracts** - How data moves through the system.
6. **Deployment Guide (Localhost)** - Ensuring everything runs smoothly.

I'll provide a modular engineering document so your team can pick up and implement pieces individually. I'll let you know when it's ready!

# React Native + Next.js Monorepo Implementation Guide

## High-Level Architecture Overview

The application is structured as a **monorepo** containing a React Native front-end app and a Next.js back-end (which also serves a web front-end). The React Native app (iOS/Android) handles all mobile user interface and local state, while the Next.js project provides both web pages (if needed) and API endpoints that serve as the backend for the mobile app. Monorepos enable sharing code and logic between the web and mobile projects ([Setting up React Native Monorepo With Yarn Workspaces | {callstack}](https://www.callstack.com/blog/setting-up-react-native-monorepo-with-yarn-workspaces#:~:text=Working%20with%20monorepos%20is%20very,a%20mobile%20app%2C%20for%20example)), which improves consistency and collaboration. In this setup, Next.js API Routes essentially allow the Next backend to act like a Node.js server (similar to an Express server) for handling requests ([react native - Can I use NextJs API routes to handle both web and mobile app? - Stack Overflow](https://stackoverflow.com/questions/68668117/can-i-use-nextjs-api-routes-to-handle-both-web-and-mobile-app#:~:text=With%20the%20assumption%20that%20you,talking%20about%20API%20Routes)). Next.js provides a built-in way to create a public API ([Routing: API Routes | Next.js](https://nextjs.org/docs/pages/building-your-application/routing/api-routes#:~:text=API%20routes%20provide%20a%20solution,js)), so our React Native app communicates with Next.js via HTTP requests to these API endpoints.

**Interaction between front-end and back-end:** The React Native app will call Next.js API routes (over HTTPS/HTTP) for all data operations. For example, when a user logs in on the mobile app, the app sends a POST request to a Next.js API route (e.g. `/api/auth/login`). Next.js processes the request (checking credentials against a database or service), then responds with JSON data (such as an auth token and user profile). The mobile app then uses that data (e.g. storing the token in context or secure storage) for subsequent requests. This request/response pattern is used for all major features: the front-end triggers API calls, and the back-end responds with the required data or action results.

**Key services/modules:**

- **Authentication & Onboarding:** Manages user sign-up, login, and secure access to the app. The React Native front-end provides onboarding screens for new users and login forms for returning users. Let's mock the Auth, just show the UI.

- **Event Management:** Handles creation and viewing of events, as well as user engagement with events (e.g. RSVPing or joining an event). The mobile app includes screens to list available events, view event details, and possibly create or edit events. The Next.js API provides endpoints to fetch event lists, retrieve details for a specific event, create new events, and update or delete events as needed. Business logic such as validating event data or managing attendance is handled on the back-end.

- **Chat Messaging:** Enables real-time communication between users (for example, a chat room or messages within an event). The React Native app includes a chat UI (message list and input box), and it interacts with the back-end through APIs or WebSocket for sending and retrieving messages. The Next.js back-end could implement chat using REST endpoints (e.g. polling for new messages via an API route) or a WebSocket server for instant updates. In this guide, we'll outline a simple RESTful approach (with the option to extend to real-time later). Let's skip this for now, it's a minor feature.

- **User Profile Handling:** Manages user profile data (viewing and editing profile information). The front-end has a profile screen where users can see their information and update details like name, avatar, or preferences. The back-end offers endpoints to fetch the current user's profile and to update profile fields. This service ensures the user's changes are validated and stored (e.g. in a database).

All these services are logically separated but work in unison. The React Native app acts as the client, dispatching actions (API calls) to the Next.js server for these services. The Next.js server, in turn, acts as the API provider and can interface with databases or third-party services as needed (e.g. storing user accounts, event data, chat messages). Because everything resides in a single monorepo, the web front-end (if using Next.js pages) can also leverage the same back-end services and even share code (for example, validation logic or data models) with the mobile app ([Setting up React Native Monorepo With Yarn Workspaces | {callstack}](https://www.callstack.com/blog/setting-up-react-native-monorepo-with-yarn-workspaces#:~:text=Thanks%20to%20react,the%20code%20can%20be%20shared)). This unified codebase ensures consistency across platforms and allows multiple engineers to work on front-end and back-end modules in parallel without diverging into separate repositories.

## Monorepo Directory Structure

The monorepo is organized to clearly separate the mobile app, the web/back-end app, and any shared code or configuration. A common approach is to use a top-level `packages` directory for each project in the monorepo. Below is an example of a well-organized directory structure:

```
monorepo-root/
├── package.json               # Root package.json with workspaces, scripts, etc.
├── packages/
│   ├── mobile/                # React Native app (Android/iOS)
│   │   ├── package.json       # Mobile app package config (name, dependencies)
│   │   ├── src/               # Source code for the React Native app
│   │   │   ├── components/    # Reusable UI components for mobile
│   │   │   ├── screens/       # Screen components (each represents a full screen in the app)
│   │   │   ├── App.tsx        # Root component for the RN app
│   │   │   └── ...other files (navigation setup, etc.)
│   │   ├── android/           # Android project files (for native build)
│   │   └── ios/               # iOS Xcode project files
│   ├── web/                   # Next.js app (back-end and web front-end)
│   │   ├── package.json       # Web app package config
│   │   ├── pages/ or app/     # Next.js pages directory (for web UI and API routes)
│   │   │   ├── api/           # Next.js API route handlers (Node.js backend functions)
│   │   │   └── ...            # Next.js pages or components for web interface
│   │   └── next.config.js     # Next.js configuration
│   └── shared/                # (Optional) Shared code (utilities, types, components)
│       ├── package.json
│       └── utils/             # Example: utility functions used by both mobile and web
├── node_modules/              # Hoisted dependencies (managed by workspace)
└── yarn.lock or package-lock.json
```

This structure follows a typical Yarn workspaces monorepo layout ([React Native + Next.js Monorepo – ecklf.com](https://ecklf.com/blog/rn-monorepo#:~:text=tree%20monorepo,packages%20%E2%94%9C%E2%94%80%E2%94%80%20app%20%E2%94%94%E2%94%80%E2%94%80%20web)). Key parts of the structure and their roles:

- **Root `package.json`:** Declares the workspace packages (e.g. `packages/*`) and contains any root-level dependencies and scripts. For example, it may include a script to bootstrap or build all projects, and common dependencies like React can be hoisted here for deduplication. The root is marked `private: true` to prevent accidental publishing of the monorepo ([React Native + Next.js Monorepo – ecklf.com](https://ecklf.com/blog/rn-monorepo#:~:text=monorepo)) ([React Native + Next.js Monorepo – ecklf.com](https://ecklf.com/blog/rn-monorepo#:~:text=%2B%20,%2B)).

- **`packages/mobile`:** Contains the React Native application. Inside, the standard RN project structure applies (`ios` and `android` folders for native code, plus JavaScript/TypeScript source in `src`). The `components/` directory holds reusable presentational components (buttons, form inputs, etc.) that could be shared across screens. The `screens/` directory holds screen-level components, each corresponding to a route in the app (login screen, event list screen, etc.). The entry point `App.tsx` sets up the main navigation and wraps the app with any providers (such as an Auth context provider or navigation container).

- **`packages/web`:** Contains the Next.js application. This project serves as our **back-end** (via Next's API routes) and optionally the **web front-end**. The `pages/api/` folder (or `app/api/` in Next 13+ with the new App Router) includes route handlers that implement the backend logic for authentication, events, chat, etc. The Next.js app could also have regular pages (e.g. `pages/index.tsx` for a web dashboard) if a web interface is part of the product, but those are not the focus here. Configuration files like `next.config.js` or environment variables for the server reside in this folder. We remove duplicate dependencies in this project (like React) because they are hoisted to the root by the workspace, ensuring only one copy is used across mobile and web ([React Native + Next.js Monorepo – ecklf.com](https://ecklf.com/blog/rn-monorepo#:~:text=Since%20both%20of%20our%20packages,create%20more%20web%20packages%20later)).

- **`packages/shared`:** (Optional) A place for shared modules, such as utility functions, custom hooks, constants, or even UI components that can be used by both React Native and Next.js (potentially through [React Native Web](https://necolas.github.io/react-native-web/) for web compatibility). For instance, a validation helper or a data format function could live here and be imported by both apps. This promotes DRY principles – "Don't Repeat Yourself" – by centralizing logic used in multiple places.

- **Hoisted `node_modules`:** Thanks to Yarn/NPM workspaces, dependencies are hoisted to the root `node_modules` when possible. This avoids duplication and ensures that both the mobile and web projects share the same version of packages like React. Monorepos allow sharing packages and managing dependencies more easily ([Setting up React Native Monorepo With Yarn Workspaces | {callstack}](https://www.callstack.com/blog/setting-up-react-native-monorepo-with-yarn-workspaces#:~:text=Thanks%20to%20react,the%20code%20can%20be%20shared)). (During setup, special configuration is needed so that React Native's Metro bundler knows to look for modules in the hoisted location. This typically involves adjusting `metro.config.js` to include the root and using symlinks, which Yarn handles. The Callstack article provides guidance on Metro and native config adjustments in a monorepo ([Setting up React Native Monorepo With Yarn Workspaces | {callstack}](https://www.callstack.com/blog/setting-up-react-native-monorepo-with-yarn-workspaces#:~:text=In%20order%20for%20our%20app,due%20to%20package%20hoisting)) ([Setting up React Native Monorepo With Yarn Workspaces | {callstack}](https://www.callstack.com/blog/setting-up-react-native-monorepo-with-yarn-workspaces#:~:text=)).)

**Development note:** Each app (mobile and web) has its own `package.json` with scripts. For example, the mobile app might have scripts like `"android"` or `"ios"` to run the app, while the web app has `"dev"` to start the Next.js dev server. Using a tool like Yarn workspaces or npm workspaces, you can run commands in each subproject from the root (e.g. `yarn workspace mobile run ios`). This structure allows front-end and back-end developers to work in isolation (in their respective folders) while still being in one repository.

## Component Breakdown & Responsibilities

This section details the key UI components, their responsibilities, and how we will manage state in the application. We distinguish between **reusable components** (often called presentational components) and **screen-level components** (container components), and outline how state and data flow will be handled via hooks and context.

### Key UI Components and Screens

**Authentication & Onboarding screens:** These include components like `SignupScreen`, `LoginScreen`, and possibly `OnboardingScreen` if there's an introductory carousel. Within these screens, there are form components such as `TextInput` fields for email/password and buttons to submit. For example, a `LoginForm` component might encapsulate the email/password input fields and a "Login" button, handling form state locally.

**Main App screens:** Once logged in, the user sees main application screens:
- **Event List Screen (`EventListScreen`):** Displays a scrollable list of events. It uses a reusable component `EventCard` (or `EventListItem`) to render each event's summary (e.g. title, date, maybe an image). 
- **Event Detail Screen (`EventDetailScreen`):** Shows full details of a selected event. This might include event description, time/location, list of participants, and actions like "Join Event". It could compose multiple smaller components, such as an event header, a list of attendees (each rendered with an `Avatar` component), and a join button.
- **Chat Screen (`ChatScreen`):** Allows users to view messages and send new ones in real-time or near-real-time. It contains a `FlatList` (or scroll view) of messages, where each message is rendered with a `MessageBubble` component (showing the message text, sender, timestamp). At the bottom, an input field and send button (could be a `MessageInput` component) allow the user to type and send new messages.
- **Profile Screen (`ProfileScreen`):** Displays the user's profile information. It might use components like `Avatar` (for the user's picture), and `ProfileForm` or `ProfileDetails` to show fields like username, email, bio, etc. If editing is allowed on the same screen, these fields might be editable or there could be a separate `EditProfileScreen`.

**Reusable UI components:** These are building blocks used across screens:
- **Form Inputs and Buttons:** e.g. `TextInputField`, `PrimaryButton`, `LoadingSpinner`. These have a consistent style and behavior across the app.
- **Display components:** e.g. `Avatar` (displays a user's profile picture), `EventCard` (shows event summary info), `MessageBubble` (styles a chat message differently if it's sent by the current user or others).
- **Navigation components:** Though navigation is mainly handled by React Navigation (in RN) and Next's Link (in web), we might have a custom `Header` component or navigational menu components that are reused.

Each component has a clear purpose. Reusable components are **presentational**: they focus on how things look and emit events (via callbacks) when user interacts. Screen components (or container components) are **stateful**: they handle data fetching (calling APIs), state management, and compose multiple reusable components. This separation of concerns makes it easy for different engineers to work on different parts (for instance, one can work on the UI component styling while another works on hooking it up to real data) ([Container/Presentational Pattern](https://www.patterns.dev/react/presentational-container-pattern/#:~:text=The%20Container%2FPresentational%20pattern%20encourages%20the,enforce%20the%20separation%20of%20concerns)). It also maximizes reusability – for example, the `EventCard` used in the list can also be used in a search results screen or a "My Events" list.

### State Management Strategy

We will use **React Hooks and Context API** for state management. Simpler, local state (e.g. the text in a form input, or whether a modal is visible) will be handled with `useState` inside components. For more complex logic or side effects (like fetching data when a screen loads), `useEffect` and custom hooks will be used. For example, we might create a custom hook `useEvents()` that fetches and returns a list of events, and use it inside `EventListScreen` to populate data. This follows React best practices for separating data fetching logic into hooks for reuse and clarity.

In summary, the UI layer will be built of small, reusable components assembled within screen-level containers. The state management will use React hooks and context to keep the data flow predictable and aligned with React paradigms. This approach will make it easier to extend the app (e.g. adding a new screen or feature) without entangling unrelated parts of the app, and it lets multiple developers work concurrently on different UI pieces or features.

## Backend Implementation Checkpoints

### Checkpoint 1: Project Setup and Basic User Profile

1. **Initialize the Next.js project** with TypeScript support.
2. **Set up the project structure** with folders for API routes, utilities, and data models.
3. **Implement simple in-memory data storage** for user profile and events.
4. **Create a default user profile** that will be used throughout the app.
5. **Create profile API endpoints**:
   - `GET /api/profile` - For retrieving the user profile
   - `PUT /api/profile` - For updating the user profile
6. **Test the profile endpoints** using Postman or cURL.

### Checkpoint 2: Event Management API

1. **Create the event data model** with necessary fields.
2. **Implement event list endpoint** (`GET /api/events`) to retrieve all events.
3. **Add event detail endpoint** (`GET /api/events/[id]`) to get a specific event's details.
4. **Create endpoint for event creation** (`POST /api/events`).
5. **Implement the RSVP functionality** (`POST /api/events/[id]/rsvp`) to allow joining events.
6. **Add CORS support** to allow cross-origin requests from the mobile app.
7. **Test all event endpoints** to ensure they work as expected.

### Checkpoint 3: Chat Functionality and Enhanced Features

1. **Add basic chat functionality**:
   - `GET /api/events/[id]/messages` - Get messages for an event
   - `POST /api/events/[id]/messages` - Add a new message
2. **Improve error handling** across all endpoints for better client feedback.
3. **Add validation** to all input data to prevent invalid data from being processed.
4. **Create a health check endpoint** (`GET /api/health`) to verify the API is running.
5. **Document all API endpoints** for front-end developers.
# Frontend Implementation Checkpoints

Based on the backend implementation that's already in place, here are three logical checkpoints for the frontend implementation:

### Checkpoint 1: Project Setup and Navigation Structure

1. **Create React Native project structure** within the monorepo
2. **Set up navigation (React Navigation)** with the following screens:
   - Authentication screens (Login/Signup)
   - Main app navigation (Tab or Drawer navigation)
   - Stack navigators for each main feature
3. **Create basic placeholder screens** for all main routes
4. **Set up authentication context and state management** for the app
5. **Implement navigation flow** between unauthenticated and authenticated states

### Checkpoint 2: Authentication and Profile Features

1. **Implement Login screen** with form validation and API integration
2. **Build Signup screen** with form validation and API integration
3. **Create Profile screen** to display user information
4. **Implement Edit Profile functionality** with form validation
5. **Set up secure token storage** and authentication header management
6. **Test the complete authentication and profile flow**

### Checkpoint 3: Event Management and Chat Features

1. **Implement Event List screen** with event cards and data fetching
2. **Create Event Detail screen** with ability to join/leave events
3. **Build Event Creation screen** with form validation
4. **Implement basic Chat functionality** for events
5. **Add final UI polish, loading states, and error handling**
6. **Test the complete application flow**


**Front-end (React Native):** 

1. **Onboarding Screens:** Implement any introductory screens or walkthrough (optional). These might just be static informational pages or skipped entirely to go straight to sign-up/login. Ensure navigation is set up so that the default route 

**Back-end (Next.js):**

1. **Event Model:** Decide how to represent an event. For this guide, an event can be an object with fields: `id`, `title`, `description`, `datetime`, `location`, `organizerId`, and maybe `attendees` (list of user IDs or basic info). In absence of a real database, you can have an in-memory array or use a simple JSON file. For production, you'd use a DB like PostgreSQL or MongoDB and possibly an ORM (Prisma/Mongoose etc.), but the implementation will be conceptual here.

2. **GET /api/events:** Create `pages/api/events/index.ts` (Next.js allows nested routes, this could catch `/api/events` GET). In the handler, verify the user (if the API requires auth – you might want to allow public events without auth, but let's assume auth is required so use the token to identify the user or at least allow the request). Then retrieve all events from storage. You might filter events based on user or return all public events. Respond with a JSON: `{ events: [...] }`. Example:
   ```js
   // pages/api/events/index.js
   export default function handler(req, res) {
     if (req.method === 'GET') {
       const events = getAllEvents(); // fetch from DB or array
       return res.status(200).json({ events });
     } 
     if (req.method === 'POST') {
       // create new event
       const { title, description, datetime, location } = req.body;
       if (!req.user) { // pseudo: assume some auth middleware set req.user
         return res.status(401).json({ error: 'Not authenticated' });
       }
       const newEvent = createEvent(req.user.id, { title, description, datetime, location });
       return res.status(201).json({ event: newEvent });
     }
     res.setHeader('Allow', 'GET, POST');
     res.status(405).json({ error: 'Method Not Allowed' });
   }
   ```
   Here we handle both GET (list events) and POST (create event) in one file for brevity. In a real app, you might separate them or use Next 13 route handlers. The `createEvent` would add an event with a new ID and return it.

3. **GET /api/events/[id]:** Create file `pages/api/events/[id].ts` to handle requests for a specific event (Next will pass `req.query.id`). For GET, find the event by ID and return it (`res.json({ event })`). If not found, return 404. For other methods: 
   - You could allow PUT to update an event (checking that `req.user.id` matches the event's organizerId).
   - Allow DELETE to remove an event (also with auth check).
   - Allow POST on a sub-route like `/api/events/[id]/rsvp` for join actions (or handle as part of this if logic with some indicator).

4. **POST /api/events/[id]/rsvp:** There are a few ways to implement joining an event. One simple approach: treat it as adding the user's ID to the event's attendee list. We can implement this as a separate API route file: `pages/api/events/[id]/rsvp.ts`. In it, ensure the user is authenticated, then modify the event data (add user to attendees). Respond with success or the updated event:
   ```js
   // pages/api/events/[id]/rsvp.js
   export default function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method Not Allowed' });
     }
     const eventId = req.query.id;
     const event = findEventById(eventId);
     if (!event) {
       return res.status(404).json({ error: 'Event not found' });
     }
     if (!req.user) {
       return res.status(401).json({ error: 'Not authenticated' });
     }
     // Add user to attendees if not already
     event.attendees = event.attendees || [];
     if (!event.attendees.includes(req.user.id)) {
       event.attendees.push(req.user.id);
     }
     return res.status(200).json({ message: 'RSVP successful' });
   }
   ```
   This assumes some middleware set `req.user` based on token. If not using a middleware, you'll need to parse `req.headers.authorization` here and verify the token manually to get the user ID.

5. **Data Persistence:** As this is an implementation guide, using an in-memory store (like a simple array of events) is fine for now. Note that if you restart the server, data resets. In a real development environment, hooking up a database and using an ORM or direct queries would be part of the implementation. Ensure that any database calls are awaited (as Next API can be async).

6. **Testing the Endpoints:** You can use tools like Postman or cURL to simulate requests to these endpoints (e.g. GET `http://localhost:3000/api/events` to see if sample data returns, or POST a new event). This can be done even before the front-end is ready, to ensure the back-end logic is correct. Once both sides are ready, navigate in the RN app to ensure events load and actions work.


### Profile Management Implementation

**Front-end (React Native):**

1. **Profile Screen:** Implement `ProfileScreen` to display the current user's profile. Use the Auth Context to get the current user data (e.g. `const { user } = useContext(AuthContext)`). The profile screen can show fields like name, email, etc., possibly with an avatar image. Provide an "Edit" button that navigates to an `EditProfileScreen` or toggles the form into edit mode.

2. **Fetching Profile:** If the user data is already available in context from login, you may not need an API call to fetch profile. However, to keep it up-to-date or if more info is needed, you could call `GET /api/profile` when the profile screen mounts. This endpoint (described below) would return the latest profile info from the server (which might include additional fields not in the token). If so, update the Auth Context or local state with the fetched profile.

3. **Edit Profile:** If editing in place, render input fields pre-filled with the user's info and allow changes. If in a separate screen, pass the current profile to that screen for editing. The editing form might include changing username, bio, or even updating password (though that might be separate flow). For simplicity, include a couple of text fields and maybe an image picker for avatar.

4. **Save Profile:** On save, call `PUT /api/profile` with the updated fields. E.g.:
   ```jsx
   const handleSave = async () => {
     const res = await fetch('http://localhost:3000/api/profile', {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authContext.token}` },
       body: JSON.stringify({ name: editedName, bio: editedBio })
     });
     const data = await res.json();
     if (res.ok) {
       // Update context with new profile info
       authContext.updateUser(data.user);
       navigation.goBack();
     } else {
       Alert.alert('Update failed', data.error || 'Unknown error');
     }
   };
   ```
   Here `authContext.updateUser` would merge the updated fields into the context's `user` state. After saving, navigate back to Profile screen and show the updated info.

5. **UI Feedback:** Show a success message or toast on successful profile update. If editing avatar, uploading images would be more complex (likely need to upload to storage and save URL – not covered here). Keep the edit process simple textual data for now.

**Back-end (Next.js):**

1. **GET /api/profile:** Create `pages/api/profile.ts`. This should ensure the request is authenticated (token required). If not, return 401. If yes, fetch the user profile from the database (or in-memory store). You might have stored users in an array as shown in the Auth section. Find the user by the id from `req.user`. Return the user data (excluding sensitive info like password hash). For example:
   ```js
   export default function handler(req, res) {
     if (!req.user) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     const user = users.find(u => u.id === req.user.id);
     if (!user) {
       return res.status(404).json({ error: 'User not found' });
     }
     // Return profile information
     const { id, name, email, bio } = user;
     res.status(200).json({ user: { id, name, email, bio } });
   }
   ```
   This provides the client with current data. (If using JWT, `req.user` might be set by decoding the token in a middleware. If not using middleware, decode the token in this handler.)

2. **PUT /api/profile:** In the same handler, allow PUT method for updates. Expect a JSON body with fields to update (e.g. name, bio, etc.). Validate them (e.g. ensure name is not empty). Find the user and update the fields. Save to database or in-memory. For example:
   ```js
   if (req.method === 'PUT') {
     if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
     const user = users.find(u => u.id === req.user.id);
     if (!user) return res.status(404).json({ error: 'User not found' });
     const { name, bio } = req.body;
     if (name !== undefined) user.name = name;
     if (bio !== undefined) user.bio = bio;
     return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, bio: user.bio } });
   }
   ```
   If the client wants to update other fields (password, avatar), handle those accordingly (password would need hashing and re-auth logic; avatar might involve uploading files which is beyond scope here). For now, stick to simple text fields.

3. **Other Profile Endpoints:** If needed, you could also allow changing password via a separate endpoint (requiring current password check, etc.), or uploading an avatar (could integrate with a cloud storage service). These can be added later. The main focus is the ability to retrieve and update profile info.

4. **Testing:** Try fetching the profile with a correct token and updating it. Ensure that unauthorized requests are blocked. The front-end after integration should reflect updates immediately thanks to context update.

With all these components implemented, we have covered the core features of the app. Each feature (Auth, Events, Chat, Profile) has distinct front-end components and back-end endpoints, allowing different engineers to work on them relatively independently. For instance, one could focus on building the chat UI and socket integration while another works on the event creation form, as long as they agree on the API contract. We maintain consistency via the defined endpoints and data formats.

## Interaction Flow & API Contracts

This section defines how data flows between the front-end and back-end for each key feature and outlines the API endpoints (RESTful) that form the contract between the React Native app and the Next.js server. By clearly specifying request and response formats, developers can work on the front-end and back-end in parallel and ensure integration works smoothly.

**Authentication & Onboarding:**

- **`POST /api/auth/signup`:** Used to register a new user.  
  **Request:** JSON body with user details, e.g. `{ "name": "...", "email": "...", "password": "..." }`.  
  **Response:** On success, returns 201 Created with JSON `{ "token": "JWT-token-string", "user": { "id": 123, "name": "...", "email": "..." } }`. The token is a JWT or session identifier that the app will store for authenticated calls. On failure (e.g. email already exists), returns an error with appropriate status (400 or 409) and `{ "error": "message" }`.

- **`POST /api/auth/login`:** Used for user authentication (login).  
  **Request:** JSON `{ "email": "...", "password": "..." }`.  
  **Response:** On success, 200 OK with `{ "token": "JWT-token-string", "user": { "id": 123, "name": "...", "email": "..." } }`. The token allows the app to authenticate future requests (include it in headers). If credentials are invalid, 401 Unauthorized with `{ "error": "Invalid credentials" }`.  
  **Flow:** The RN app calls this when user submits login form. The app then stores the token (e.g. in context or secure storage) and uses it to set an Auth Context state (mark user as logged in) and navigates to the main app. The token is included in subsequent API calls (usually via an `Authorization: Bearer <token>` header). The Next.js backend will verify this token on protected routes (like events, profile).

- **`POST /api/auth/logout`:** (Optional) If using JWT stateless, logout on server isn't needed (client just drops token). If using a session cookie, you might implement a logout route to clear the cookie. In our case, the RN app will simply clear the token on logout. A route could still be provided to invalidate tokens server-side if needed.

**Profile Management:**

- **`GET /api/profile`:** Retrieves the profile of the currently authenticated user.  
  **Request:** No body. Must include auth token (e.g. `Authorization: Bearer token`).  
  **Response:** 200 OK with `{ "user": { "id": 123, "name": "...", "email": "...", "bio": "...", ... } }`. This returns profile fields. If not authenticated (no valid token), returns 401. If the user record isn't found (shouldn't happen if token is valid), 404.  
  **Flow:** The RN app may call this on app launch (after login) to get the latest profile info, or when the profile screen mounts to refresh data. Often, the login response already provides user info, so this might be used mainly for refreshing or verifying token validity.

- **`PUT /api/profile`:** Updates the profile of the authenticated user.  
  **Request:** JSON body with fields to update, e.g. `{ "name": "...", "bio": "..." }` (fields not provided remain unchanged). Auth token required in headers.  
  **Response:** 200 OK with `{ "user": { ...updated user fields... } }` on success. The returned user object is the new state of the profile. If the user is not auth, 401. If validation fails (e.g. name too long), 400 with `{ "error": "validation message" }`.  
  **Flow:** Called when user saves edits to their profile in the app. The app will then update its local user state (Auth Context) with the returned data (e.g. new name) and perhaps give feedback to the user that profile is saved.

**Event Management:**

- **`GET /api/events`:** Fetches a list of events (could be all events or those visible to the user).  
  **Request:** No body. Include auth token if the endpoint requires login to view events (if events are public, token might not be needed, but let's assume auth required to use the app).  
  **Response:** 200 OK with `{ "events": [ {...}, {...}, ... ] }`, an array of event objects. Each event object may include basic fields like `id`, `title`, `datetime`, `location`, `organizerId`, etc. To reduce payload, it might not include the full description or attendees list here (those can be fetched via the detail endpoint). Possibly include a brief summary or a flag if the user is attending.  
  **Flow:** The RN `EventListScreen` calls this when it needs to display the list. The user should be logged in (token sent). The backend returns events; the front-end renders them. If no events, returns an empty list. If the token is invalid, 401 (app would likely redirect to login in that case).

- **`POST /api/events`:** Creates a new event.  
  **Request:** JSON body with event details: `{ "title": "...", "description": "...", "datetime": "...", "location": "..." }`. Auth token required (only authenticated users can create events; likely the user becomes the organizer).  
  **Response:** On success, 201 Created with `{ "event": { ...event data... } }`. The event object should include a newly assigned `id` and the organizer's id, etc. If the input is invalid (missing fields), 400 with error message. If not auth, 401.  
  **Flow:** Called when the user submits a new event form. The app then navigates to perhaps the event detail page for that new event or back to the list. The new event could also be added to the local list immediately for feedback.

- **`GET /api/events/[id]`:** Retrieves detailed information about a specific event.  
  **Request:** No body, just the URL with event ID. Auth token required if events are private.  
  **Response:** 200 OK with `{ "event": { "id": ..., "title": "...", "description": "...", "datetime": "...", "location": "...", "organizerId": ..., "attendees": [ list of user ids or names ] } }`. This contains more info than the list endpoint, including full description and attendees. If event not found, 404. If not auth (and required), 401.  
  **Flow:** The app calls this when navigating to the Event Detail screen (it has the eventId from the list). The app then displays all the data. Attendee information can be used to show a count or list of participants.

- **`POST /api/events/[id]/rsvp` (Join Event):** Registers the current user as attending the event.  
  **Request:** No body needed (the server knows which user from the token). Alternatively, could accept `{ "status": "join" }` or `{ "going": true }` if we allow toggling. Auth required.  
  **Response:** On success, 200 OK with maybe `{ "message": "Joined" }` or `{ "event": updatedEvent }`. If the event does not exist, 404. If the user is already joined, it might still return 200 (idempotent) or a message like "already joined". If not auth, 401.  
  **Flow:** Called when user taps "Join" on an event. The app might optimistically update UI. The returned updated event (if provided) can replace the current event state to update the attendee list. If using just a message, the app might instead call GET event detail afterwards to refresh data.

- **`DELETE /api/events/[id]/rsvp` (Leave Event):** (Optional) If users can leave an event, an endpoint to remove their RSVP. Could also be a `DELETE` to the same `/rsvp` endpoint or a `POST /rsvp` with a flag. Implementation similar: remove user from attendees.

- **`PUT /api/events/[id]`:** (Optional) Update event details. Would be used by the event organizer to edit the event. Not implementing fully here, but contract would require auth and check if current user is organizer, then accept similar fields as creation. Respond with updated event.

- **`DELETE /api/events/[id]`:** (Optional) Delete an event (organizer only). Not detailed here.

**Chat Messaging:**

*(Assuming chat is scoped per event for this application; adjust endpoints if it's a global chat or different rooms.)*

- **`GET /api/events/[id]/messages`:** Fetches messages for the event's chat.  
  **Request:** No body. Auth token required (and user should be authorized to view the event's chat, e.g., they are a participant or events are public).  
  **Response:** 200 OK with `{ "messages": [ {...}, {...}, ... ] }`. Each message object might include `id`, `senderId`, `text`, `timestamp`. Optionally, include sender name or profile info if needed for display (or the client can map senderId to a name via the list of attendees or additional calls). If no messages yet, returns `{ "messages": [] }`. If event not found or not allowed, 404 or 403 accordingly.  
  **Flow:** Called when chat screen loads or on a polling interval to refresh the chat. The app merges new messages into its state. The server could implement basic pagination (like `?since=<timestamp>` for new messages), but initially returning all is okay if volumes are low.

- **`POST /api/events/[id]/messages`:** Sends a new message in the event chat.  
  **Request:** JSON `{ "text": "Hello everyone!" }`. Auth required (user must be logged in; optionally check they're part of the event).  
  **Response:** 201 Created with `{ "message": { "id": ..., "senderId": ..., "text": "...", "timestamp": "..." } }`. The returned message should reflect what was saved (it may generate an ID and timestamp on the server). This helps the client sync the message with what's on server. If the text is empty or too long, 400 validation error. If not auth or not allowed, 401/403.  
  **Flow:** Called when user sends a message. The RN app will also display the sent message immediately. On receiving the response, the app can confirm the message was delivered (maybe removing any "sending..." indicator on it). If the app is polling `GET /messages`, the new message will also appear there on next fetch, but since we already add it on client, it's fine.

- **WebSocket Endpoint (future):** If implementing real-time, you might have an endpoint like `/api/events/[id]/socket` or use a library on the Next.js custom server to handle a WebSocket for live updates. Since the question focuses on endpoints, we stick to REST for now.

## Deployment Guide (Localhost Testing)

To run and test the application locally (both front-end and back-end), follow these steps. This guide assumes you have the necessary environments set up: Node.js (for Next.js), Yarn or npm for package management, and for React Native, Android Studio (for Android emulator) and/or Xcode (for iOS simulator) if testing on those platforms.

**1. Initial Setup:**

- **Clone Repository:** Clone the monorepo repository to your local machine.
- **Install Dependencies:** In the root directory, run `yarn install` (or `npm install` if using npm workspaces) to install all packages. Thanks to the workspace setup, this will install dependencies for both `packages/mobile` and `packages/web` projects. Verify that a `node_modules` folder appears in the root (with hoisted packages) and that each sub-package links to those dependencies.

- **Set Environment Variables:** If the Next.js app requires any environment variables (for example, a database URL or JWT secret for token signing), create a `.env.local` file in `packages/web/` with those values. For development, you might not need many secrets if using in-memory data, but ensure a JWT secret is set if using JWT (Next can use `process.env.JWT_SECRET`). Also, if applicable, set a variable for allowed CORS origins (or just use `*` in development as shown earlier).

**2. Running the Next.js Back-end (Web App):**

- Open a terminal in the root of the monorepo. Start the Next.js development server by running the command:  
  ```bash
  yarn workspace web dev
  ```  
  This leverages Yarn to run the `dev` script in the `packages/web` project. (Alternatively, `cd packages/web` and run `yarn dev`). You should see Next.js compile and start. By default, it will be listening on [http://localhost:3000](http://localhost:3000).

- **Verify Back-end is Running:** Open a browser and navigate to [http://localhost:3000/api/health](http://localhost:3000/api/health) (if you have a health check route) or any defined route. If none, you can test one of the implemented routes. For example, open [http://localhost:3000/api/events](http://localhost:3000/api/events) in the browser. It might show an error like "Unauthorized" (since no token) but a response indicates the server is up. Alternatively, check the console output of the Next server for any logs.

- Keep this server running. If you make changes to the Next.js API code, it should hot-reload.

**3. Running the React Native App:**

- **Start Metro Bundler:** In another terminal (still at monorepo root), start the Metro bundler for React Native. You can run:  
  ```bash
  yarn workspace mobile start
  ```  
  This will launch Metro, the JavaScript bundler for RN. It should listen on default port 8081.

- **Run iOS Simulator (macOS only):** Open a new terminal (or you can append with `--ios` flag). Run:  
  ```bash
  yarn workspace mobile ios
  ```  
  This will use `react-native run-ios` under the hood to build the iOS app and launch the iOS simulator. The first build can take some time as Xcode compiles the native code. If everything is configured, the app will open in the iOS simulator. You should see either your launch screen or the login screen.

- **Run Android Emulator:** Make sure you have an Android emulator running (AVD started via Android Studio) or a device connected. Then run:  
  ```bash
  yarn workspace mobile android
  ```  
  This compiles the Android app (using Gradle) and installs it on the emulator/device. If Metro is running, it will bundle the JavaScript and the app should start on the device.

- **Configure API URL:** By default, our app code uses `http://localhost:3000` for the API. **Important:** For Android, `localhost` in the emulator context is the emulator itself, not your PC. Use the special IP `10.0.2.2` to reach the host machine's localhost. One easy way is to define a constant in your app like:
  ```js
  const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
  ```
  Then use `API_BASE` in fetch calls. This way, iOS simulator (which can use localhost directly) and Android emulator will both work. Alternatively, use your computer's local IP address (e.g. `http://192.168.1.100:3000`) and ensure the emulator is allowed to reach it.
  
- **Debugging:** You can open the React Native debug menu (Cmd+D on iOS simulator, Cmd+M or shake on Android) to enable remote debugging or inspect element. You can also use Reactotron or Flipper for debugging if set up. For Next.js, you can see logs in the terminal where it's running. `console.log` in API routes will print there.

**4. Testing the App Locally:**

- **Register and Login:** On the app's login screen, try creating a new account (if you built that flow). Fill in details and submit. Watch the Next.js terminal for logs indicating the signup API was hit (you might add a console.log in the handler). If successful, the app should navigate to the main screen. Next, log out and try logging in with the same account to ensure that flow works. This tests the Auth service end-to-end.

- **View Events:** Once logged in, the Event List screen should fetch events. If you haven't added any events in the back-end, the list might be empty. You can test the API by manually adding a dummy event in your back-end data (for example, push an event to the `events` array when server starts, or implement a quick UI in Next for adding events). Alternatively, if you implemented event creation in the app, use that: navigate to create event, fill form, submit, then see if it appears in the list.

- **Event Details and Join:** Tap an event in the list. It should navigate to detail screen and fetch details from `/api/events/[id]`. Verify the data appears correctly. Tap the "Join" button. The UI could update (maybe you add yourself to attendees). On the back-end, check that the API route for join was called (and maybe log something or check the in-memory data structure updated). If you tap again, ensure it doesn't duplicate your entry (depending on your implementation).

- **Chat:** Go to the chat screen for an event. Initially, it may load no messages (if none). Open two instances of the app (if possible, e.g. one on iOS simulator, one on Android emulator, both logged in as maybe different users if you set up multiple accounts). Send a message from one. Because we didn't set up real-time, the other won't see it immediately unless it polls. You might trigger a manual refresh by pulling down or a refresh button which calls the GET messages endpoint again. Verify the message appears. This confirms the message sending API works. (Implementing a short polling interval as in our example useEffect will make the message show up within a few seconds on the other device).

- **Profile:** Go to the profile screen. It should show your user info (from context or fetched). Try editing a field and saving. Check that the API was called (Next.js logs) and the UI updated. Perhaps also verify by logging out and logging in again to see if the change persisted (given our in-memory store, it will reset on server restart but not on a single run).

- **Web Front-end (if applicable):** If your Next.js also serves a web UI, you can test that in the browser. For example, if you created a basic homepage or admin panel, ensure it loads. Also, you can use the browser to hit API endpoints for quick testing (making GET requests). For POST, using a tool like curl or Postman is helpful.

**5. Troubleshooting:**

- If the mobile app cannot reach the Next.js API, check the network configuration:
  - Android: use `10.0.2.2` as noted.
  - iOS Simulator: usually can use `localhost` directly. If not, try `127.0.0.1` or the Mac's IP.
  - If using a physical device, your computer and phone must be on the same network, and use the computer's LAN IP (and perhaps adjust CORS to allow that IP).
  - Ensure Next.js is actually running on port 3000 and not blocked by a firewall.

- If you get a CORS error in the app (you'll see a network request fail due to CORS in the Metro console), make sure you've added the CORS headers in the Next.js responses as described earlier (or use a package like `nextjs-cors` to simplify this). In development, you can allow all origins.

- If the React Native app fails to start or crashes:
  - Check Metro console for errors. If it says "Unable to resolve module", it might be a workspace path issue; ensure the Metro config is set to watch the root and that you didn't accidentally install a second copy of React (the monorepo setup we did avoids that by hoisting).
  - If Android build fails, you may need to adjust Gradle configs as per monorepo setup (e.g., in settings.gradle ensure it knows the relative path to node_modules). The Callstack blog covers specific native config changes ([Setting up React Native Monorepo With Yarn Workspaces | {callstack}](https://www.callstack.com/blog/setting-up-react-native-monorepo-with-yarn-workspaces#:~:text=)) ([Setting up React Native Monorepo With Yarn Workspaces | {callstack}](https://www.callstack.com/blog/setting-up-react-native-monorepo-with-yarn-workspaces#:~:text=Inside%20the%20project,default%20location%20of%20the%20cli)).
  - If iOS fails, open the Xcode workspace in `packages/mobile/ios` and ensure the project builds. Possibly run `pod install` in `ios` folder if needed after dependency changes.
