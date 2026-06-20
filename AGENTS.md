# AGENTS.md

## Project Name

FitRoutine Local

## Project Goal

This is a small local fullstack learning project. The goal is to build a mobile-first web app for creating, saving, editing, and executing workout routines.

The project should help the developer practice:

* React frontend development
* Node.js backend development
* REST API communication
* Local persistence with SQLite
* Basic fullstack architecture
* Mobile-first UI
* CRUD operations
* Clean project structure

This project is intentionally local-only. It should not require paid services, deployment, cloud infrastructure, authentication providers, or external databases.

## Current Project Structure

```txt
fitroutine-local/
  back/
  front/
  docs/
  AGENTS.md
```

## Tech Stack

### Backend

* Node.js
* Express
* TypeScript
* Prisma
* SQLite

### Frontend

* React
* Vite
* TypeScript
* React Router
* Tailwind CSS or simple CSS modules
* Fetch API for HTTP calls

## Local Development Ports

The expected local ports are:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:3000
API base: http://localhost:3000/api
```

When testing from a mobile device in the same WiFi network, the frontend should be opened using the laptop's local IP:

```txt
http://<LOCAL_IP>:5173
```

The frontend must call the backend using:

```txt
http://<LOCAL_IP>:3000/api
```

or an environment variable such as:

```txt
VITE_API_URL=http://<LOCAL_IP>:3000/api
```

## Important Local Behavior

The app is local, but the data should persist.

The browser does not own the database. The database lives in the backend as a SQLite file.

Expected flow:

```txt
Mobile browser or desktop browser
  -> React frontend
  -> Express backend
  -> SQLite database file
```

If the user creates a routine from the phone while connected to the laptop server, the routine should be saved in the laptop's local SQLite database.

## Development Philosophy

Keep the project small and clear.

Do not add the following unless explicitly requested:

* Login
* Payments
* Cloud deployment
* Firebase
* Supabase
* AWS
* Docker
* Push notifications
* Social features
* AI-generated workouts
* Complex analytics
* Complex calendar logic

The MVP should focus on:

* Exercise list
* Routine creation
* Adding exercises to routines
* Editing sets, reps, weight, rest time, and notes
* Starting a workout session
* Marking sets as completed
* Saving workout history

## Backend Coding Guidelines

Use a layered backend structure:

```txt
routes -> controllers -> services -> database
```

Responsibilities:

* Routes define URL paths and HTTP methods.
* Controllers handle request and response.
* Services contain business logic.
* Prisma handles database access.

Avoid putting all logic directly inside route files.

Use TypeScript types wherever possible.

Return JSON from all API endpoints.

Use consistent error responses.

Example error response:

```json
{
  "error": "Routine not found"
}
```

Example success response:

```json
{
  "data": {}
}
```

## Frontend Coding Guidelines

The frontend should be mobile-first.

Prioritize:

* Simple screens
* Reusable components
* Clear loading states
* Clear error states
* Empty states
* Forms with validation
* Readable code

Suggested frontend folders:

```txt
src/
  api/
  components/
  pages/
  hooks/
  types/
```

The frontend should not directly access the database. It must communicate with the backend through HTTP requests.

## API Communication Rule

The frontend should use a central API client or shared API URL.

Example:

```ts
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
```

Avoid hardcoding API URLs in every component.

Good:

```ts
fetch(`${API_URL}/routines`);
```

Bad:

```ts
fetch("http://localhost:3000/api/routines");
```

## MVP Entities

The initial entities are:

* Exercise
* Routine
* RoutineExercise
* WorkoutSession
* WorkoutSet

The first backend milestone should only implement:

* Exercise
* Routine
* RoutineExercise

Workout sessions and history can be added later.

## Current Backend Status

The backend starts with Express and TypeScript.

The first health endpoint should be:

```txt
GET /api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "FitRoutine API is running"
}
```

## When Generating Code

When generating code for this project:

1. Keep it beginner-friendly.
2. Explain where each file goes.
3. Avoid overengineering.
4. Prefer simple REST endpoints.
5. Keep backend and frontend separated.
6. Make sure local development still works.
7. Do not assume deployment.
8. Do not introduce paid services.
9. Do not add authentication unless requested.
10. Keep all data local through SQLite.
