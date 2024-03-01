"use client";
import { GearIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

// This menu will be located on the left side of the page
// for desktop users I want it to be initialy closed only icons and when they click on the icon it will open
// Theyll be able to expand the menu with an icon button
// When it is opened it will shrink the right side width and fill in teh space (animation)

/**
 *
 * @description
 * This menu will be located on the left side of the page for desktop users I want it to be initialy closed only icons and when they click on the icon it will open
 * Theyll be able to expand the menu with an icon button
 * When it is opened it will shrink the right side width and fill in the space (animation)
 */
export default function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav>
      <div>
        <button onClick={() => setIsOpen(!isOpen)}>
          <span>Menu</span>
        </button>
      </div>
      <div
        className="bg-slate-400 transition-all duration-300 ease-in-out data-[state=false]:w-20 data-[state=true]:w-1/6"
        data-state={isOpen}
        // onClose={() => setIsOpen("close")}
      >
        <ul>
          <li>
            <a href="#">Dashboard</a>
          </li>
          <li>
            <a href="#">Profile</a>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

import Link from "next/link";

import { cn } from "~/lib/utils";
// import { Icons } from "~/components/icons";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

// on mobile replace with a drawer menu
export function NavigationMenuDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {/* <Button onClick={() => setOpen(!open)}>toggle</Button> */}
      <div
        className="overflow-clip bg-slate-600 transition-all duration-300 ease-in-out data-[state=false]:w-14 data-[state=true]:w-52 md:block"
        data-state={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <NavigationMenu>
          <NavigationMenuList className="left-0 top-0 flex-col">
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <GearIcon /> Configuration
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
