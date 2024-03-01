"use server";

import { db } from "~/server/db";
import { journalSchema } from "../schemas/journal";
import type { z } from "zod";
import { currentDate } from "../dates";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

export async function createJournalAction(
  values: z.infer<typeof journalSchema>,
) {
  const { userId } = auth().protect();

  const validatedFields = journalSchema.safeParse(values);

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };

  const { content, date, title } = validatedFields.data;

  const entryDate = currentDate(date);

  let entry_id: string;
  try {
    const { id } = await db.journal.create({
      data: {
        content: content,
        user_id: userId,
        date: entryDate,
        title,
      },
    });
    entry_id = id;
  } catch (error) {
    console.error(error);
    return { message: "Error creating journal entry", error: error };
  }

  revalidatePath("/journal");
  return { message: "Journal Entry Created", error: null, id: entry_id };
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
