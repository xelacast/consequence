import { db } from "~/server/db";
import { JournalContainer } from "./components/entries";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import type { journal } from "@prisma/client";

// these containers for server side components are not doing anything
// we can read data on the server and pass it to the client

export default async function Page() {
  const { userId } = auth();
  let journalEntries: journal[] = [];
  if (userId) {
    journalEntries = await db.journal.findMany({
      where: {
        day: {
          user: {
            clerk_id: userId,
          },
        },
      },
    });
  } else {
    redirect("/sign-in");
  }
  return <JournalContainer entries={journalEntries} />;
}
