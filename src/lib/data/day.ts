import { auth } from "@clerk/nextjs";
import { db } from "~/server/db";
import { currentDay } from "~/lib/misc/dates";
import { redirect } from "next/navigation";

/**
 *
 * @param date
 * @returns data from the day of creation
 */
export async function readDayData(date: string) {
  const { userId } = auth().protect();
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
            amount: true,
            time_taken: true,
            measurement: true,
            supplement: {
              select: {
                name: true,
                brand_name: true,
                serving_size: true,
                serving_size_unit: true,
                description: true,
                ingredients: true,
              },
            },
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
      id: data.id,
      date: data.date,
      sleep: data.sleep,
      exercise: data.exercise,
      supplements: data.supplements,
      // quick fix for health being a many to many relationship
      health: data.health,
      stress: data.stress,
      form_misc: data.form_misc,
    };
  } catch (error) {
    // read data for editing purposes. If no day then redirect to a create page. This creates a dependency but is it cutting corners?
    return {
      id: undefined,
      date: date,
      sleep: undefined,
      exercise: [],
      supplements: [],
      health: undefined,
      form_misc: undefined,
      stress: undefined,
    };
  }
}

export const readDayDataForEdit = async (date: string) => {
  const { userId } = auth().protect();

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
            amount: true,
            time_taken: true,
            measurement: true,
            supplement: {
              select: {
                id: true,
                name: true,
                brand_name: true,
                serving_size: true,
                serving_size_unit: true,
                description: true,
                ingredients: true,
              },
            },
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

    /**
     * in order to have an editable form Health, Sleep, and Stress must be present. This is a quick fix for now
     * */
    return {
      id: data.id,
      date: data.date,
      sleep: data.sleep!,
      exercise: data.exercise,
      supplements: data.supplements,
      // quick fix for health and stress being a many to many relationship
      health: data.health[0]!,
      stress: data.stress[0]!,
      form_misc: data.form_misc!,
    };
  } catch (error) {
    // read data for editing purposes. If no day then redirect to a create page. This creates a dependency but is it cutting corners?
    redirect(`/dashboard/day/${date}`);
  }
};
