# Changelog

Notable changes to SkillSwap are documented here. This project has not yet published a versioned release; entries are grouped under **Unreleased** until releases are tagged.

## [Unreleased] - 2026-10-22

### Added

- Booking conversations for learners and skill providers.
- Rescheduling proposals with accept and decline actions.
- Time-zone-aware scheduling and checks for overlapping confirmed sessions.
- Listing reports and a moderator review queue controlled by an email allowlist.
- Skill search and category/tag filtering.
- Documentation for the current feature set, project status, roadmap, and contribution workflow.

### Changed

- Profile avatar uploads use small MongoDB-backed data URLs instead of requiring Firebase Storage.
- Server-rendered pages and authenticated server endpoints handle database-backed reads and writes.
- Session authentication uses Firebase Admin session cookies, with a safe unauthenticated result when Admin configuration is unavailable.

### Removed

- Removed the public seed API route; sample data is loaded with the Prisma seed command instead.

### Validation status

- TypeScript check and production build passed in the development environment.
- Full multi-user end-to-end validation against configured Firebase and MongoDB services remains to be completed.
