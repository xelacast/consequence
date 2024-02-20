"use client";

import { DashboardHeader } from "./components/nav";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <DashboardHeader />
      {children}
    </section>
  );
};

export default layout;
