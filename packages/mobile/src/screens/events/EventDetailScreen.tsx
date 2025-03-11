import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../navigation/EventsNavigator';

type EventDetailScreenProps = NativeStackScreenProps<EventsStackParamList, 'EventDetail'>;

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ route, navigation }) => {
  const { eventId } = route.params;
  
  // Placeholder - in real app would fetch event details from API
  const eventDetails = {
    id: eventId,
    title: 'Tech Meetup',
    date: '2023-04-15',
    time: '6:00 PM - 9:00 PM',
    location: 'San Francisco, CA',
    description: 'Join us for a night of networking and tech talks! We\'ll have speakers discussing the latest trends in web and mobile development.',
    attendees: [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Bob Johnson' }
    ],
    isJoined: false
  };

  const handleJoinEvent = () => {
    // In real app, would call API to join event
    console.log('Joined event:', eventId);
    // Show success message
  };

  const handleOpenChat = () => {
    navigation.navigate('EventChat', { eventId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{eventDetails.title}</Text>
        <Text style={styles.dateTime}>{eventDetails.date} • {eventDetails.time}</Text>
        <Text style={styles.location}>{eventDetails.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{eventDetails.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendees ({eventDetails.attendees.length})</Text>
        {eventDetails.attendees.map(attendee => (
          <Text key={attendee.id} style={styles.attendee}>{attendee.name}</Text>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={handleJoinEvent}
        >
          <Text style={styles.joinButtonText}>
            {eventDetails.isJoined ? 'Leave Event' : 'Join Event'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleOpenChat}
        >
          <Text style={styles.chatButtonText}>Open Chat</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#666666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  attendee: {
    fontSize: 16,
    color: '#333333',
    marginVertical: 5,
  },
  actions: {
    padding: 20,
    gap: 10,
  },
  joinButton: {
    backgroundColor: '#0066CC',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0066CC',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventDetailScreen;