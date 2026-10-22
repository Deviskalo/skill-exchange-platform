# Contributing to SkillSwap

Thanks for your interest in improving SkillSwap. Bug fixes, documentation, accessibility improvements, and carefully scoped features are welcome.

## Before you start

1. Search existing issues and pull requests to avoid duplicating work.
2. For a substantial behavior or product change, open an issue first to discuss the proposed scope.
3. Keep changes focused and preserve the existing server/client boundary: database access and authorization belong on the server.

## Local setup

1. Install Node.js and npm.
2. Fork and clone the repository:

   ```bash
   git clone https://github.com/<your-account>/skill-exchange-platform.git
   cd skill-exchange-platform
   npm install
   ```

3. Create `.env.local` using [`.env.example`](.env.example) as a reference.
4. Configure MongoDB and Firebase credentials locally. Never commit populated env files or service-account credentials.
5. Initialize the Prisma client and database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

## Development guidelines

- Use server components for server-side data reads when practical.
- Keep authenticated writes behind server routes and verify the session and resource ownership there.
- Validate untrusted request data with the existing Zod validation patterns.
- Do not expose Firebase Admin secrets or database credentials to browser code.
- Update related documentation when behavior, configuration, or setup changes.
- Keep accessibility, clear error states, and mobile behavior in mind.
- Avoid introducing paid infrastructure requirements without discussing the trade-offs first.

## Checks before submitting

Run the checks applicable to your change:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

If you change booking, authentication, or moderation behavior, include the manual test steps you followed. The project does not currently have an end-to-end test suite, so clearly note any validation that requires configured external services.

## Pull request checklist

- [ ] The change has a clear, focused purpose.
- [ ] Existing behavior and authorization boundaries are preserved.
- [ ] Inputs are validated and errors are handled explicitly.
- [ ] Relevant type checks, linting, and build checks pass (or limitations are explained).
- [ ] User-facing and setup documentation is updated where needed.
- [ ] No credentials, private data, or unrelated generated files are included.
- [ ] The pull request description explains the problem, solution, and verification.

## Reporting security concerns

Please do not publish exploitable vulnerabilities or secrets in a public issue. Contact the repository owner privately through the GitHub profile at [@Deviskalo](https://github.com/Deviskalo) and include only the details needed to investigate safely.

## Community

Be respectful and constructive. Assume good intent, focus feedback on the work, and help keep SkillSwap welcoming to people with different backgrounds and experience levels.
