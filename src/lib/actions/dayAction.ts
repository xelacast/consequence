"use server";

import { currentUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import {
  daySchema,
  type supplementSchema,
} from "~/components/forms/day/schema";
import { db } from "~/server/db";
import type { exerciseSchema } from "~/components/forms/day/schema";
import type { day } from "@prisma/client";

export const createDayAction = async (formData: z.infer<typeof daySchema>) => {
  const data = daySchema.parse(formData);
  data.date = dayjs(data.date).toISOString();

  // verify user
  const user = await currentUser();
  if (!user) return { error: "error", status: 403, message: "Unothorized" };

  const { id } = user;

  // stress, health, and sleep are required fields. All other form fields are optional
  let day: day;
  try {
    // find a day. If the day has the same date, update the day
    // create day with required fields
    day = await db.day.create({
      data: {
        user: { connect: { clerk_id: id } },
        date: data.date,
        sleep: { create: data.sleep },
        stress: { create: data.stress },
        health: { create: { ...data.health, time: dayjs().toDate() } },
        form_misc: { create: data.misc },
      },
    });
  } catch (err) {
    console.log(err);
    return { error: "error", status: 500, message: "Could Not Create Day" };
  }

  // optional fields if present
  try {
    if (data.supplements && data.supplements.supplements.length > 0) {
      await createSupplements(data.supplements, day.id);
    }
    if (data.exercise) {
      await createExercise(data.exercise, day.id);
    }
  } catch (err) {
    return { error: "error", status: 500, message: "Internal Server Error" };
  }

  revalidatePath(`/dashboard/day/${formData.date}`);
  redirect(`/dashboard/day/${formData.date}`);
};

const createExercise = async (
  exerciseData: z.infer<typeof exerciseSchema>,
  day_id: string,
) => {
  delete exerciseData.toggle;
  try {
    await db.exercise.create({
      data: {
        day: { connect: { id: day_id } },
        ...exerciseData,
      },
    });
  } catch (err) {
    return { error: "error", status: 500, message: "Internal Server Error" };
  }
};

const createSupplements = async (
  data: z.infer<typeof supplementSchema>,
  day_id: string,
) => {
  await db.supplements.createMany({
    data: data.supplements.map((supp) => {
      return {
        ...supp,
        day_id,
      };
    }),
  });
};
