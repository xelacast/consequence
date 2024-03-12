"use client";

import type { z } from "zod";
import type {
  configuredSupplementBaseSchema,
  readSupplementSchema,
} from "~/lib/schemas/supplement";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "~/components/ui/hover-card";
import { addCommasToNumber } from "~/lib/misc/addComma";
import type { PartialSupplement } from "~/lib/types/supplements";

/**
 *
 * @param supplements
 * @param children - jsc ReactNode for the hover card trigger
 * @returns hover card and hover card content for read supplement page
 * @description The supplement hover cards are displaying the same information. I want that the same across all supplement triggers. The only difference is their triggers.
 */
export const SupplementHoverCard = ({
  supplement,
  children,
}: {
  supplement: PartialSupplement;
  children: React.ReactNode;
}) => {
  return (
    <HoverCard openDelay={100} closeDelay={50}>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[400px] ">
        <SupplementFactsTable supplement={supplement} />
      </HoverCardContent>
    </HoverCard>
  );
};

/**
 *
 * @param supplements
 * @returns jsx for the hover card trigger
 * @description This display the supplement facts in a table format. The hover card content is the same for all the triggers just different data.
 */
export const SupplementFactsTable = ({
  supplement,
}: {
  supplement:
    | z.infer<typeof readSupplementSchema>
    | z.infer<typeof configuredSupplementBaseSchema>
    | PartialSupplement;
}) => {
  return (
    <Table>
      <TableCaption>Supplement Facts</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Ingredients</TableHead>
          <TableHead>Amount Per Serving</TableHead>
          <TableHead>%DV</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supplement?.ingredients?.map((ingredient) => (
          <TableRow key={ingredient.name}>
            <TableCell>{ingredient.name}</TableCell>
            <TableCell>
              {addCommasToNumber(ingredient.amount_per_serving)}
              {ingredient.amount_per_serving_unit}
            </TableCell>
            <TableCell>
              {ingredient?.daily_value
                ? addCommasToNumber(ingredient?.daily_value) + "%"
                : "*"}
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={3}>* Daily Value (DV) not established</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
