import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthState } from '../state/useAuthState';

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuthState();
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('الاسم مطلوب', 'أدخل اسمك ليظهر لزملائك.');
      return;
    }
    completeOnboarding(name.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>أكمل بياناتك</Text>
      <TextInput
        placeholder="اسم العرض"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Button title="ابدأ" onPress={handleSave} />
      <Text style={styles.hint}>يمكنك تعديل الاسم والصورة لاحقًا من صفحة الملف الشخصي.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
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
