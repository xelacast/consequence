import { currentUser } from "@clerk/nextjs";
import { db } from "~/server/db";

export async function readSupplementConfigurations() {
  const user = await currentUser();
  if (!user) return { error: "error", status: 403, message: "Unauthorized" };

  const { id } = user; // clerk_id

  try {
    const config = await db.configurations.findFirstOrThrow({
      where: {
        user_id: id,
      },
      select: {
        supplements: true,
      },
    });

    return [config.supplements];
  } catch (err) {
    return {
      message: "could not read supplement configurations",
      status: 500,
      error: err,
    };
  }
}
