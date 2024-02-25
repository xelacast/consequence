"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import { daySchema, updateDaySchema } from "~/components/forms/day/schema";
import { Form, FormField } from "~/components/ui/form";
import { DayProvider } from "~/lib/state/dayContext";
import type { $Enums } from "@prisma/client";
import { useEffect } from "react";

type Supplements = {
  // id?: string;
  name?: $Enums.Supplements;
  amount?: number;
  time_taken?: Date | null | string;
  measurement?: $Enums.Measurements;
}[];

type Exercise = {
  type?: $Enums.ExerciseType;
  id?: string;
  duration?: number;
  time_of_day?: Date;
  intensity?: string;
  fasted?: boolean;
}[];
type Misc =
  | {
      // id?: string;
      meditation?: boolean;
      intermittent_fasting?: boolean;
      cold_shower?: boolean;
    }
  | undefined
  | null;

type Health = {
  id?: string;
  notes?: string | null;
  physical_health?: number;
  physical_health_description?: $Enums.PhysicalHealthDescriptors[];
  mental_health?: number;
  mental_health_description?: $Enums.MentalHealthDescriptors[];
  energy_levels?: number;
}[];

// This doesn't make sense. If the day is present the fields to create a day from the schema are required then these objects are never null.
type Sleep =
  | {
      id?: string;
      hours?: number;
      quality?: string[];
      rating?: number;
      notes?: string | null;
    }
  | null
  | undefined;

type Stress = {
  id?: string;
  rating?: number;
  time_of_day?: Date;
  symptoms?: $Enums.StressSymptoms[];
  notes?: string | null;
}[];

/**
 * @param id: string
 * @returns a form to update the current day the user selects
 */

// ? What is a better way to do this? Could I have filled a context?
export default function UpdateDay({
  id,
  supplements,
  exercise,
  form_misc,
  health,
  sleep,
  stress,
}: {
  id: string;
  supplements: Supplements;
  exercise: Exercise;
  form_misc: Misc;
  health: Health;
  sleep: Sleep;
  stress: Stress; // how will i show multiple stress forms with react-hook-form?
  // * There will be a ton of prop drilling if I make it like this. I could lose track of state quickly
}) {
  const form = useForm<z.infer<typeof updateDaySchema>>({
    resolver: zodResolver(updateDaySchema),
    defaultValues: {
      id,
      supplements: {
        toggle: supplements.length > 0,
        name: undefined,
        amount: undefined,
        time_taken: new Date().toISOString(),
        supplements,
      },
      exercise: {
        toggle: exercise.length > 0,
        ...exercise,
      },
      misc: form_misc,
      health,
      sleep,
      stress,
    },
  });
  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "supplements.supplements",
  });
  useEffect(() => {
    // console.log(form.getValues());
    console.log(fields);
  }, [form, fields]);
  // will need a use effect for toggling forms with context
  const onSubmit = (data: z.infer<typeof updateDaySchema>) => {
    console.log(data);
  };
  return (
    <DayProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SupplementFormV2 form={form} />
          {/* <FormField control={form.control} name="supplements" /> */}
          {/* <FormField control={form.control} name="supplemen" /> */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div>Hello</div>
    </DayProvider>
  );
}

import { type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import Select from "react-select";
import { Measurements, Supplements as supps } from "@prisma/client";
import TimePicker from "react-time-picker";
import dayjs from "dayjs";

const supplementOptions = Object.values(supps).map((supplement) => {
  return { label: supplement, value: supplement.toLowerCase() };
}) as Options[];

const measurementsOptions = Object.values(Measurements).map((measurement) => {
  return { label: measurement, value: measurement };
}) as Options[];

type Options = { value: string; label: string };

export const SupplementFormV2 = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof daySchema>>;
}) => {
  const { append, fields, remove } = useFieldArray({
    name: "supplements.supplements",
    control: form.control,
  });

  const handleAddSupp = () => {
    const { supplements } = form.getValues();
    // console.log(supplements);
    console.log(f);

    const {
      name,
      amount,
      time_taken,
      measurement: measure,
    } = supplements
      ? supplements
      : {
          name: undefined,
          amount: undefined,
          time_taken: "",
          measurement: { label: "mg", value: "mg" },
        };

    const measurement = measure?.value as Measurements;
    if (!name || !amount || !time_taken || !measurement) {
      return;
    }
    append({
      name,
      amount,
      measurement,
      time_taken,
    });

    form.setValue("supplements.name", undefined);
    form.setValue("supplements.amount", undefined);
    form.setValue("supplements.measurement", { label: "mg", value: "mg" });
  };
  return (
    <FormContainer>
      <>
        <h5>Supplements</h5>
        <FormField
          control={form.control}
          name="supplements.supplements"
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplements.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Select
                  options={supplementOptions}
                  isSearchable
                  onChange={(e) =>
                    // @ts-expect-error This is a bug in the react-select types
                    field.onChange(e.value)
                  }
                  placeholder="Supplement Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="supplements.amount"
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
          <FormField
            control={form.control}
            name="supplements.measurement"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    // @ts-expect-error This is a bug in the react-select types
                    options={measurementsOptions}
                    onChange={(
                      e: {
                        label: string;
                        value: Measurements;
                      } | null,
                    ) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="supplements.time_taken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Taken</FormLabel>
              <FormControl>
                <TimePicker onChange={(e) => field.onChange(e)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={handleAddSupp}>
          Add Supplement
        </Button>
        <ul>
          {fields.map((field, index) => (
            <li key={field.id} className="flex gap-2">
              <span>{field.name}</span>
              <span>
                {field.amount}
                {field.measurement}
              </span>
              <span>
                {typeof field.time_taken == "object"
                  ? dayjs(field.time_taken).toString()
                  : field.time_taken}
              </span>
              <Button type="button" onClick={() => remove(index)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </>
    </FormContainer>
  );
};
