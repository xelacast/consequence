"use client";

import { DashboardHeader } from "./components/nav";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <DashboardHeader />
      {children}
    </main>
  );
};

export default layout;
