import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import navigators and screens
import EventsNavigator from './EventsNavigator';
import ProfileNavigator from './ProfileNavigator';

// Define main tab param list
export type MainTabParamList = {
  Events: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// We'll use this for tab icons once we have the actual icons
const TabIcon = ({ name }: { name: string }) => {
  return <Text>{name}</Text>
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: '#999999',
      }}
    >
      <Tab.Screen 
        name="Events" 
        component={EventsNavigator}
        options={{
          tabBarIcon: () => <TabIcon name="📅" />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator}
        options={{
          tabBarIcon: () => <TabIcon name="👤" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator; 