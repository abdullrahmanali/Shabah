# Shabah Chat

A React Native + Firebase chat application tailored for university students. It provides secure university-email login, course/section-based group chats, and rich messaging capabilities.

## Features
- **University email sign-up** with one-time code verification sent to the institutional email domain. First-time users capture their display name.
- **Group types**
  - **General course groups:** join via course code (e.g., `CS101`).
  - **Class section groups:** join via section number (e.g., `CS101-202`).
- **Messaging**
  - Text, images, videos, documents, and voice notes.
  - Reactions, replies, and polls.
  - "Notify everyone"/announcement posts and news pinning.
- **UX**
  - WhatsApp-inspired UI with simple theme, avatars, read receipts, and typing indicators.
  - Per-group mute and notifications.

## Architecture
- **Client:** React Native (Expo recommended) with TypeScript.
- **Backend:** Firebase Authentication (email + action code), Firestore (chat data), Cloud Storage (media), Cloud Functions (moderation, fan-out, notifications), and Firebase Cloud Messaging.
- **State & Data:** React Query (server state) + Zustand/Redux Toolkit (UI state). Streaming with Firestore listeners.
- **Navigation:** React Navigation (stack + tabs), guarded routes after auth.

## Data model (Firestore)
- `users/{uid}`: profile, email domain, display name, verified flag, photo URL, createdAt.
- `groups/{groupId}`: type (`course` or `section`), code, title, description, memberCount, createdBy, createdAt.
- `groups/{groupId}/members/{uid}`: role (`admin`, `member`), joinedAt, mute settings.
- `groups/{groupId}/messages/{messageId}`: sender, text/content type, media refs, poll metadata, reactions, createdAt, pinned, notifyAll flag.
- `invites/{inviteId}`: pending invitations (optional if needed for admin flows).

## Authentication flow
1. User enters university email → app checks domain allowlist.
2. Send Firebase email action code (or OTP via Cloud Function) to the email.
3. On first login, prompt for display name and avatar; write `users/{uid}`.
4. Persist session via Firebase Auth; refresh silently on app start.

## Group join/create flow
- **Course group:** enter course code → search `groups` where `type="course"` and `code` matches → join document in `members` subcollection.
- **Section group:** enter section number → same logic with `type="section"`.
- Optionally allow admins to create groups; auto-create if not found and policy permits.

## Messaging flow
- Messages written to `groups/{id}/messages` with server timestamp.
- Upload media to Cloud Storage, store download URL + metadata in message.
- Reactions stored as map of emoji → array/count of userIds; polls store options + votes.
- Cloud Functions handle fan-out notifications, "notify everyone" limits, and content moderation hooks.

## Firebase security highlights
- Restrict auth to university domains (client validation + backend check in Firestore rules/Functions).
- Users can only read/write groups they belong to; admins can pin/announce.
- Validate media sizes/types before upload; limit message length.
- Rate limit message posting and poll creation.

## Local development
1. Install dependencies: `npm install -g expo-cli` then `npm install` inside the project once initialized.
2. Create `app.config.js` with Firebase config (or use `.env` + `app.config.js` to read vars).
3. Start app: `expo start` (or `npm run start`).
4. Use Firebase Emulator Suite during development for Auth, Firestore, Functions, and Storage.

## Testing & QA
- **Automated checks:** Run `npm run lint` after installing dependencies.
- **Current status:** Dependency installation is blocked in this environment by `403 Forbidden` errors when fetching scoped packages such as `@react-navigation/bottom-tabs`. Re-run `npm install` in a network-allowed environment before linting or building.

## Demo scaffold
- This repository now includes an Expo + TypeScript starter (`App.tsx` and `src/`) with:
  - Auth stack: email entry, code verification, and onboarding screens in Arabic.
  - Main tabs: Chats (course/section join flow + mock chat), News (static updates), and Profile (name update + sign out).
- State is local-only (mocked auth/chat stores); replace with Firebase integrations following the architecture notes.

## Initial screen map
- **Auth stack:** Email entry → Code verification → Onboarding (name/avatar).
- **Main tabs:** Chats, News/Announcements, Profile.
- **Chats:** list of joined groups; new group join via code/section modal.
- **Chat room:** messages, attachments, polls, reactions, notify-all toggle for admins, pinned news bar.
- **Profile:** edit name/photo, notification preferences, logout.

## Folder structure (proposed)
```
app/
  components/
  screens/
  navigation/
  hooks/
  services/ (firebase clients)
  store/ (state)
  utils/
```

## Next steps
- Scaffold Expo project with TypeScript template.
- Add Firebase SDK initialization with environment-based config.
- Implement auth screens and verification flow.
- Build group join/create flows and Firestore listeners.
- Implement messaging UI with Storage uploads and FCM notifications.

