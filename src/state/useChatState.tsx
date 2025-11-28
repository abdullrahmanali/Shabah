import React, { createContext, useContext, useMemo, useState } from 'react';
import { User } from './useAuthState';

export type GroupType = 'course' | 'section';

export type Group = {
  id: string;
  type: GroupType;
  code: string;
  title: string;
  members: string[];
};

export type Message = {
  id: string;
  groupId: string;
  sender: string;
  text: string;
  createdAt: Date;
};

type ChatContextValue = {
  groups: Group[];
  messages: Message[];
  joinGroup: (code: string, type: GroupType, user: User) => Group;
  sendMessage: (groupId: string, user: User, text: string) => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const starterGroups: Group[] = [
  { id: 'g1', type: 'course', code: 'CS101', title: 'CS101 - أساسيات البرمجة', members: [] },
  { id: 'g2', type: 'section', code: 'CS101-202', title: 'شعبة 202', members: [] }
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>(starterGroups);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      groupId: 'g1',
      sender: 'نظام',
      text: 'مرحبًا بك في مجموعات المواد. ابدأ بكتابة رسالة أو أرسل تصويت.',
      createdAt: new Date()
    }
  ]);

  const joinGroup = (code: string, type: GroupType, user: User) => {
    const existing = groups.find((g) => g.code.toLowerCase() === code.toLowerCase());
    if (existing) {
      setGroups((prev) => prev.map((g) => (g.id === existing.id ? { ...g, members: Array.from(new Set([...g.members, user.email])) } : g)));
      return { ...existing, members: Array.from(new Set([...existing.members, user.email])) };
    }
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      type,
      code,
      title: type === 'course' ? `${code} - مجموعة مادة` : `الشعبة ${code}`,
      members: [user.email]
    };
    setGroups((prev) => [...prev, newGroup]);
    return newGroup;
  };

  const sendMessage = (groupId: string, user: User, text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        groupId,
        sender: user.displayName,
        text,
        createdAt: new Date()
      }
    ]);
  };

  const value = useMemo(() => ({ groups, messages, joinGroup, sendMessage }), [groups, messages]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export function useChatState() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatState must be used inside ChatProvider');
  return ctx;
}
