-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "muscleGroup" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "isTimed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Exercise" ("category", "createdAt", "description", "equipment", "id", "muscleGroup", "name", "videoUrl") SELECT "category", "createdAt", "description", "equipment", "id", "muscleGroup", "name", "videoUrl" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE TABLE "new_RoutineExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routineId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "repsList" TEXT,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "weight" REAL,
    "restSeconds" INTEGER NOT NULL,
    "restBetweenSeconds" INTEGER NOT NULL DEFAULT 60,
    "order" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "RoutineExercise_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoutineExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RoutineExercise" ("exerciseId", "id", "notes", "order", "reps", "restBetweenSeconds", "restSeconds", "routineId", "sets", "weight") SELECT "exerciseId", "id", "notes", "order", "reps", "restBetweenSeconds", "restSeconds", "routineId", "sets", "weight" FROM "RoutineExercise";
DROP TABLE "RoutineExercise";
ALTER TABLE "new_RoutineExercise" RENAME TO "RoutineExercise";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
