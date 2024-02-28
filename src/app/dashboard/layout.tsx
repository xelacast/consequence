"use client";

import { DashboardHeader } from "./components/nav";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <DashboardHeader />
      <div className="2xl container mx-auto">{children}</div>
    </main>
  );
};

export default layout;
