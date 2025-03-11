import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../navigation/EventsNavigator';

type EventListScreenProps = NativeStackScreenProps<EventsStackParamList, 'EventList'>;

// Mock data for placeholder
const mockEvents = [
  {
    id: '1',
    title: 'Tech Meetup',
    date: '2023-04-15',
    location: 'San Francisco, CA',
    attendees: 42
  },
  {
    id: '2',
    title: 'Startup Networking',
    date: '2023-04-20',
    location: 'New York, NY',
    attendees: 75
  },
  {
    id: '3',
    title: 'Design Workshop',
    date: '2023-04-25',
    location: 'Austin, TX',
    attendees: 28
  }
];

const EventListScreen: React.FC<EventListScreenProps> = ({ navigation }) => {
  // In a real implementation, this would fetch data from the API
  const [loading, setLoading] = React.useState(false);
  const [events, setEvents] = React.useState(mockEvents);

  const handleCreateEvent = () => {
    navigation.navigate('CreateEvent');
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  const renderEventItem = ({ item }: { item: typeof mockEvents[0] }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => handleEventPress(item.id)}
    >
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
      <Text style={styles.eventLocation}>{item.location}</Text>
      <Text style={styles.eventAttendees}>{item.attendees} Attending</Text>
    </TouchableOpacity>
  );

  React.useEffect(() => {
    // This would normally fetch events from the API
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleCreateEvent} style={styles.createButton}>
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {events.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No events found</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleCreateEvent}
          >
            <Text style={styles.buttonText}>Create Event</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  eventAttendees: {
    fontSize: 13,
    color: '#0066CC',
  },
  createButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066CC',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventListScreen; 