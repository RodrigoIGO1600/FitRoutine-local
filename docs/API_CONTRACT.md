# docs/API_CONTRACT.md

# FitRoutine Local API Contract

## API Base URL

Local desktop development:

```txt
http://localhost:3000/api
```

Local mobile testing from the same WiFi:

```txt
http://<LOCAL_IP>:3000/api
```

Example:

```txt
http://192.168.1.75:3000/api
```

## Response Format

Prefer consistent JSON responses.

Success response:

```json
{
  "data": {}
}
```

List response:

```json
{
  "data": []
}
```

Error response:

```json
{
  "error": "Message describing the error"
}
```

## Health Endpoint

### GET /health

Used to confirm that the backend is running.

Response:

```json
{
  "status": "ok",
  "message": "FitRoutine API is running"
}
```

Full URL:

```txt
GET /api/health
```

## Exercises

### GET /exercises

Returns all available exercises.

Full URL:

```txt
GET /api/exercises
```

Optional filters:

```txt
GET /api/exercises?muscleGroup=chest
GET /api/exercises?equipment=bodyweight
GET /api/exercises?category=strength
```

Example response:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Push Up",
      "category": "strength",
      "muscleGroup": "chest",
      "equipment": "bodyweight",
      "description": "Bodyweight chest exercise.",
      "createdAt": "2026-06-19T00:00:00.000Z"
    }
  ]
}
```

### POST /exercises

Creates a custom exercise.

Full URL:

```txt
POST /api/exercises
```

Request body:

```json
{
  "name": "Incline Push Up",
  "category": "strength",
  "muscleGroup": "chest",
  "equipment": "bodyweight",
  "description": "Push up variation using an elevated surface."
}
```

Example response:

```json
{
  "data": {
    "id": 2,
    "name": "Incline Push Up",
    "category": "strength",
    "muscleGroup": "chest",
    "equipment": "bodyweight",
    "description": "Push up variation using an elevated surface.",
    "createdAt": "2026-06-19T00:00:00.000Z"
  }
}
```

## Routines

### GET /routines

Returns all routines.

Full URL:

```txt
GET /api/routines
```

Example response:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Push Day",
      "description": "Chest, shoulders, and triceps.",
      "createdAt": "2026-06-19T00:00:00.000Z",
      "updatedAt": "2026-06-19T00:00:00.000Z"
    }
  ]
}
```

### POST /routines

Creates a routine.

Full URL:

```txt
POST /api/routines
```

Request body:

```json
{
  "name": "Push Day",
  "description": "Chest, shoulders, and triceps."
}
```

Example response:

```json
{
  "data": {
    "id": 1,
    "name": "Push Day",
    "description": "Chest, shoulders, and triceps.",
    "createdAt": "2026-06-19T00:00:00.000Z",
    "updatedAt": "2026-06-19T00:00:00.000Z"
  }
}
```

### GET /routines/:id

Returns one routine with its exercises.

Full URL:

```txt
GET /api/routines/:id
```

Example response:

```json
{
  "data": {
    "id": 1,
    "name": "Push Day",
    "description": "Chest, shoulders, and triceps.",
    "createdAt": "2026-06-19T00:00:00.000Z",
    "updatedAt": "2026-06-19T00:00:00.000Z",
    "exercises": [
      {
        "id": 1,
        "routineId": 1,
        "exerciseId": 1,
        "sets": 4,
        "reps": 10,
        "weight": 40,
        "restSeconds": 90,
        "order": 1,
        "notes": "Controlled movement.",
        "exercise": {
          "id": 1,
          "name": "Bench Press",
          "category": "strength",
          "muscleGroup": "chest",
          "equipment": "barbell",
          "description": "Compound chest movement."
        }
      }
    ]
  }
}
```

### PUT /routines/:id

Updates a routine.

Full URL:

```txt
PUT /api/routines/:id
```

Request body:

```json
{
  "name": "Updated Push Day",
  "description": "Updated description."
}
```

Example response:

```json
{
  "data": {
    "id": 1,
    "name": "Updated Push Day",
    "description": "Updated description.",
    "createdAt": "2026-06-19T00:00:00.000Z",
    "updatedAt": "2026-06-19T00:10:00.000Z"
  }
}
```

### DELETE /routines/:id

Deletes a routine.

Full URL:

```txt
DELETE /api/routines/:id
```

Example response:

```json
{
  "data": {
    "deleted": true
  }
}
```

## Routine Exercises

### POST /routines/:id/exercises

Adds an exercise to a routine.

Full URL:

```txt
POST /api/routines/:id/exercises
```

Request body:

```json
{
  "exerciseId": 1,
  "sets": 4,
  "reps": 10,
  "weight": 40,
  "restSeconds": 90,
  "order": 1,
  "notes": "Controlled movement."
}
```

Example response:

```json
{
  "data": {
    "id": 1,
    "routineId": 1,
    "exerciseId": 1,
    "sets": 4,
    "reps": 10,
    "weight": 40,
    "restSeconds": 90,
    "order": 1,
    "notes": "Controlled movement."
  }
}
```

### PUT /routine-exercises/:id

Updates an exercise inside a routine.

Full URL:

```txt
PUT /api/routine-exercises/:id
```

Request body:

```json
{
  "sets": 5,
  "reps": 8,
  "weight": 45,
  "restSeconds": 120,
  "order": 1,
  "notes": "Increase weight next time."
}
```

Example response:

```json
{
  "data": {
    "id": 1,
    "routineId": 1,
    "exerciseId": 1,
    "sets": 5,
    "reps": 8,
    "weight": 45,
    "restSeconds": 120,
    "order": 1,
    "notes": "Increase weight next time."
  }
}
```

### DELETE /routine-exercises/:id

Removes an exercise from a routine.

Full URL:

```txt
DELETE /api/routine-exercises/:id
```

Example response:

```json
{
  "data": {
    "deleted": true
  }
}
```

## Workout Sessions

These endpoints are planned for Phase 2.

### POST /workout-sessions

Starts a workout session from a routine.

Full URL:

```txt
POST /api/workout-sessions
```

Request body:

```json
{
  "routineId": 1
}
```

Example response:

```json
{
  "data": {
    "id": 1,
    "routineId": 1,
    "startedAt": "2026-06-19T00:00:00.000Z",
    "finishedAt": null,
    "status": "IN_PROGRESS"
  }
}
```

### GET /workout-sessions/:id

Returns one workout session with its sets.

Full URL:

```txt
GET /api/workout-sessions/:id
```

### PUT /workout-sessions/:id/finish

Finishes a workout session.

Full URL:

```txt
PUT /api/workout-sessions/:id/finish
```

Example response:

```json
{
  "data": {
    "id": 1,
    "routineId": 1,
    "startedAt": "2026-06-19T00:00:00.000Z",
    "finishedAt": "2026-06-19T00:45:00.000Z",
    "status": "COMPLETED"
  }
}
```

## Frontend API Client Guideline

The frontend should define the API base URL once.

Example:

```ts
export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
```

Example request:

```ts
export async function getRoutines() {
  const response = await fetch(`${API_URL}/routines`);

  if (!response.ok) {
    throw new Error("Failed to fetch routines");
  }

  const result = await response.json();
  return result.data;
}
```

The frontend should not call Prisma, SQLite, or backend services directly.
