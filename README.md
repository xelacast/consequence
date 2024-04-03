# Consequence

## Description

Learn the consequences of your actions. Track your habits and learn how they affect you to make better improvements for you life. Consequence is a habit tracking app with AI feedback to show you correlations of your actions and consequences. It helps you see what and how is affecting your life. Let's make better decisions! 👍

Definition of Consequence: `a result or effect of an action or condition.`

NOTE: The AI feature of this application is in progress.

## Motivation

I want to see the consequence of my action, how my actions are affecting me. Am I aiming well with self improvement? Is cardio right for me? What am I doing that is using up my time but are not aligned with who I aspire to be? How is it affecting me? There are a ton of questions I have, and a lot of health and habit trackers on the market. None of them i've come across have a built in AI tool to communicate with your data.

I have experienced abdominal discomfort for many years and have been taking notes on how to improve it. I have several filled notebooks of notes and journaling, and more of planning and optimization. Going through all of this data would take me weeks and I have lost a few along the way. <em>Why not have it at the edge of my finger tips and chat with it directly?</em>

## ⚙️ Quick Start

### Requirements

- Node v18+ (locally running on v21.6.1)
- Docker
- pnpm

### Clone the repo

```bash
git clone git@github.com:xelacast/consequence.git
```

### Update the .env

```bash
cp .env.example .env
```

#### Required api keys

NOTE: Insert clerk KEYs, activate DB, and turn on development environment before you create your first account on the clerk dashboard. The app will be waiting for a signal from clerks websocket connection to sync clerk users to the db.

2nd NOTE:

- You will need to create an account and setup a free app. The first two keys are in the left side nav <em>Developers - API Keys</em>.
- You must create a clerk webhook endpoint and paste the Signing Secret to the WEBHOOK_SECRET. (see localtunnel below for the correct url)


- [Clerk](https://clerk.com/)
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - CLERK_SECRET_KEY
  - WEBHOOK_SECRET
- DATABASE_URL

### Create DB in docker and run container

This will create and run a postgreSQL db in docker with a container name of web-postgres

```bash
./start-database.sh
```

(optional) You can also use docker desktop or start to start the server or docker stop to stop server

```bash
docker start web-postgres
```

### Start Development Environment on port 3000

```bash
pnpm i && pnpm db:push && pnpm dev
```

### Start a localtunnel to connect clerk websocket for user sync to db

```bash
ts --port 3000
```

1. Navigate to [clerk's dashboard](https://dashboardclerk.com) and create your websocket. Websocket is located in the left side nav of the dashboard close to the bottom.
2. Copy the localtunnel url and append <em>/api/websocket</em> to it. Example: https://red-ghosts-wash.loca.lt/api/websocket. Use this as your websocket url.
3. Use the <em>Signing Secret</em> as the WEBHOOK_SECRET for your .env file.
4. Create a new user inside your clerk application.
5. Go back to the app `localhost:3000` and login with the same credentials (it's easiest to use a google account).

NOTE: if the localtunnel is slow shut it down and use the localhost:3000. The localtunnel was only for the websocket connection.

## Usage

### Tech Stack

Initial Creation of stack was made with the [T3 Stack](https://create.t3.gg)

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

Feel free to contribute as you want. Guidelines on contributions are being built will be uploaded asap.
