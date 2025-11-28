import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, StyleSheet, View } from 'react-native';
import { AuthProvider, useAuthState } from './src/state/useAuthState';
import { ChatProvider } from './src/state/useChatState';
import EmailEntryScreen from './src/screens/EmailEntryScreen';
import CodeVerificationScreen from './src/screens/CodeVerificationScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { MainTabs } from './src/navigation/MainTabs';

type AuthFlow = 'EmailEntry' | 'CodeVerification' | 'Onboarding' | 'Main';

function RootContent() {
  const { user, signInWithEmail } = useAuthState();
  const [flow, setFlow] = useState<AuthFlow>('EmailEntry');
  const [pendingEmail, setPendingEmail] = useState('');

  useEffect(() => {
    if (user) {
      setFlow('Main');
    } else {
      setFlow('EmailEntry');
    }
  }, [user]);

  const content = useMemo(() => {
    if (flow === 'Main') {
      return <MainTabs />;
    }

    if (flow === 'CodeVerification') {
      return (
        <CodeVerificationScreen
          email={pendingEmail}
          onSuccess={() => setFlow('Onboarding')}
        />
      );
    }

    if (flow === 'Onboarding') {
      return <OnboardingScreen />;
    }

    return (
      <EmailEntryScreen
        onContinue={(email) => {
          const trimmed = email.trim();
          if (!trimmed.includes('@') || !trimmed.endsWith('.edu')) {
            Alert.alert('بريد غير صالح', 'استخدم بريد الجامعة المنتهي بـ edu.');
            return;
          }
          setPendingEmail(trimmed);
          signInWithEmail(trimmed);
          setFlow('CodeVerification');
        }}
      />
    );
  }, [flow, pendingEmail, signInWithEmail]);

  return <View style={styles.container}>{content}</View>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ChatProvider>
          <StatusBar style="dark" />
          <RootContent />
        </ChatProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  }
});
