# Shabah QA Snapshot

## Current install/test status
- `npm install` fails in this environment with `403 Forbidden` when fetching `@expo/vector-icons`, so no packages or tests were executed.

## Key findings
1. **Auth is fully local and bypasses verification**
   - The verification screen only checks that the code length is six digits; it never calls Firebase or validates the email-owner, so anyone can proceed with any code.【F:src/screens/CodeVerificationScreen.tsx†L10-L35】
   - Onboarding completes by writing the pending email + display name directly into local state without any server persistence or session tokens.【F:src/state/useAuthState.tsx†L18-L38】

2. **Email domain validation is too permissive**
   - The email entry screen only enforces that the address ends with `.edu`, allowing non-university domains that share that suffix (e.g., `example.edu`). There is no allowlist or Firebase enforcement for a specific university domain.【F:src/screens/EmailEntryScreen.tsx†L13-L33】

3. **Chat data is mock-only**
   - Groups and messages live purely in React state seeded with hardcoded values; joins/messages are not persisted to Firestore and will be lost on app restart.【F:src/state/useChatState.tsx†L20-L68】
   - Message sending stores plain text only—no handling for polls, reactions, media uploads, or notifications mentioned in the feature list.【F:src/screens/ChatsScreen.tsx†L58-L105】

4. **Missing Firebase integration and security rules**
   - There are no Firebase SDK calls, Firestore queries, or Storage/FCM integrations; all flows (auth, groups, chat, news) operate in-memory, so user isolation, moderation, and access control are absent.【F:App.tsx†L1-L29】【F:docs/architecture.md†L12-L37】

## Recommendations
- Run `npm install` in an unrestricted network and add automated lint/test runs to verify TypeScript correctness.
- Replace the local auth store with Firebase Authentication + email action codes; enforce the university domain both client-side and in Firebase rules/Cloud Functions.
- Back chat/groups with Firestore collections and Storage for media; stream updates via listeners and add role-based rules for posting/pinning/notify-all.
- Implement the promised messaging features (polls, reactions, attachments) with proper validation and UI state.
