-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routineId" TEXT,
    "routineName" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "totalSets" INTEGER NOT NULL,
    "totalReps" INTEGER NOT NULL,
    "totalVolume" REAL NOT NULL DEFAULT 0,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkoutSession_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
