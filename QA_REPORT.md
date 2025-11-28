# Shabah QA Snapshot

## Current install/test status
- `npm install` still fails in this environment with `403 Forbidden` responses from the npm registry (e.g., when fetching `expo`), so dependency installation and automated checks could not run here.

## Key findings
1. **Auth is fully local and bypasses verification**
   - The verification screen only checks that the code passes a length check via the mock `verifyCode`; it never calls Firebase or validates email ownership, so anyone can proceed with any six digits. 【F:src/screens/CodeVerificationScreen.tsx†L5-L55】【F:src/state/useAuthState.tsx†L18-L42】
   - Onboarding completes by writing the pending email + display name directly into local state without any server persistence or session tokens. 【F:src/state/useAuthState.tsx†L18-L42】

2. **Email domain validation is minimal**
   - The email entry flow only enforces that the address ends with `.edu` and does not check a specific university allowlist or Firebase-side rules. 【F:App.tsx†L45-L56】【F:src/screens/EmailEntryScreen.tsx†L5-L47】

3. **Chat data is mock-only**
   - Groups and messages live purely in React state seeded with hardcoded values; joins/messages are not persisted to Firestore and will be lost on app restart. 【F:src/state/useChatState.tsx†L20-L83】
   - Message sending stores plain text only—no handling for polls, reactions, media uploads, or notifications mentioned in the feature list. 【F:src/screens/ChatsScreen.tsx†L58-L105】

4. **Missing Firebase integration and security rules**
   - There are no Firebase SDK calls, Firestore queries, or Storage/FCM integrations; all flows (auth, groups, chat, news) operate in-memory, so user isolation, moderation, and access control are absent. 【F:App.tsx†L14-L75】【F:docs/architecture.md†L1-L37】

## Recommendations
- Run `npm install` in an unrestricted network and re-enable linting/tests once dependencies download successfully.
- Replace the local auth store with Firebase Authentication + email action codes; enforce the university domain both client-side and in Firebase rules/Cloud Functions.
- Back chat/groups with Firestore collections and Storage for media; stream updates via listeners and add role-based rules for posting/pinning/notify-all.
- Implement the promised messaging features (polls, reactions, attachments) with proper validation and UI state.
