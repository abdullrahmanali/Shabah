# Architecture & Implementation Guide

## Overview
A WhatsApp-inspired chat app for university students built with React Native (Expo) and Firebase. Focus areas: verified university email login, course/section-based group discovery, and rich chat features (media, polls, notify-all, news).

## Tech stack
- **Client:** React Native (TypeScript, Expo), lightweight in-app routing (custom tab shell), React Query, Zustand/Redux Toolkit, Firebase JS SDK, UI kit (e.g., Tamagui/Native Base) with light theme.
- **Backend (Firebase):**
  - Authentication (email link/OTP via Firebase Auth + Action Codes)
  - Firestore (groups, members, messages, polls, news)
  - Cloud Storage (media uploads)
  - Cloud Functions (auth domain enforcement, moderation, notify-all throttling, push notification fan-out)
  - Firebase Cloud Messaging (push notifications)
  - Firebase Emulator Suite for local development

## Key flows
### Authentication
1. Collect university email; validate domain allowlist on client and Functions.
2. Trigger Firebase email action code or custom OTP via Function.
3. Verify code → obtain Firebase Auth session.
4. On first login, collect display name and optional avatar; create `users/{uid}` doc.
5. Persist session; refresh token on app start. Implement "resend code" with cooldown.

### Group join & creation
- **Course groups:** join by course code (e.g., `CS101`).
- **Section groups:** join by section number (e.g., `CS101-202`).
- Allow auto-create if not found (configurable) and limit to university domains.
- Store membership in `groups/{groupId}/members/{uid}` with roles and mute settings.

### Messaging
- Firestore real-time listeners per group; paginate with `limit` + `startAfter`.
- Messages support text, images/videos/documents (Cloud Storage), and voice notes.
- Reactions map, threaded replies, polls (options + votes), and pinned news entries.
- "Notify everyone" flag triggers Cloud Function to send FCM to all members (rate-limited).
- Typing indicators via presence doc in `groups/{id}/members/{uid}` or Realtime Database channel.

### Notifications
- FCM tokens stored per user; topic-like fan-out handled by Cloud Function when notify-all or @mentions occur.
- Respect per-group mute settings; allow global quiet hours.

## Data model sketches
- `users/{uid}`: { email, domain, displayName, photoURL, verified, fcmTokens[], createdAt }
- `groups/{groupId}`: { type: 'course'|'section', code, title, description, createdBy, memberCount, createdAt }
- `groups/{groupId}/members/{uid}`: { role, joinedAt, mutedUntil, lastReadAt, typing }
- `groups/{groupId}/messages/{id}`: { senderId, type: 'text'|'image'|'video'|'file'|'audio'|'poll', text, mediaUrl, mediaType, mediaSize, poll:{options[], votes{}}, reactions:{emoji:[uid]}, replyTo, pinned, notifyAll, createdAt }
- `groups/{groupId}/news/{id}`: { title, body, mediaUrl?, createdBy, createdAt, pinned }

## Security & compliance
- Firestore rules enforce membership checks for reads/writes.
- Validate email domain server-side on sign-up (Cloud Function guard + Firestore rule on `users`).
- Limit message size/types; validate storage uploads via Functions triggers.
- Rate-limit notify-all and poll creation to prevent spam.
- Audit logs for admin actions (pinning, removing members).

## UI layout (high-level)
- **Auth flow:** Email entry → Code verification → Onboarding.
- **Main:** Custom tab bar (Chats, News, Profile). Chats screen lists joined groups; quick actions to join via code/section.
- **Chat room:** header with group info, body with message list, composer with attachments, poll creation sheet, notify-all toggle for admins, pinned news bar, and media preview modal.
- **News screen:** ordered by `createdAt`, supports pinning and media.
- **Profile:** edit name/photo, manage notifications, sign out.

## Task breakdown (MVP)
1. Scaffold Expo TypeScript project; set up linting/prettier.
2. Implement Firebase initialization and env config; add Emulator Suite support.
3. Build auth screens + verification; create profile doc on first login.
4. Group join/create by code/section; membership persistence.
5. Chat room with Firestore listeners, pagination, media upload, reactions, polls, and notify-all.
6. News feed with pinning; admin-only actions enforced via rules.
7. Push notifications with FCM; mute/quiet hours.
8. Polish UI (avatars, read receipts, typing indicator) and ship basic tests (unit + e2e).

## Testing recommendations
- Use Firebase Emulators for deterministic tests.
- Unit test hooks and utilities; integration tests for auth and messaging flows with Detox (Expo-compatible) or React Native Testing Library.
- Load test Cloud Functions for notify-all and media upload validation.
