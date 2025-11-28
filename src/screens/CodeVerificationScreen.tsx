import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthStackParamList } from '../navigation/AuthStack';
import { useAuthState } from '../state/useAuthState';

type Props = NativeStackScreenProps<AuthStackParamList, 'CodeVerification'>;

export default function CodeVerificationScreen({ route, navigation }: Props) {
  const { verifyCode } = useAuthState();
  const [code, setCode] = useState('');

  const handleVerify = () => {
    const isValid = verifyCode(code);
    if (!isValid) {
      Alert.alert('رمز غير صحيح', 'أدخل رمزًا مكونًا من 6 أرقام.');
      return;
    }
    navigation.navigate('Onboarding', { email: route.params.email });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>أدخل الرمز المرسل إلى {route.params.email}</Text>
      <TextInput
        placeholder="123456"
        style={styles.input}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />
      <Button title="تأكيد" onPress={handleVerify} />
      <Text style={styles.hint}>الرمز صالح لدقائق محدودة. يمكنك طلب الإرسال من جديد بعد قليل.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 18, fontWeight: '500', textAlign: 'center', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 4
  },
  hint: { marginTop: 8, color: '#6b7280', textAlign: 'center' }
});
