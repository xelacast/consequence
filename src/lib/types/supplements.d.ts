import type { ingredient, supplement } from "@prisma/client";

/**
 * @ComponentsUsing: supplementHover.tsx
 */
export type PartialSupplement =
  | (Partial<supplement> & {
      ingredients: Partial<ingredient>[];
    })
  | null;

export type Supplements = {
  id: string;
  amount: number;
  time_taken: Date | null;
  measurement: $Enums.Measurements;
  supplement: PartialSupplement;
}[];

export type ReadSupplement = {
  id: string;
  activated: boolean;
  amount: number;
  time_taken: Date | null;
  measurement: $Enums.Measurements;
  // supplement: PartialSupplement[];
};
