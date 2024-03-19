import type { z } from "zod";
import React from "react";
import type { readSupplementSchema } from "~/lib/schemas/supplement";
import { ConfigureSupplements } from "./components/configureSupplement";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { getSupplementsConfig } from "~/lib/hooks/supplements";
import { ShowConfiguredSupplements } from "./components/showSupplements";

/**
 * Configure Supplements page
 * @has form for supplements configuration, configured supplements list, edit/update/create/delete button
 * @returns JSX.Element
 * @data can make this universal and pull supplements from a third party database or allow users to create there own. Or both?
 */

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["supplements"],
    queryFn: async () => await getSupplementsConfig(),
  });

  return (
    <div className="grid h-[90vh] gap-4 md:grid-cols-5 lg:grid-cols-3">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ShowConfiguredSupplements className="h-[50vh] rounded-md border p-4 shadow-lg md:col-span-2 md:col-start-1 md:h-auto lg:col-span-1 lg:col-start-1" />
      </HydrationBoundary>
      <ConfigureSupplements className="rounded-md border p-4 shadow-lg md:col-span-4 md:col-start-3 lg:col-span-5 lg:col-start-2" />
    </div>
  );
}

// types for the state of the supplements
export type ReadSupplementsType = z.infer<typeof readSupplementSchema>[];
export type SetSupplementStateAction = React.Dispatch<
  React.SetStateAction<ReadSupplementsType | undefined>
>;
