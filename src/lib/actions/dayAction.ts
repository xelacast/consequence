"use server";

import { currentUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  healthSchema,
  miscSchema,
  sleepSchema,
  stressSchema,
  updateSchema,
} from "~/lib/schemas/day";
import { db } from "~/server/db";
import { exerciseSchema } from "~/lib/schemas/day";
import { type day } from "@prisma/client";
import { currentDate } from "../misc/dates";
import { supplementsSchema } from "../schemas/supplement";

const createDaySchema = z.object({
  stress: stressSchema,
  exercise: exerciseSchema
    .omit({ time_of_day_string: true, toggle: true })
    .optional(),
  date: z.string().optional(),
  id: z.string().optional(),
  health: healthSchema,
  sleep: sleepSchema,
  supplements: supplementsSchema.optional(),
  misc: miscSchema,
});

export const createDayAction = async (
  formData: z.infer<typeof createDaySchema>,
) => {
  const validatedFields = createDaySchema.safeParse(formData);

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };

  const data = validatedFields.data;

  const date = currentDate(data.date);

  // verify user
  const user = await currentUser();
  if (!user) return { error: "error", status: 403, message: "Unauthorized" };

  const { id } = user;

  // stress, health, and sleep are required fields. All other form fields are optional
  try {
    // create day with required fields
    await db.day.create({
      data: {
        user: { connect: { clerk_id: id } },
        date: date,
        sleep: { create: data.sleep },
        stress: { create: data.stress },
        health: { create: { ...data.health, time: dayjs().toDate() } },
        exercise: { create: data.exercise },
        supplements: {
          createMany: {
            data: data?.supplements?.input
              ? data.supplements.input.map(
                  ({ supplement, consumed_amount, consumed_unit, time }) => ({
                    amount: consumed_amount,
                    measurement: consumed_unit,
                    time_taken: time, // needs to be converted to datetime
                    supplement_id: supplement.id,
                  }),
                )
              : [],
          },
        },
        form_misc: { create: data.misc },
      },
    });
  } catch (err) {
    console.log(err);
    return { error: "error", status: 500, message: "Could Not Create Day" };
  }

  revalidatePath(`/dashboard/day/${formData.date}`);
  redirect(`/dashboard/day/${formData.date}`);
};

/**
 *
 * @param formData
 * @param date string in YYYY-MM-DD
 * @returns response of success message
 */
export async function editDayAction(
  formData: z.infer<typeof updateSchema>,
  date: string,
) {
  // data verification
  const validatedFields = updateSchema.safeParse(formData);

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };

  const data = validatedFields.data;

  const user = await currentUser();
  if (!user) return { error: "error", status: 403, message: "Unauthorized" };

  const { id } = user; // clerk_user_id

  let day: day;
  try {
    // user authentication for the day
    day = await db.day.findFirstOrThrow({
      where: {
        id: data.id,
        user: { clerk_id: id },
      },
    });

    await db.day.update({
      where: { id: day.id },
      data: {
        sleep: { update: data.sleep },
        stress: {
          update: { where: { id: data.stress.id }, data: data.stress },
        },
        health: {
          update: { where: { id: data.health.id }, data: data.health },
        },
        form_misc: { update: data.misc },
        // I want both Id's in here but the way I have the schema setup makes this difficult
      },
    });
  } catch (err) {
    return { error: "error", status: 500, message: "Internal Server Error" };
  }

  const supplements = await db.supplements.findMany({
    where: { day_id: day.id },
  });

  // for deletion purposes only
  const supplementIds = supplements.map((s) => s.id);
  // make a list of supplements that are not in the update
  // easy edge case is if theres supplements in the data pull but none in the update
  const incomingSupplementIds = data.supplements
    .map((s) => (typeof s.id === "string" ? s.id : ""))
    .filter((s) => s !== "");

  const supplementToDelete = findUniqueValues(
    supplementIds,
    incomingSupplementIds,
  );

  // when new supplements come in their id is unregistered so we know how to target them
  const supplementsToCreate = data.supplements.filter((s) => !s.id);

  // create if any new supplements are added
  try {
    await db.supplements.createMany({
      data: supplementsToCreate.map((supp) => ({
        amount: supp.consumed_amount,
        measurement: supp.consumed_unit,
        time_taken: supp.time,
        supplement_id: supp.consumed_supplement_id,
        day_id: day.id,
      })),
    });
  } catch (err) {
    return {
      error: "error",
      status: 500,
      message: "Could not create supplements",
    };
  }

  // delete supplements
  try {
    await db.supplements.deleteMany({
      where: { id: { in: supplementToDelete } },
    });
  } catch (err) {
    return {
      error: "error",
      status: 500,
      message: "Could not delete supplements",
    };
  }

  revalidatePath(`/dashboard/day/${date}`);
  redirect(`/dashboard/day/${date}`);
}

function findUniqueValues(arr1: string[], arr2: string[]) {
  const set2 = new Set(arr2);
  const uniqueValues = arr1.filter((value) => !set2.has(value));
  return uniqueValues;
}
