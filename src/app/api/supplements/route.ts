import { auth } from "@clerk/nextjs";
import { db } from "~/server/db";

export async function GET() {
  const { userId } = auth().protect();

  try {
    const config = await db.configurations.findFirstOrThrow({
      where: {
        user_id: userId,
      },
      select: {
        supplements: { include: { ingredients: true } },
      },
    });
    return Response.json([...config.supplements]);
  } catch (err) {
    return Response.json({
      message: "could not read supplement configurations",
      status: 500,
      error: err,
    });
  }
}
