import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const newsItems = [
  { id: 'n1', title: 'تنبيه إداري', body: 'يرجى الالتزام بالهدوء أثناء الاختبارات.' },
  { id: 'n2', title: 'إشعار جديد', body: 'تم فتح قروب جديد لمادة CS201.' }
];

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={newsItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  title: { fontWeight: '700', marginBottom: 4 },
  body: { color: '#4b5563' }
});
