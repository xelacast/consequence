"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import type { daySchema } from "../../../../../lib/schemas/day";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import TimePicker from "react-time-picker";
import { useSupplements } from "~/lib/hooks/supplements";
import { useEffect, useState } from "react";
import type {
  createSupplementSchemaClient,
  readSupplementSchema,
} from "~/lib/schemas/supplement";
import {
  SelectContent,
  Select as SelectShad,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "~/components/ui/select";
import { toCapitalize } from "~/lib/misc/useUpperCase";
import { Cross2Icon } from "@radix-ui/react-icons";
import { SelectMeasurement } from "~/app/dashboard/configure/supplements/components/measurements";
import { FormContainer } from "~/components/ui/formcontainer";
import { datePickerFormatter } from "~/lib/dates";
import { SupplementHoverCard } from "~/app/dashboard/configure/supplements/components/supplementHover";

/**
 *
 * @returns Configured supplements
 */
export const ConfiguredSupplements = () => {
  // read configured supplements

  const form = useFormContext<z.infer<typeof daySchema>>();

  // used to set the data for the supplements when its available
  const [data, setData] = useState<
    z.infer<typeof readSupplementSchema>[] | undefined
  >(undefined); // reading configured supplements

  // read the supplements that are configured by the user
  const { supplements, isError, isLoading } = useSupplements(true);

  // used to fill out the form appropriately
  const { append, remove, fields } = useFieldArray({
    name: "supplements.input",
    control: form.control,
  });

  useEffect(() => {
    if (supplements) setData(supplements);
  }, [supplements]);

  const addSupplements = () => {
    const supplements = form.getValues("supplements");

    const { id, consumed_unit, consumed_amount, time } = supplements!;

    const a = data?.find((supplement) => supplement.id === id);

    if (!id || !consumed_unit || !consumed_amount || !time) return; // 'error' handling
    if (consumed_amount < 1) {
      form.setError("supplements.consumed_amount", {
        message: "Amount must be greater than 0",
      });
      return;
    } else {
      form.clearErrors("supplements.consumed_amount");
    }
    if (consumed_amount > 100000) {
      form.setError("supplements.consumed_amount", {
        message: "Amount must be less than 100000 units",
      });
      return;
    } else {
      form.clearErrors("supplements.consumed_amount");
    } // 'error' handling

    // add all data to fields
    append({
      consumed_unit,
      consumed_amount,
      time,
      supplement: { ...a },
      supplements_id: undefined,
    });

    form.setValue("supplements.id", undefined);
    form.setValue("supplements.consumed_amount", undefined);
    form.setValue("supplements.consumed_unit", undefined);
  };

  return (
    <section>
      <FormContainer>
        <SelectSupplement data={data} isLoading={isLoading} isError={isError} />
        <div className="flex gap-2">
          <ConsumptionAmount />
          <SelectMeasurement
            name="supplements.consumed_unit"
            className="flex-grow"
          />
        </div>
        <TimePickerInput />

        <Button type="button" onClick={addSupplements}>
          Add Supplement
        </Button>

        {/* Shows selected supplements */}
        <SupplementHoverSelectCards supplements={fields} remove={remove} />
      </FormContainer>
    </section>
  );
};

export const SupplementHoverSelectCards = ({
  supplements,
  remove,
}: {
  supplements: z.infer<typeof createSupplementSchemaClient>;
  remove: (index: number) => void;
}) => {
  return (
    <ul>
      {supplements?.map((field, index) => {
        return (
          <li key={field?.id}>
            <SupplementHoverCard
              supplement={{
                brand_name: field?.supplement.brand_name,
                ingredients: field.supplement.ingredients!,
                name: field?.supplement.name,
                serving_size: field?.supplement.serving_size,
                serving_size_unit: field?.supplement.serving_size_unit,
              }}
            >
              <Button
                className="flex flex-grow gap-2 bg-gradient-to-tr from-blue-900 to-gray-700"
                type="button"
                onClick={async () => {
                  remove(index);
                }}
              >
                {field?.consumed_amount} {field?.consumed_unit} -{" "}
                {toCapitalize(field?.supplement.name)} -{" "}
                {toCapitalize(field?.supplement.brand_name)}
                <Cross2Icon />
              </Button>
            </SupplementHoverCard>
          </li>
        );
      })}
    </ul>
  );
};

const SelectSupplement = ({
  data,
  isLoading,
  isError,
}: {
  data?: z.infer<typeof readSupplementSchema>[];
  isLoading: boolean;
  isError?: Error;
}) => {
  const form = useFormContext<z.infer<typeof daySchema>>();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  return (
    <FormField
      control={form.control}
      name={`supplements.id`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Supplements</FormLabel>
          <FormControl>
            <SelectShad
              onValueChange={field.onChange}
              defaultValue={field.value ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Supplements" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {data?.map((supplement) => (
                    <SelectItem value={supplement.id!} key={supplement.id}>
                      <h5>{supplement.brand_name}</h5>
                      <p>{supplement.name}</p>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </SelectShad>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

const ConsumptionAmount = () => {
  const form = useFormContext<z.infer<typeof daySchema>>();
  return (
    <FormField
      control={form.control}
      name="supplements.consumed_amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="number"
              onChange={(e) => field.onChange(+e.target.value)}
              value={field.value == 0 ? field.value : field.value ?? ""}
              placeholder="Supplement Amount"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const TimePickerInput = () => {
  const form = useFormContext<z.infer<typeof daySchema>>();
  return (
    <FormField
      control={form.control}
      name="supplements.time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Time Taken</FormLabel>
          <FormControl>
            <TimePicker
              onChange={(e: string | null) => {
                const time = datePickerFormatter({
                  time: e,
                  selectedDate: form.getValues("date"),
                });
                field.onChange(e);
                form.setValue("supplements.time", time);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
