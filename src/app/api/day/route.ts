import { auth } from "@clerk/nextjs";
import type { NextRequest } from "next/server";
import { getCalendarDocumentedDates } from "~/lib/misc/dates";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  const { userId } = auth().protect();

  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get("month");
  if (!month) return Response.error();

  // get dates for start of time and end of time +- 7 days of current month
  const { start, end } = getCalendarDocumentedDates(+month);

  try {
    const days = (
      await db.day.findMany({
        where: { date: { gte: start, lte: end }, user_id: userId },
        select: { date: true },
      })
    ).map((day) => day.date);
    return Response.json({ days });
  } catch (err) {
    return Response.json({
      message: "Could not read selected month",
      status: 500,
      error: err,
    });
  }
}
