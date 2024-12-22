# SkillSwap

Have you ever wanted to learn a new skill or share your expertise with others? SkillSwap is the perfect platform for you!

A platform for exchanging skills and knowledge with others. Connect with people worldwide to teach what you know and learn what you love.

At SkillSwap, we believe that learning is a lifelong process, and we're here to help you take your skills to the next level.

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
DATABASE_URL="your_mongodb_url"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

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
