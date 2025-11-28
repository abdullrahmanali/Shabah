import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { useAuthState } from '../state/useAuthState';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuthState();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
