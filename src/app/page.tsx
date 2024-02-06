import { UserButton } from "@clerk/nextjs";
import { NextApiRequest } from "next";

import { auth } from "@clerk/nextjs";
import { SupplementForm } from "./components/forms/supplements";

export default async function Home() {
  const { userId }: { userId: string | null } = auth();

  // Need form action
  const createDay = async (formData: FormData) => {
    "use server";
    console.log(formData);
  };
  // Create a form

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <form action={createDay}>
        <div id="supplements">
          <SupplementForm />
        </div>
        <input type="submit" value="Submit" />
      </form>
    </main>
  );
}
