"use client";

import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { supplementSchema } from "../day/schema";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { Measurements, Supplements } from "@prisma/client";
import { createSupplementAction } from "~/server/actions/supplementAction";
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

export const SupplementFormV2 = ({ date }: { date: string }) => {
  const form = useForm<z.infer<typeof supplementSchema>>({
    resolver: zodResolver(supplementSchema),
    defaultValues: {
      date: date,
      supplements: [],
      measurement: { label: "mg", value: "mg" },
      time_taken: dayjs().hour() + ":" + dayjs().minute(),
    },
  });

  const { append, fields, remove } = useFieldArray({
    name: "supplements",
    control: form.control,
  });

  const onSubmit = async (values: z.infer<typeof supplementSchema>) => {
    values.supplements = values.supplements.map((supp) => {
      return {
        ...supp,
        time_taken: datePickerFormater({ time: supp.time_taken }),
      };
    });
    await createSupplementAction(values);
  };

  const handleAddSupp = () => {
    const { name, amount, time_taken, measurement } = form.getValues();
    const measure = measurement?.value;
    if (!name || !amount || !time_taken || !measure) {
      return;
    }
    append({
      supplement: name,
      amount,
      measurement: measure,
      time_taken,
    });

    form.setValue("name", null);
    form.setValue("amount", null);
    form.setValue("time_of_day", null);
    form.setValue("measurement", { label: "mg", value: "mg" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormContainer>
          <>
            <h5>Supplements</h5>
            <FormField
              control={form.control}
              name="name"
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(+e.target.value)}
                        value={
                          field.value == 0 ? field.value : field.value ?? ""
                        }
                        placeholder="Supplement Amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="measurement"
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
              name="time_taken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Taken</FormLabel>
                  <FormControl>
                    <TimePicker
                      {...field}
                      onChange={(e) => field.onChange(e)}
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
                  <span>{field.supplement}</span>
                  <span>
                    {field.amount}
                    {field.measurement}
                  </span>
                  <span>{field.time_taken}</span>
                  <Button type="button" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <Button type="submit">Submit</Button>
          </>
        </FormContainer>
      </form>
    </Form>
  );
};
