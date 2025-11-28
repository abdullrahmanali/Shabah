import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthStackParamList } from '../navigation/AuthStack';
import { useAuthState } from '../state/useAuthState';

const UNIVERSITY_DOMAIN = 'edu';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailEntry'>;

export default function EmailEntryScreen({ navigation }: Props) {
  const { signInWithEmail } = useAuthState();
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (!email.includes('@') || !email.endsWith(`.${UNIVERSITY_DOMAIN}`)) {
      Alert.alert('بريد غير صالح', 'استخدم بريد الجامعة المنتهي بـ edu.');
      return;
    }
    signInWithEmail(email.trim());
    navigation.navigate('CodeVerification', { email });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>سجل ببريدك الجامعي</Text>
      <TextInput
        placeholder="student@university.edu"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="إرسال الرمز" onPress={handleContinue} />
      <Text style={styles.hint}>سيتم إرسال رمز مؤقت إلى بريدك الجامعي.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  hint: { marginTop: 8, color: '#6b7280', textAlign: 'center' }
});
