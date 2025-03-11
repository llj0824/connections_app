import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../navigation/EventsNavigator';
import { useAuth } from '../../contexts/AuthContext';

type EventChatScreenProps = NativeStackScreenProps<EventsStackParamList, 'EventChat'>;

// Mock data
const initialMessages = [
  {
    id: '1',
    text: 'Hey everyone! Looking forward to the event!',
    sender: {
      id: '2',
      name: 'Jane Smith',
    },
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: '2',
    text: 'Me too! Does anyone know if there will be food?',
    sender: {
      id: '3',
      name: 'Bob Johnson',
    },
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
  },
  {
    id: '3',
    text: 'Yes, there will be snacks and drinks provided!',
    sender: {
      id: '1',
      name: 'John Doe',
    },
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
  },
];

const EventChatScreen: React.FC<EventChatScreenProps> = ({ route }) => {
  const { eventId } = route.params;
  const { user } = useAuth();
  
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  // Format timestamp to readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add new message to the list
    const message = {
      id: String(Date.now()),
      text: newMessage,
      sender: {
        id: user?.id || 'current',
        name: user?.name || 'You',
      },
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // In a real app, would send to API
  };

  const renderMessage = ({ item }: { item: typeof initialMessages[0] }) => {
    const isCurrentUser = item.sender.id === (user?.id || 'current');

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        {!isCurrentUser && (
          <Text style={styles.senderName}>{item.sender.name}</Text>
        )}
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  currentUserBubble: {
    backgroundColor: '#0066CC',
  },
  otherUserBubble: {
    backgroundColor: '#F0F0F0',
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#333333',
  },
  timestamp: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#0066CC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default EventChatScreen; 