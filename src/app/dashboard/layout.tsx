"use client";

import { DashboardHeader } from "./components/nav";
import SideNavigation, { NavigationMenuDemo } from "./components/sideNav";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <div>
        <NavigationMenuDemo />
        <DashboardHeader />
        <div className="2xl container mx-auto">{children}</div>
      </div>
    </main>
  );
};

export default layout;
