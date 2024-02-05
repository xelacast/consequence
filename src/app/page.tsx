import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <div className="h-screen">
        <UserButton afterSignOutUrl="/" />
      </div>
    </main>
  );
}
