# TaskTrackerPro

A modern, feature-rich task management application with robust user authentication and database persistence.

## Live URL

- [Open the deployed app on Render](https://dashboard.render.com)

## Features

- **User Authentication**: Secure login and registration system
- **Task Management**: Create, edit, complete, and delete tasks
- **Categories**: Organize tasks with color-coded categories
- **Labels**: Tag tasks with multiple labels for better organization
- **Advanced Filtering**: Filter by completion status, category, and labels
- **Flexible Sorting**: Sort tasks by deadline, title, or creation date
- **Deadlines**: Set dates and times with a custom DateTimePicker (dark-mode friendly)
- **Data Persistence**: All tasks stored in PostgreSQL database for reliable access
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: App-wide theme toggle on the home page; the auth page stays light

## Tech Stack

- **Frontend**: React.js with TypeScript
- **UI Components**: Shadcn UI (Radix UI + Tailwind CSS)
- **State Management**: React Query for server state, React Context for global state
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based auth with Passport.js
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (version 18.x or higher)
2. **PostgreSQL** (cloud service like Neon free tier recommended)
3. **Git**

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TaskTrackerPro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the project root with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@host:5432/database
   SESSION_SECRET=your_session_secret_here
   ```
   Replace the `DATABASE_URL` with your PostgreSQL connection string. For `SESSION_SECRET`, use a secure random string.

4. Create the database schema:
   ```bash
   npm run db:push
   ```

## Running Locally

Start the development server:
```bash
npm run dev
```

This starts both the Express backend and React frontend. Visit `http://localhost:5000`.

## Project Structure

```
├── client/                      # Frontend React application
│   ├── index.html
│   └── src/
│       ├── App.tsx             # Main application component
│       ├── main.tsx            # Frontend entry
│       ├── index.css           # Tailwind/theme tokens
│       ├── components/         # UI + feature components
│       │   └── ui/             # Shadcn UI primitives
│       ├── pages/              # Route components
│       ├── hooks/              # Custom React hooks
│       └── lib/                # Utilities (queryClient, etc.)
│
├── server/                      # Backend Express application
│   ├── auth.ts                  # Authentication logic
│   ├── db.ts                    # Database connection
│   ├── env.ts                   # Dotenv configuration
│   ├── index.ts                 # Server entry point
│   ├── routes.ts                # API routes
│   ├── storage.ts               # Database operations
│   └── vite.ts                  # Dev middleware / static serving
│
├── shared/                      # Shared code between client and server
│   └── schema.ts                # DB schema and types
│
├── drizzle.config.ts            # Drizzle ORM configuration
├── tailwind.config.ts           # Tailwind config (class-based dark mode)
├── postcss.config.js            # PostCSS config
├── vite.config.ts               # Vite config (client root, dist/public)
├── tsconfig.json                # TypeScript config
└── package.json                 # Project dependencies and scripts
```

## Database Schema

- **users**: User authentication data
- **categories**: Task categories with color coding
- **todos**: Task data including title, completion status, deadline, labels, etc.

## Deployment (Render – Single Service)

This project is configured to build the client and serve it with Express alongside the API on the same port.

Render setup
1. Push your repo to GitHub.
2. In Render, create a New Web Service from this repo.
3. Environment: Node.
4. Build command: `npm run build`
5. Start command: `npm start`
6. Environment variables:
   - `DATABASE_URL` = your Neon Postgres connection string
   - `SESSION_SECRET` = a long random string
7. Create the service. Render provides `PORT`; the server binds to it automatically.

Database schema
- After the first deploy, run the schema push once (via Render shell or locally with the same DATABASE_URL):
```bash
npm run db:push
```

Notes
- Client is built to `dist/public` and served by Express in production.
- Dark mode is applied globally on non-auth routes so dialogs/popovers follow the theme. The auth page stays light.

## Local Production Build

To create a production build for local deployment:

1. Build the app:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Security Considerations

- All user passwords are securely hashed using scrypt
- Session data is stored in PostgreSQL for persistence
- User data is isolated - users can only see their own data
- Input validation is performed on both client and server side
- CSRF protection is implemented for all API routes

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify your `DATABASE_URL` is correct
2. Ensure PostgreSQL is running
3. Check network connectivity to your database server
4. Verify database credentials

### Authentication Problems

If users can't log in:

1. Clear browser cookies and cache
2. Verify the PostgreSQL session store is configured correctly
3. Check the `SESSION_SECRET` environment variable
4. Ensure CORS settings are correctly configured

## Contact

For any questions or suggestions, please open an issue on the repository.