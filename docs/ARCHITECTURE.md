# docs/ARCHITECTURE.md

# FitRoutine Local Architecture

## General Description

FitRoutine Local is a mobile-first fullstack web application for creating and tracking workout routines.

The user can create custom routines by selecting exercises, configuring sets, repetitions, weight, rest time, and notes. Later, the user can start a workout session and mark exercises or sets as completed.

The project is designed to run completely locally with no external cost.

## High-Level Architecture

```txt
React Frontend
  |
  | HTTP requests
  v
Express Backend
  |
  | Prisma ORM
  v
SQLite Database
```

## Runtime Architecture

During development, the project runs as two separate local servers:

```txt
Frontend server:
http://localhost:5173

Backend server:
http://localhost:3000
```

The frontend does not connect directly to the database. It only communicates with the backend using REST API calls.

The backend owns the database connection and all persistence logic.

## Local Network Usage

The project should support testing from a mobile device connected to the same WiFi network.

Example:

```txt
Laptop local IP: 192.168.1.75

Frontend:
http://192.168.1.75:5173

Backend:
http://192.168.1.75:3000/api
```

The phone is only a client. The actual backend and SQLite database still run on the laptop.

## Backend Structure

Recommended backend structure:

```txt
back/
  src/
    controllers/
      exercise.controller.ts
      routine.controller.ts
      workout.controller.ts

    routes/
      exercise.routes.ts
      routine.routes.ts
      workout.routes.ts

    services/
      exercise.service.ts
      routine.service.ts
      workout.service.ts

    db/
      prisma.ts

    app.ts
    server.ts

  prisma/
    schema.prisma
    seed.ts
    dev.db

  .env
  package.json
  tsconfig.json
```

## Backend Layer Responsibilities

### routes

Route files define HTTP paths and connect them to controllers.

Example:

```txt
GET /api/routines
POST /api/routines
GET /api/routines/:id
```

### controllers

Controller files receive `req` and `res`.

They should:

* Read params
* Read query values
* Read body data
* Call services
* Return JSON responses

Controllers should not contain database logic.

### services

Service files contain business logic.

They should:

* Validate business rules
* Call Prisma
* Prepare returned data
* Throw or return domain errors

### db

The `db` folder contains the Prisma client instance.

Example:

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

## Frontend Structure

Recommended frontend structure:

```txt
front/
  src/
    api/
      client.ts
      exercisesApi.ts
      routinesApi.ts
      workoutApi.ts

    components/
      Button.tsx
      Card.tsx
      Input.tsx
      BottomNav.tsx
      ExerciseCard.tsx
      RoutineCard.tsx

    pages/
      HomePage.tsx
      RoutinesPage.tsx
      RoutineDetailPage.tsx
      CreateRoutinePage.tsx
      WorkoutPage.tsx
      HistoryPage.tsx

    hooks/
      useRoutines.ts
      useExercises.ts
      useWorkoutSession.ts

    types/
      exercise.ts
      routine.ts
      workout.ts

    App.tsx
    main.tsx
```

## Frontend Layer Responsibilities

### api

Contains all HTTP calls to the backend.

React components should not build API URLs manually.

### components

Reusable UI pieces.

Examples:

* Button
* Card
* Input
* RoutineCard
* ExerciseCard

### pages

Screen-level components.

Examples:

* HomePage
* RoutinesPage
* RoutineDetailPage
* WorkoutPage

### hooks

Reusable logic for fetching data or managing UI state.

Examples:

* useRoutines
* useExercises

### types

Shared frontend TypeScript types that represent API data.

## Data Model Overview

### Exercise

Represents an exercise that can be added to a routine.

Fields:

```txt
id
name
category
muscleGroup
equipment
description
createdAt
```

### Routine

Represents a user-created workout routine.

Fields:

```txt
id
name
description
createdAt
updatedAt
```

### RoutineExercise

Represents an exercise inside a specific routine.

Fields:

```txt
id
routineId
exerciseId
sets
reps
weight
restSeconds
order
notes
```

This entity is necessary because the same exercise can appear in different routines with different sets, reps, weight, rest time, or notes.

### WorkoutSession

Represents a workout session started from a routine.

Fields:

```txt
id
routineId
startedAt
finishedAt
status
```

Possible status values:

```txt
IN_PROGRESS
COMPLETED
CANCELLED
```

### WorkoutSet

Represents the actual performance of a set during a workout session.

Fields:

```txt
id
sessionId
exerciseId
setNumber
reps
weight
completed
```

## MVP Phases

### Phase 1: Routine Builder

Implement:

* Exercise list
* Routine CRUD
* Add exercises to routines
* Edit routine exercise data
* Delete exercises from routines

Entities:

* Exercise
* Routine
* RoutineExercise

### Phase 2: Active Workout

Implement:

* Start workout session
* Display routine exercise by exercise
* Mark sets as completed
* Finish workout

Entities:

* WorkoutSession
* WorkoutSet

### Phase 3: Simple History

Implement:

* Workout history
* Last completed routine
* Previous weights and reps
* Total completed sessions

## Main Design Decisions

### Why SQLite?

SQLite is used because the project must be local, free, and simple.

It stores data in a local file and does not require a database server.

### Why Prisma?

Prisma provides a clean way to define models, run migrations, and query the database from TypeScript.

### Why Express?

Express is simple and flexible. It is enough for a small REST API.

### Why no authentication?

Authentication is intentionally excluded from the MVP because the project is local-only and focused on fullstack fundamentals.

### Why no deployment?

Deployment is intentionally excluded because the goal is to avoid cost and keep the project local.
