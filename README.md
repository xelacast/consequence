# Consequence

## Description

Learn the consequences of your actions. Track your habits and learn how they affect you to make better improvements for you life. Consequence is a habit tracking app with AI feedback to show you correlations of your actions and consequences. It helps you see what and how is affecting your life. Let's make better decisions! 👍

Definition of Consequence: `a result or effect of an action or condition.`

NOTE: The AI feature of this application is in progress.

## Motivation

I want to see the consequence of my action, how my actions are affecting me. Am I aiming well with self improvement? Is cardio right for me? What am I doing that is using up my time but are not aligned with who I aspire to be? How is it affecting me? There are a ton of questions I have, and a lot of health and habit trackers on the market. None of them i've come across have a built in AI tool to communicate with your data.

I have experienced abdominal discomfort for many years and have been taking notes on how to improve it. I have several filled notebooks of notes and journaling, and more of planning and optimization. Going through all of this data would take me weeks and I have lost a few along the way. <em>Why not have it at the edge of my finger tips and chat with it directly?</em>

## ⚙️ Quick Start

### Clone the repo

```bash
git clone git@github.com:xelacast/consequence.git
```

### Update the .env

```bash
cp env.example .env
```

#### Required api keys

NOTE: Insert clerk KEYs, activate DB, and turn on development environment before you create your first account on the clerk dashboard. The app will be waiting for a signal from clerks websocket connection to mirror the clerk account in the db.

2nd NOTE: You will need to create an account and setup a free app. The first two keys are in the left side nav <em>Developers - API Keys</em>. You must create a webhook endpoint and paste the Signing Secret to the WEBHOOK_SECRET.

- [Clerk](https://clerk.com/)
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - CLERK_SECRET_KEY
  - WEBHOOK_SECRET
- DATABASE_URL

### Create DB in docker

```bash
./start-database.sh
```

### Start Development Environment

```bash
pnpm db:push && pnpm dev
```

and travel to `http://localhost:3000/dashboard/day`

At this time you will see a login screen.

1. Navigate to [clerk's dashboard](https://dashboard.clerk.com/) and create a user.
2. Go back to the app and login with the same credentials (it's easiest to use a google account).

## Usage

### Tech Stack

- Next.js
- TailwindCSS
- shadcn/ui (UI)
- Clerk (Auth)
- Prisma (ORM)
- PostgreSQL (DB)
- Docker (for hosting db locally)
- Vitest/jest-dom (testing)

### Features

- Calendar that shows green for days you have inputted.
- Supplement Configuration/Creation
  - Creation
  - Toggle: Toggle on and off supplements to declutter form. (issue #1)
- Form for sleep, exercise, mental/physical health, stress, meditation, IF, cold showers
  - Editable and Creatable
  - Exercise and Supplements are optional
  - Future update will modularize the form. Monolithic form is a chore to work with and use.
- Journaling Page
- Mobile Friendly

https://github.com/xelacast/consequence/assets/63383168/68962696-d43a-41fd-9603-d2347edda98a

https://github.com/xelacast/consequence/assets/63383168/57d5ef99-2e9d-47bd-bf6c-76024cfc3866

https://github.com/xelacast/consequence/assets/63383168/74b0e5fe-5a8d-4294-8a9b-9158c95c4684

https://github.com/xelacast/consequence/assets/63383168/12522527-b2d8-42f6-b6f3-ce873e46bafa

https://github.com/xelacast/consequence/assets/63383168/36297d0e-ec59-4f45-93a1-7aaf87eef1fd

### App Architecture

The notes section are notes of my ideas. Unfortunately There is no documentation on components and systems yet

## 🤝 Contributing
