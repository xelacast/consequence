import { Measurements } from "@prisma/client";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { daySchema } from "~/lib/schemas/day";
import type {
  SupplementSchema,
  supplementsSchema,
  readSupplementSchema,
} from "~/lib/schemas/supplement";
import { cn } from "~/lib/utils";

type SupportedSchemas =
  | z.infer<typeof supplementsSchema>
  | z.infer<typeof readSupplementSchema>
  | z.infer<typeof SupplementSchema>
  | z.infer<typeof daySchema>;

// type SupportedNames = keyof SupportedSchemas;
type SupportedNames =
  | "serving_size_unit"
  | "supplements.consumed_unit"
  | "ingredients.placeHolders.amount_per_serving_unit";

/**
 *
 * @param name
 * @param className - optional for css
 * @returns measurement select input for mg/mcg/oz/ml/capsules etc
 * @description used in supplement form. values come form enum Measurements
 * @warning Use At your own risk updating schemas and adding schemas may break this component
 */

// give it a schema first and then get the names from it
export const SelectMeasurement = ({
  name,
  className,
}: {
  name: SupportedNames;
  className?: string;
}) => {
  const form = useFormContext<Partial<SupportedSchemas>>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>Unit</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(Measurements).map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
