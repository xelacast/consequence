"use client";

import type { z } from "zod";
import React, { useEffect, useState } from "react";
import { useSupplements } from "~/lib/hooks/supplements";
import type { readSupplementSchema } from "~/lib/schemas/supplement";
import {
  ConfigureSupplements,
  ShowConfiguredSupplements,
} from "./components/supplementparts";

/**
 * Configure Supplements page
 * @has form for supplements configuration, configured supplements list, edit/update/create/delete button
 * @returns JSX.Element
 * @data can make this universal and pull supplements from a third party database or allow users to create there own. Or both?
 */

export default function Page() {
  const { supplements, isError, isLoading } = useSupplements();
  const [activeSupplements, setActiveSupplements] = useState<
    z.infer<typeof readSupplementSchema>[] | undefined
  >(supplements);

  // could I do this a different way?
  useEffect(() => {
    if (supplements) setActiveSupplements(supplements);
  }, [supplements]);

  return (
    <div className="grid gap-2 md:grid-cols-3">
      <ShowConfiguredSupplements
        className="md:col-span-1 md:col-start-1"
        supplements={activeSupplements}
        isError={isError}
        isLoading={isLoading}
      />
      <ConfigureSupplements
        className="md:col-span-2 md:col-start-2"
        setSupplements={setActiveSupplements}
        supplements={activeSupplements}
      />
    </div>
  );
}

// types for the state of the supplements
export type ReadSupplementsType = z.infer<typeof readSupplementSchema>[];
export type SetSupplementStateAction = React.Dispatch<
  React.SetStateAction<ReadSupplementsType | undefined>
>;
