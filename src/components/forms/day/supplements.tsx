"use client";

import { type UseFormReturn, useFieldArray } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import type { daySchema } from "../day/schema";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import Select from "react-select";
import { Measurements, Supplements } from "@prisma/client";
import TimePicker from "react-time-picker";
import dayjs from "dayjs";
import { datePickerFormater } from "~/lib/dates";

const supplementOptions = Object.values(Supplements).map((supplement) => {
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

    const {
      name,
      amount,
      time_taken_string,
      measurement: measure,
    } = supplements
      ? supplements
      : {
          name: undefined,
          amount: undefined,
          time_taken_string: "",
          measurement: { label: "mg", value: "mg" },
        };

    const measurement = measure?.value as Measurements;
    if (!name || !amount || !time_taken_string || !measurement) {
      return;
    }
    const date = form.getValues("date");
    const time_taken = datePickerFormater({
      time: time_taken_string,
      selectedDate: date,
    });

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
          name="supplements.time_taken_string"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Taken</FormLabel>
              <FormControl>
                <TimePicker
                  {...field}
                  onChange={(e: string | null) => {
                    field.onChange(e);
                  }}
                />
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
