"use client";

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
import type { $Enums } from "@prisma/client";
import { cn } from "~/lib/utils";
import type { UseFieldArrayRemove } from "react-hook-form";
import { Cross1Icon } from "@radix-ui/react-icons";

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
        <SupplementFactsTable ingredients={supplement?.ingredients} />
      </HoverCardContent>
    </HoverCard>
  );
};

interface SupplementFactsTableProps {
  ingredients?: {
    name?: string;
    amount_per_serving?: number;
    amount_per_serving_unit?: $Enums.Measurements;
    daily_value?: number | null;
  }[];
  removable?: boolean;
  remove?: UseFieldArrayRemove;
  className?: string;
}

/**
 *
 * @param supplements
 * @returns jsx for the hover card trigger
 * @description This display the supplement facts in a table format. The hover card content is the same for all the triggers just different data.
 */
export const SupplementFactsTable = ({
  className,
  ingredients,
  removable = false,
  remove,
}: SupplementFactsTableProps) => {
  return (
    <div className={cn(className)}>
      <Table>
        <TableCaption>Supplement Facts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Ingredients</TableHead>
            <TableHead>Amount Per Serving</TableHead>
            <TableHead>%DV</TableHead>
            {removable && remove && <TableHead>Remove</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients?.map((ingredient, index) => (
            <TableRow key={ingredient?.name}>
              <TableCell>{ingredient?.name}</TableCell>
              <TableCell>
                {addCommasToNumber(ingredient?.amount_per_serving)}
                {ingredient?.amount_per_serving_unit}
              </TableCell>
              <TableCell>
                {ingredient?.daily_value
                  ? addCommasToNumber(ingredient?.daily_value) + "%"
                  : "*"}
              </TableCell>
              {removable && remove && (
                <TableCell>
                  <button
                    className="align-middle"
                    onClick={() => remove(index)}
                  >
                    <Cross1Icon />
                  </button>
                </TableCell>
              )}
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}>
              * Daily Value (DV) not established
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
