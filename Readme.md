# SkillSwap

A platform for exchanging skills and knowledge with others. Connect with people worldwide to teach what you know and learn what you love.

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
cd skillswap
```

2. Install dependencies
```bash
npm install
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

MIT License
