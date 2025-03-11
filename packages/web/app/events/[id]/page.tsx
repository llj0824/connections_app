'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Event } from '@/src/models/event';
import { Message } from '@/src/models/message';
import Link from 'next/link';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data.event);
        
        // Once we have the event, fetch messages
        const messagesResponse = await fetch(`/api/events/${eventId}/messages`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData.messages || []);
        }
      } catch (err) {
        setError('Error loading event details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  // Join event function
  const handleJoinEvent = async () => {
    if (!event) return;
    
    setJoining(true);
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to join the event');
      }
      
      const data = await response.json();
      setEvent(data.event);
    } catch (err) {
      setError('Error joining the event. Please try again later.');
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  // Send message function
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !event) return;

    try {
      const response = await fetch(`/api/events/${eventId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newMessage
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      setMessages([...messages, data.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Event not found'}
        <div className="mt-4">
          <Link href="/events" className="text-blue-600 hover:underline">
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is already an attendee
  const isAttending = event.attendees.includes('1'); // Using hardcoded user ID for demo

  // Format date in a readable way
  const formattedDate = new Date(event.datetime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/events" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to events
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        
        <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
          <div className="flex items-center">
            <span className="mr-1">📍</span>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">🗓️</span> 
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">👥</span>
            <span>{event.attendees.length} attending</span>
          </div>
        </div>
        
        <p className="mb-6 whitespace-pre-line">{event.description}</p>
        
        {!isAttending ? (
          <button
            onClick={handleJoinEvent}
            disabled={joining}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {joining ? 'Joining...' : 'Join Event'}
          </button>
        ) : (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded inline-block">
            You're attending this event
          </div>
        )}
      </div>
      
      {isAttending && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Event Chat</h2>
          
          <div className="border rounded-lg mb-4 h-64 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No messages yet. Be the first to say hello!</p>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="bg-white p-3 rounded shadow-sm">
                    <div className="font-semibold">User {message.senderId}</div>
                    <div>{message.text}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow border rounded p-2"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 