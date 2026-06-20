import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

const exercises = [
      {
        name: "Seated Dumbbell Overhead Press",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Seated Dumbbell Overhead Press, Single Arm",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Standing Dumbbell Overhead Press",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Seated Dumbbell Overhead Press, Neutral Grip",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Standing Dumbbell Overhead Press, Single Arm",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Seated Dumbbell Overhead Press, Neutral Grip, Single Arm",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Standing Dumbbell Overhead Press, Neutral Grip",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Standing Dumbbell Overhead Press, Neutral Grip, Single Arm",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Dumbbell Upright Row",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Standing Dumbbell Lateral Raise",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Standing Dumbbell Front Raise",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Shoulder strength exercise.",
      },
      {
        name: "Dumbbell Floor Press",
        category: "strength",
        muscleGroup: "chest",
        equipment: "dumbbell",
        description: "Chest strength exercise.",
      },
      {
        name: "Dumbbell Floor Press, Neutral Grip",
        category: "strength",
        muscleGroup: "chest",
        equipment: "dumbbell",
        description: "Chest strength exercise.",
      },
      {
        name: "Push Up",
        category: "strength",
        muscleGroup: "chest",
        equipment: "bodyweight",
        description: "Bodyweight exercise for chest, shoulders, and triceps.",
      },
      {
        name: "Push Up, Close Grip",
        category: "strength",
        muscleGroup: "chest",
        equipment: "bodyweight",
        description: "Bodyweight exercise for chest, shoulders, and triceps.",
      },
      {
        name: "Standing Dumbbell Curl",
        category: "strength",
        muscleGroup: "biceps",
        equipment: "dumbbell",
        description: "Biceps strength exercise.",
      },
      {
        name: "Seated Dumbbell Curl",
        category: "strength",
        muscleGroup: "biceps",
        equipment: "dumbbell",
        description: "Biceps strength exercise.",
      },
      {
        name: "Standing Dumbbell Curl, Alternating",
        category: "strength",
        muscleGroup: "biceps",
        equipment: "dumbbell",
        description: "Biceps strength exercise.",
      },
      {
        name: "Standing Dumbbell Hammer Curl",
        category: "strength",
        muscleGroup: "biceps",
        equipment: "dumbbell",
        description: "Biceps strength exercise.",
      },
      {
        name: "Concentration Curl",
        category: "strength",
        muscleGroup: "biceps",
        equipment: "dumbbell",
        description: "Biceps strength exercise.",
      },
      {
        name: "Standing Dumbbell Wrist Curl",
        category: "strength",
        muscleGroup: "forearm",
        equipment: "dumbbell",
        description: "Forearm strength exercise.",
      },
      {
        name: "Standing Dumbbell Shrugs",
        category: "strength",
        muscleGroup: "traps",
        equipment: "dumbbell",
        description: "Traps strength exercise.",
      },
      {
        name: "Seated Dumbbell Overhead Tricep Extensions",
        category: "strength",
        muscleGroup: "triceps",
        equipment: "dumbbell",
        description: "Triceps strength exercise.",
      },
      {
        name: "Seated Dumbbell Overhead Tricep Extensions, Single Hand",
        category: "strength",
        muscleGroup: "triceps",
        equipment: "dumbbell",
        description: "Triceps strength exercise.",
      },
      {
        name: "Standing Dumbbell Overhead Tricep Extensions",
        category: "strength",
        muscleGroup: "triceps",
        equipment: "dumbbell",
        description: "Triceps strength exercise.",
      },
      {
        name: "Standing Dumbbell Overhead Tricep Extensions, Single Hand",
        category: "strength",
        muscleGroup: "triceps",
        equipment: "dumbbell",
        description: "Triceps strength exercise.",
      },
      {
        name: "Bent over Dumbbell Row, Overhead Grip",
        category: "strength",
        muscleGroup: "back",
        equipment: "dumbbell",
        description: "Back strength exercise.",
      },
      {
        name: "Bent over Dumbbell Row, Neutral Grip",
        category: "strength",
        muscleGroup: "back",
        equipment: "dumbbell",
        description: "Back strength exercise.",
      }
];

async function main() {
  for (const exercise of exercises) {
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        name: exercise.name,
      },
    });

    if (existingExercise) {
      await prisma.exercise.update({
        where: {
          id: existingExercise.id,
        },
        data: exercise,
      });

      continue;
    }

    await prisma.exercise.create({
      data: exercise,
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });