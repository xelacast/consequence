"use client";

import { DashboardHeader } from "./components/nav";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <DashboardHeader />
      <div className="lg:2xl mx-auto lg:container">{children}</div>
    </main>
  );
};

export default layout;
