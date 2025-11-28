import React, { useMemo, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuthState } from '../state/useAuthState';
import { Group, GroupType, Message, useChatState } from '../state/useChatState';

export default function ChatsScreen() {
  const { user } = useAuthState();
  const { groups, messages, joinGroup, sendMessage } = useChatState();
  const [courseCode, setCourseCode] = useState('');
  const [sectionCode, setSectionCode] = useState('');
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [text, setText] = useState('');

  const filteredMessages = useMemo(
    () => messages.filter((m) => m.groupId === activeGroup?.id).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    [messages, activeGroup?.id]
  );

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>سجل دخولك أولاً للوصول إلى المحادثات.</Text>
      </View>
    );
  }

  const handleJoin = (code: string, type: GroupType) => {
    if (!code.trim()) return;
    const group = joinGroup(code.trim(), type, user);
    setActiveGroup(group);
    if (type === 'course') setCourseCode('');
    if (type === 'section') setSectionCode('');
  };

  const handleSend = () => {
    if (!text.trim() || !activeGroup) return;
    sendMessage(activeGroup.id, user, text.trim());
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.joinCard}>
        <Text style={styles.cardTitle}>ادخل كود المادة</Text>
        <View style={styles.row}>
          <TextInput placeholder="CS101" style={styles.input} value={courseCode} onChangeText={setCourseCode} />
          <Button title="انضم" onPress={() => handleJoin(courseCode, 'course')} />
        </View>
        <Text style={styles.cardTitle}>أو ادخل رقم الشعبة</Text>
        <View style={styles.row}>
          <TextInput placeholder="CS101-202" style={styles.input} value={sectionCode} onChangeText={setSectionCode} />
          <Button title="انضم" onPress={() => handleJoin(sectionCode, 'section')} />
        </View>
      </View>

      <Text style={styles.subheading}>مجموعاتك</Text>
      <FlatList
        data={groups}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, paddingVertical: 6 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.groupBadge, activeGroup?.id === item.id && styles.groupBadgeActive]}
            onPress={() => setActiveGroup(item)}
          >
            <Text style={styles.groupCode}>{item.code}</Text>
            <Text style={styles.groupType}>{item.type === 'course' ? 'مادة عامة' : 'شعبة'}</Text>
          </TouchableOpacity>
        )}
      />

      {activeGroup ? (
        <View style={styles.chatBox}>
          <Text style={styles.chatTitle}>{activeGroup.title}</Text>
          <FlatList
            data={filteredMessages as Message[]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.messageBubble}>
                <Text style={styles.messageSender}>{item.sender}</Text>
                <Text>{item.text}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
          <View style={styles.row}>
            <TextInput
              placeholder="اكتب رسالة أو تصويت..."
              style={[styles.input, { flex: 1 }]}
              value={text}
              onChangeText={setText}
            />
            <Button title="إرسال" onPress={handleSend} />
          </View>
        </View>
      ) : (
        <View style={styles.empty}>
          <Text>اختر مجموعة لعرض المحادثة.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  joinCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8
  },
  cardTitle: { fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  subheading: { fontWeight: '700', marginTop: 4 },
  groupBadge: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  groupBadgeActive: { borderColor: '#10b981', backgroundColor: '#ecfdf3' },
  groupCode: { fontWeight: '700' },
  groupType: { color: '#6b7280' },
  chatBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    gap: 8
  },
  chatTitle: { fontSize: 16, fontWeight: '700' },
  messageBubble: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    maxWidth: '90%'
  },
  messageSender: { fontWeight: '700', marginBottom: 2 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: 'white'
  }
});
