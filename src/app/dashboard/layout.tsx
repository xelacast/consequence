"use client";

import { DashboardHeader } from "./components/nav";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <DashboardHeader />
      <div className="lg:2xl mx-2 md:container md:mx-auto">{children}</div>
    </main>
  );
};

export default layout;
