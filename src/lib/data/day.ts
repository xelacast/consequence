import { auth, redirectToSignIn } from "@clerk/nextjs";
import { db } from "~/server/db";
import { currentDay } from "~/lib/dates";
import { redirect } from "next/navigation";

export async function readDayData(date: string, editing = false) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    redirectToSignIn();
  }

  const { startOfDay, endOfDay } = currentDay(date);

  try {
    const data = await db.day.findFirstOrThrow({
      where: {
        user: { clerk_id: userId },
        date: { gte: startOfDay, lt: endOfDay },
      },
      select: {
        date: true,
        id: true,
        sleep: {
          select: {
            id: true,
            hours: true,
            quality: true,
            notes: true,
            rating: true,
          },
        },
        exercise: {
          select: {
            id: true,
            type: true,
            duration: true,
            time_of_day: true,
            intensity: true,
            fasted: true,
          },
        },
        supplements: {
          select: {
            id: true,
            name: true,
            amount: true,
            // time_of_day_taken: true,
            time_taken: true,
            measurement: true,
          },
        },
        health: {
          select: {
            id: true,
            notes: true,
            mental_health: true,
            physical_health: true,
            energy_levels: true,
            mental_health_description: true,
            physical_health_description: true,
            // weight: true,
            // date: true,
          },
        },
        form_misc: true,
        stress: {
          select: {
            id: true,
            rating: true,
            time_of_day: true,
            symptoms: true,
            notes: true,
          },
        },
      },
    });
    return {
      day: { id: data.id, date: date },
      sleep: data.sleep,
      exercise: data.exercise,
      supplements: data.supplements,
      health: data.health,
      form_misc: data.form_misc,
      stress: data.stress,
    };
  } catch (error) {
    // read data for editing purposes. If no day then redirect to a create page. This creates a dependency but is it cutting corners?
    if (editing) {
      redirect(`/dashboard/day/${date}`);
    }
    return {
      day: { id: "", date: date },
      sleep: undefined,
      exercise: [],
      supplements: [],
      health: [],
      form_misc: undefined,
      stress: [],
    };
  }
}
