# SkillSwap Roadmap

This roadmap describes the current implementation and likely next steps. A checked item means the feature exists in the repository; it does not imply the complete journey has been tested against production services.

## Current project stage

**Feature-complete foundation; validating integrations and real user journeys is the next phase.**

The app has a production build and passes its TypeScript check in the development environment. There is not yet an automated end-to-end suite, and real multi-user behavior against Firebase and MongoDB still needs deliberate verification.

## ✅ Completed foundations

- [x] Next.js App Router application with server-rendered database-backed pages.
- [x] Firebase email/password, Google, and GitHub authentication UI.
- [x] Firebase Admin session-cookie creation and server-side verification.
- [x] Synchronize authenticated Firebase identities with MongoDB user records through Prisma.
- [x] User profile editing, learning interests, and small avatar data URL uploads without Firebase Storage.
- [x] Skill listing create, read, update, browse, category, tags, and search/filter experiences.
- [x] Booking requests with future-time and time-zone validation, request limits, and conflict checks.
- [x] Booking confirmation, decline, cancellation, completion, and reschedule proposals.
- [x] Participant-only booking conversation threads.
- [x] Reviews for completed bookings.
- [x] Skill reporting, moderation access allowlist, and moderator report status actions.
- [x] Development seed script and setup documentation.
- [x] TypeScript check and production build pass in the current development environment.

## 🎯 Do now: integration and journey validation

1. **Verify local configuration**
   - Confirm `.env.local` contains valid MongoDB and Firebase client/Admin settings.
   - Confirm Firebase Authentication providers and authorized domains are configured.
   - Confirm the MongoDB URI includes the intended database name.

2. **Exercise the core journey with at least two test accounts**
   - Sign up and sign in with supported providers.
   - Edit profile details and upload an avatar.
   - Create and browse a skill listing.
   - Request a booking and verify both participant views.
   - Confirm, decline, cancel, and reschedule sessions as appropriate.
   - Exchange booking messages, complete a session, and submit a review.

3. **Exercise trust and safety**
   - Submit a listing report as a non-owner.
   - Verify duplicate and rate-limit behavior.
   - Confirm allowlisted moderator access and report status updates.
   - Verify regular accounts cannot access moderation actions.

4. **Add repeatable automated coverage**
   - Add focused tests for booking transition rules, authorization, validation, and report moderation.
   - Add integration or browser tests for the highest-priority multi-step journeys.
   - Document which services and test fixtures are required.

5. **Polish issues found during testing**
   - Review mobile layouts and keyboard/accessibility behavior.
   - Improve action feedback and empty/error states where user testing exposes gaps.
   - Check booking timestamps across different time zones and daylight-saving transitions.

## 🔭 Future opportunities

These are ideas, not promises or currently implemented features:

- In-app and email notifications for new requests, reschedules, and messages.
- Availability calendars and configurable session durations.
- Richer review context and public trust signals.
- More robust search, sorting, and discovery recommendations.
- Additional moderation tools, audit history, and account-level reporting.
- A dedicated media-storage provider if avatar or listing-media needs outgrow the current MongoDB approach.
- Production deployment, monitoring, backups, and operational runbooks.

## Status key

- **Completed**: implemented in the repository.
- **Do now**: the recommended next development phase.
- **Future**: optional product direction to prioritize based on user feedback.
