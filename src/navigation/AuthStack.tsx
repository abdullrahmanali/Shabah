import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import EmailEntryScreen from '../screens/EmailEntryScreen';
import CodeVerificationScreen from '../screens/CodeVerificationScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

export type AuthStackParamList = {
  EmailEntry: undefined;
  CodeVerification: { email: string };
  Onboarding: { email: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EmailEntry"
        component={EmailEntryScreen}
        options={{ title: 'تسجيل الدخول الجامعي' }}
      />
      <Stack.Screen
        name="CodeVerification"
        component={CodeVerificationScreen}
        options={{ title: 'تأكيد الرمز' }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ title: 'الملف الشخصي' }}
      />
    </Stack.Navigator>
  );
}
