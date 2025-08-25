# Task Tracker Pro

A modern, feature-rich task management application with robust user authentication and database persistence.

![Todo List App Screenshot](https://example.com/screenshot.png)

## Features

- **User Authentication**: Secure login and registration system
- **Task Management**: Create, edit, complete, and delete tasks
- **Categories**: Organize tasks with color-coded categories
- **Labels**: Tag tasks with multiple labels for better organization
- **Advanced Filtering**: Filter by completion status, category, and labels
- **Flexible Sorting**: Sort tasks by deadline, title, or creation date
- **Deadlines**: Set dates and times for task completion with clear time format indicators
- **Data Persistence**: All tasks stored in PostgreSQL database for reliable access
- **Responsive Design**: Works on desktop, tablet, and mobile devices

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
2. **PostgreSQL** (local installation or cloud service like Neon)
3. **Git**

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-list-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the project root with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/todolist
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

This will start both the Express backend and React frontend. Visit `http://localhost:5000` in your browser to access the application.

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
│
├── server/               # Backend Express application
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database connection
|   ├── env.ts            # Dotenv configuration
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
│
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema and types
│
├── drizzle.config.ts     # Drizzle ORM configuration
└── package.json          # Project dependencies
```

## Database Schema

- **users**: User authentication data
- **categories**: Task categories with color coding
- **todos**: Task data including title, completion status, deadline, labels, etc.

## Deployment

### Option 2: Deploy to Heroku

1. Create a Heroku account and install the Heroku CLI
2. Log in to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   heroku create your-todo-app-name
   ```

4. Add a PostgreSQL database:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. Set the session secret:
   ```bash
   heroku config:set SESSION_SECRET=your_session_secret_here
   ```

6. Deploy your code:
   ```bash
   git push heroku main
   ```

7. Run database migrations:
   ```bash
   heroku run npm run db:push
   ```

## Local Production Build

To create a production build for local deployment:

1. Build the frontend:
   ```bash
   cd client
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