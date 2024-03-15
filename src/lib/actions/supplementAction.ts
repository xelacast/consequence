"use server";

import type { z } from "zod";
import { createSupplementSchema } from "../schemas/supplement";
import { currentUser } from "@clerk/nextjs";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

/**
 *
 * @param formData
 * @returns
 * @description This function will create a new supplement
 */
export default async function createSupplement(
  formData: z.infer<typeof createSupplementSchema>,
) {
  const validatedFields = createSupplementSchema.safeParse(formData);

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };

  const data = validatedFields.data;

  const user = await currentUser();
  if (!user) return { error: "error", status: 403, message: "Unauthorized" };

  const { id } = user; // clerk_id

  // need a supplement table

  // TODO - Make configuration entry when user is created and remove it from here
  // check if configuration exists
  try {
    const config = await db.configurations.findFirstOrThrow({
      where: {
        user_id: id,
      },
    });

    const supplement = await db.supplement.create({
      data: {
        brand_name: data.brand_name,
        name: data.name,
        serving_size: data.serving_size,
        serving_size_unit: data.serving_size_unit,
        activated: true,
        configuration_id: config.id,
        ingredients: {
          createMany: {
            data: data.ingredients.map((ingredient) => {
              return {
                name: ingredient.name,
                amount_per_serving: ingredient.amount_per_serving,
                amount_per_serving_unit: ingredient.amount_per_serving_unit,
                daily_value: ingredient.daily_value ?? null,
              };
            }),
          },
        },
      },
      select: {
        id: true,
        brand_name: true,
        name: true,
        serving_size: true,
        serving_size_unit: true,
        activated: true,
        ingredients: {
          select: {
            name: true,
            amount_per_serving: true,
            amount_per_serving_unit: true,
            daily_value: true,
          },
        },
      },
    });
    return { message: "supplement created", status: 200, data: supplement };
  } catch (err) {
    return { message: "could not create supplement", status: 500, error: err };
  }
  revalidatePath("/dashboard/configure/supplements");
}

/**
 *
 * @param id UUID of supplement
 * @returns
 * @description This function will update the activation status of a supplement
 */
export async function updateSupplementActivation(
  id: string,
  activated: boolean,
) {
  try {
    await db.supplement.update({
      where: {
        id,
      },
      data: {
        activated,
      },
    });
  } catch (err) {
    return { message: "could not update supplement", status: 500, error: err };
  }
  revalidatePath("/dashboard/configure/supplements");
}
