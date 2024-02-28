"use server";

import { db } from "~/server/db";
import { journalSchema } from "../schemas/journal";
import { authenticate } from "./dayAction";
import type { z } from "zod";
import { currentDate, currentDay } from "../dates";
import { revalidatePath } from "next/cache";

export async function createJournalAction(
  values: z.infer<typeof journalSchema>,
) {
  const { clerk_user_id } = await authenticate();

  const validatedFields = journalSchema.safeParse(values);

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };

  const { content, date, title } = validatedFields.data;

  const { startOfDay, endOfDay } = currentDay(date);

  const entryDate = currentDate(date);

  let day: { id: string } | null;
  day = await db.day.findFirst({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
      user: { clerk_id: clerk_user_id },
    },
    select: {
      id: true,
    },
  });

  if (day) {
    try {
      // this will throw if there is no day.
      // A huge dependency on the day existing how to handle this?
      await db.journal.create({
        data: {
          content: content,
          day_id: day.id,
          date: entryDate,
          title,
        },
      });
    } catch (error) {
      console.error(error);
      return { message: "Error creating journal entry", error: error };
    }
  } else {
    try {
      day = await db.day.create({
        data: {
          date: entryDate,
          user: { connect: { clerk_id: clerk_user_id } },
        },
      });

      await db.journal.create({
        data: {
          content: content,
          day_id: day.id,
          date: entryDate,
          title,
        },
      });
    } catch (err) {
      console.error(err);
      return { message: "Error creating journal entry", error: err };
    }
  }

  revalidatePath("/journal");
  return { message: "Journal Entry Created", error: null };
}

export const updateJournalAction = async (
  values: z.infer<typeof journalSchema>,
) => {
  const validatedFields = journalSchema.safeParse(values);

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };

  const { content, title, id } = validatedFields.data;
  console.log("id", id);
  try {
    await db.journal.update({
      where: { id },
      data: {
        content,
        title,
      },
    });
    return { message: "Journal Entry Updated", error: null };
  } catch (error) {
    console.error(error);
    return { message: "Error updating journal entry", error: error };
  }
  revalidatePath("/journal");
};
