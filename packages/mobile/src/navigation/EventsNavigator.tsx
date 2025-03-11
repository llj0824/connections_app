import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import EventListScreen from '../screens/events/EventListScreen';
import EventDetailScreen from '../screens/events/EventDetailScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import EventChatScreen from '../screens/events/EventChatScreen';

// Define Events stack param list
export type EventsStackParamList = {
  EventList: undefined;
  EventDetail: { eventId: string };
  CreateEvent: undefined;
  EventChat: { eventId: string };
};

const Stack = createNativeStackNavigator<EventsStackParamList>();

const EventsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="EventList"
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="EventList" 
        component={EventListScreen} 
        options={{ title: 'Events' }} 
      />
      <Stack.Screen 
        name="EventDetail" 
        component={EventDetailScreen} 
        options={{ title: 'Event Details' }} 
      />
      <Stack.Screen 
        name="CreateEvent" 
        component={CreateEventScreen} 
        options={{ title: 'Create Event' }} 
      />
      <Stack.Screen 
        name="EventChat" 
        component={EventChatScreen} 
        options={{ title: 'Chat' }} 
      />
    </Stack.Navigator>
  );
};

export default EventsNavigator; 