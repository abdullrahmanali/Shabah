import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import ChatsScreen from '../screens/ChatsScreen';
import NewsScreen from '../screens/NewsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type MainTabParamList = {
  Chats: undefined;
  News: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen name="Chats" component={ChatsScreen} options={{ title: 'المحادثات' }} />
      <Tab.Screen name="News" component={NewsScreen} options={{ title: 'الأخبار' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'الملف الشخصي' }} />
    </Tab.Navigator>
  );
}
