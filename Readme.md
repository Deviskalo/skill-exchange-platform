# SkillSwap

Have you ever wanted to learn a new skill or share your expertise with others? SkillSwap is the perfect platform for you! Whether you're exploring a new interest, building practical skills, or looking for a fresh perspective, SkillSwap makes it easier to connect with people who can help you grow.

SkillSwap is a platform for exchanging skills and knowledge. Connect with people worldwide to teach what you know and learn what you love. Create a profile, share the skills you can offer, and discover people with experience in the topics you want to explore. From creative hobbies to professional know-how, every exchange is an opportunity to learn together.

At SkillSwap, we believe that learning is a lifelong process, and we're here to help you take your skills to the next level. Find a learning partner, arrange a session that works for you, and build confidence through hands-on knowledge sharing. By bringing learners and teachers together, SkillSwap helps make learning more collaborative, approachable, and rewarding.

![SkillSwap](/public/skillSwap_banner.png)

## Features

- 🔐 Authentication with Email/Password and Google
- 👥 User Profiles
- 🎯 Skill Categories
- 📚 Skill Sharing
- 📅 Session Booking
- ⭐ Reviews System

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- shadcn/ui
- Firebase Auth
- MongoDB
- Prisma ORM

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/Deviskalo/skill-exchange-platform.git
cd skill-exchange-platform
```

2. Install dependencies

```bash
npm install
```

```bash
yarn
```

```bash
bun install
```

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

4. Add your environment variables to `.env`:

```
# Database
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority"

# Firebase client configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK service account (server-only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

The Admin SDK values are required for server-side session cookies and should
come from a Firebase service account. Do not expose them with `NEXT_PUBLIC_`
prefixes or commit the populated `.env` file.

Profile avatars are stored as small data URLs in MongoDB and do not require
Firebase Storage or a Firebase billing-plan upgrade. Avatar uploads are limited
to 1 MB to keep the user records within MongoDB's document size limit.

5. Initialize the database

```bash
npx prisma generate
npx prisma db push
```

6. Run the development server

```bash
npm run dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [MongoDB](https://www.mongodb.com/)
- [Prisma](https://www.prisma.io/)

## Contact

If you have any questions or feedback, please don't hesitate to contact me on Github at [Deviskalo](https://github.com/Deviskalo). You can email me at: [[Dev Iskalo](mailto:deviskalo2000@gmail.com)](mailto:deviskalo2000@gmail.com).

Or the team at: [[Iskalo Tech](mailto:iskalotech@gmail.com)](mailto:iskalotech@gmail.com)

Have a great day!
