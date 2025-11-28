import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthState } from '../state/useAuthState';

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuthState();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>سجل الدخول للاطلاع على ملفك.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>البريد الجامعي</Text>
      <Text style={styles.value}>{user.email}</Text>

      <Text style={styles.label}>اسم العرض</Text>
      <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} />
      <Button title="حفظ الاسم" onPress={() => updateProfile(displayName)} />
      <Text style={styles.help}>سيتم مزامنة الاسم مع المحادثات الجديدة.</Text>

      <Button title="تسجيل الخروج" color="#ef4444" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#f9fafb' },
  label: { fontWeight: '700', marginTop: 8 },
  value: { backgroundColor: 'white', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  help: { color: '#6b7280' }
});
