import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/day");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center "></main>
  );
}
