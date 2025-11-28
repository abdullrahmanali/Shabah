import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/state/useAuthState';
import { ChatProvider } from './src/state/useChatState';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f9fafb'
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ChatProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </ChatProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
