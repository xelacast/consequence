import { auth } from "@clerk/nextjs";
import type { NextRequest } from "next/server";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  const { userId } = auth().protect();

  const searchParams = request.nextUrl.searchParams;
  const activate = searchParams.get("activate");

  try {
    const config = await db.configurations.findFirstOrThrow({
      where: {
        user_id: userId,
      },
      select: {
        supplements: {
          include: { ingredients: true },
          where: { activated: activate === "true" ? true : undefined }, // this feels like a hack
        },
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
