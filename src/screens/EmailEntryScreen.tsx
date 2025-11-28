import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthState } from '../state/useAuthState';

type Props = {
  onContinue: (email: string) => void;
};

export default function EmailEntryScreen({ onContinue }: Props) {
  const { signInWithEmail } = useAuthState();
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    signInWithEmail(email.trim());
    onContinue(email);
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
