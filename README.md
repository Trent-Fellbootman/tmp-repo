# Cyber English

A production-grade, cyberpunk-themed English learning app built with Next.js, TypeScript, and Tailwind CSS. Features learning flashcards with TTS, quizzes, and a light SRS for spaced repetition.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Local persistence (localStorage) with easy path to Prisma/Postgres

## Features
- Learn words with neon flashcards (definitions + example sentence)
- Play pronunciation (Web Speech API; fallback to dictionary audio)
- Quiz modes: multiple choice, basic typing/listening drills
- Progress page with due count and quick review
- SRS: simplified SM-2 algorithm

## Running locally
```bash
pnpm i # or npm i / yarn
pnpm dev # or npm run dev
```

## Production database and migrations (optional)
- Local dev uses client-side persistence for demo. For production, wire server actions + Prisma:
  - Add .env with DATABASE_URL (SQLite/Postgres)
  - Define Prisma schema (Word, Review, Session)
  - Implement server actions for study/quiz submits
  - Run `prisma migrate deploy` during CI

## Deployment
- Vercel recommended. Set NEXT_PUBLIC_BASE_URL and any API keys (if you add external TTS).

## Assets
- Images via Next/Image remotePatterns (Unsplash, CDN). Replace with your licensed images as needed.
