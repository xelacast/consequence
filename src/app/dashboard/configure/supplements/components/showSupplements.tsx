"use client";

import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { FileTextIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { updateSupplementActivation } from "~/lib/actions/supplementAction";
import { toCapitalize } from "~/lib/misc/useUpperCase";
import type { readSupplementSchema } from "~/lib/schemas/supplement";
import { SupplementHoverCard as SHC } from "./supplementHover";
import { getSupplementsConfig } from "~/lib/hooks/supplements";
import { Skeleton } from "~/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

/**
 *
 * @param className String for className styling with tailwindcss,
 * @param supplements list of supplements to show
 * @param isError error from fetching the supplements
 * @param isLoading loading state of fetching the supplements
 * @returns list of configured supplements with a checkbox to "activate" them on the dashboard for selection
 * @dependencies readConfigSupplementsAction
 * @description list of names and brands of supplements to activate/show activation for dashboard and day/supplement creation
 * the list of ingredients and extra details will be shown on hover or click
 * activation of the supplement will be on the click of a button
 * activation is used for the dashboard and the day/supplement creation
 * Many people will have a ton of supplements/medication to take. Some do not take them all the time. My Thought is I would activate/deactivate used supplements
 */

export const ShowConfiguredSupplements = ({
  className,
}: {
  className?: string;
}) => {
  // NOTE: synrchonize with the mutation only works if they have the same query client. Using a hook requires extra steps to take
  const {
    data: supplements,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["supplements"],
    queryFn: async () => await getSupplementsConfig(),
  });

  if (isError) return <p>Error...</p>;

  // To switch this to a react query mutation? or just use the action?
  const updateActivation = async (id: string, activated: boolean) => {
    await updateSupplementActivation(id, activated);
  };

  return (
    <div className={cn("overflow-auto", className)}>
      <h1>Supplements</h1>
      {isLoading ? (
        <SupplementLoadingSkeleton />
      ) : (
        <ul>
          {supplements?.map((supplement, index) => {
            return (
              <li key={index} className="mt-2 flex gap-2">
                <SupplementHoverCard
                  supplement={supplement}
                  index={index}
                  updateActivation={updateActivation}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const SupplementHoverCard = ({
  supplement,
  index,
  updateActivation,
}: {
  supplement: z.infer<typeof readSupplementSchema>;
  index: number;
  updateActivation: (id: string, activated: boolean) => Promise<void>;
}) => {
  const [activated, setActivated] = useState(supplement.activated);
  return (
    <SHC supplement={supplement}>
      <Button
        name={`activation.${index}`}
        id={`activation.${index}`}
        className="flex gap-2 data-[activated=false]:bg-slate-500 data-[activated=true]:bg-green-500"
        data-activated={activated}
        onClick={async () => {
          setActivated(!activated);
          await updateActivation(supplement.id!, !activated);
        }}
      >
        {toCapitalize(supplement.name)} - {toCapitalize(supplement.brand_name)}
        <FileTextIcon />
      </Button>
    </SHC>
  );
};

const SupplementLoadingSkeleton = () => {
  return (
    <ul className="mt-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <li key={index}>
          <Skeleton className="mb-2 h-[36px] w-full rounded-lg" />
        </li>
      ))}
    </ul>
  );
};
