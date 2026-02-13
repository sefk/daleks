# GEMINI.md

## Project Overview

This project is a browser-based recreation of the classic Mac game "Daleks". It's a turn-based strategy game where the player must survive hostile robots by maneuvering them into collisions with each other.

The application is a full-stack TypeScript project with a React frontend and a Node.js (Express) backend.

- **Frontend:** The client-side is built with React and TypeScript. It uses Zustand for state management and Tailwind CSS for styling. The game's UI is composed of several React components for the main menu, game board, and status bar.
- **Backend:** The server is a Node.js application using the Express framework. It serves the frontend and provides an API for game-related data.
- **Database:** The project uses a PostgreSQL database with the Drizzle ORM for data persistence. The database schema is defined in the `shared/schema.ts` file.
- **Build Tool:** Vite is used as the build tool for the frontend, configured in `vite.config.ts`.

## Building and Running

### Setup

To get started with the project, first install the necessary dependencies. Navigate to the project's root directory and run:

```bash
npm install
```

This will install all required Node.js packages. `npm` automatically installs packages into a `node_modules` directory within the project root, ensuring that these packages are isolated and do not conflict with dependencies of other projects on your system.

### Development

To run the application in development mode, use the following command:

```bash
npm run dev
```

This command starts the Express server and the Vite development server, which will automatically reload the application when changes are made.

### Production

To build the application for production, use the following command:

```bash
npm run build
```

This command builds the frontend and backend into the `dist` directory.

To start the application in production mode, use the following command:

```bash
npm run start
```

### Database

The project uses Drizzle ORM to manage the database schema. To push schema changes to the database, use the following command:

```bash
npm run db:push
```

### Type Checking

To check for TypeScript errors, run the following command:

```bash
npm run check
```

## Development Conventions

- The project follows a monorepo-like structure with `client`, `server`, and `shared` directories.
- Code in the `shared` directory is intended to be used by both the client and the server.
- The frontend is located in the `client` directory and the backend in the `server` directory.
- State management on the frontend is handled by Zustand.
- The database schema is defined using Drizzle ORM in the `shared/schema.ts` file.

## Constraints

- Never push code to github
- Do not read or write any files outside of this directory
