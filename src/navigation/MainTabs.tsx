import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ChatsScreen from '../screens/ChatsScreen';
import NewsScreen from '../screens/NewsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type MainTabKey = 'Chats' | 'News' | 'Profile';

const tabLabels: Record<MainTabKey, string> = {
  Chats: 'المحادثات',
  News: 'الأخبار',
  Profile: 'الملف الشخصي'
};

export function MainTabs() {
  const [activeTab, setActiveTab] = useState<MainTabKey>('Chats');

  const content = useMemo(() => {
    switch (activeTab) {
      case 'News':
        return <NewsScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <ChatsScreen />;
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>{content}</View>
      <View style={styles.tabBar}>
        {(Object.keys(tabLabels) as MainTabKey[]).map((tabKey) => {
          const isActive = tabKey === activeTab;
          return (
            <Pressable
              key={tabKey}
              onPress={() => setActiveTab(tabKey)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tabLabels[tabKey]}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  content: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  tabButtonActive: {
    backgroundColor: '#eef2ff'
  },
  tabLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600'
  },
  tabLabelActive: {
    color: '#111827'
  }
});
