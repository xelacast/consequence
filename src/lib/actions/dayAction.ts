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
  supplementSchema,
} from "~/components/forms/day/schema";
import { db } from "~/server/db";
import { exerciseSchema } from "~/components/forms/day/schema";
import type { day } from "@prisma/client";
import { currentDate } from "../dates";

const createDaySchema = z.object({
  stress: stressSchema.omit({ time_of_day_string: true }),
  exercise: exerciseSchema
    .omit({ time_of_day_string: true, toggle: true })
    .optional(),
  date: z.string().optional(),
  id: z.string().optional(),
  health: healthSchema,
  sleep: sleepSchema,
  supplements: supplementSchema
    .omit({
      amount: true,
      measurement: true,
      name: true,
      time_taken_string: true,
      toggle: true,
    })
    .optional(),
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
    // find a day. If the day has the same date, update the day
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
            data: data.supplements?.supplements.map((s) => s) ?? [],
          },
        },
        form_misc: { create: data.misc },
      },
    });
  } catch (err) {
    console.log(err);
    return { error: "error", status: 500, message: "Could Not Create Day" };
  }

  // optional fields if present
  // try {
  //   if (data.supplements && data.supplements.supplements.length > 0) {
  //     await createSupplements(data.supplements, day.id);
  //   }
  //   if (data.exercise) {
  //     await createExercise(data.exercise, day.id);
  //   }
  // } catch (err) {
  //   return { error: "error", status: 500, message: "Internal Server Error" };
  // }

  revalidatePath(`/dashboard/day/${formData.date}`);
  redirect(`/dashboard/day/${formData.date}`);
};

const updateSupps = supplementSchema
  .omit({
    amount: true,
    measurement: true,
    name: true,
    time_taken: true,
    toggle: true,
  })
  .optional();

const updateSchema = z.object({
  id: z.string(),
  supplement: updateSupps,
  exercise: exerciseSchema.optional(),
  sleep: sleepSchema,
  health: healthSchema,
  stress: stressSchema,
  misc: miscSchema,
});

/**
 *
 * @param formData
 * @param date string in YYYY-MM-DD for redirect and recache
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
  console.log(data);
  // errors incase updates fail
  // const errors: { message: string }[] = [];

  const { clerk_user_id } = await authenticate();

  let day: day;
  try {
    // user authentication for the day
    day = await db.day.findFirstOrThrow({
      where: {
        id: data.id,
        user: { clerk_id: clerk_user_id },
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
        supplements: {
          updateMany: data?.supplement?.supplements.map((supp) => {
            return {
              where: { id: supp.id },
              data: supp,
            };
          }),
        },
      },
    });
  } catch (err) {
    return { error: "error", status: 500, message: "Internal Server Error" };
  }
  revalidatePath(`/dashboard/day/${date}`);
  redirect(`/dashboard/day/${date}`);
}

// this is not proper authentication
export async function authenticate() {
  const user = await currentUser();
  if (!user) return { error: "error", status: 403, message: "Unothorized" };

  const { id } = user;
  return { clerk_user_id: id };
}
