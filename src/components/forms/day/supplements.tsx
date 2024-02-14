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
import { Supplements, TimeOfDay } from "@prisma/client";
import { createSupplementAction } from "~/server/actions/supplementAction";

const supplementOptions = Object.values(Supplements).map((supplement) => {
  return { label: supplement, value: supplement.toLowerCase() };
}) as Options[];

const timeOptions = Object.values(TimeOfDay).map((time) => {
  return { label: time, value: time.toLowerCase() };
}) as Options[];

type Options = { value: string; label: string };

export const SupplementFormV2 = () => {
  const form = useForm<z.infer<typeof supplementSchema>>({
    resolver: zodResolver(supplementSchema),
    defaultValues: {
      supplements: [],
    },
  });

  const { append, fields, remove } = useFieldArray({
    name: "supplements",
    control: form.control,
  });

  const onSubmit = async (values: z.infer<typeof supplementSchema>) => {
    await createSupplementAction(values);
  };

  const handleAddSupp = () => {
    const { name, amount, time_of_day } = form.getValues();

    if (!name || !amount || !time_of_day) {
      return;
    }
    append({
      supplement: name,
      amount,
      time_of_day,
    });

    form.setValue("name", null);
    form.setValue("amount", null);
    form.setValue("time_of_day", null);
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
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (mg)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(+e.target.value)}
                      value={field.value == 0 ? field.value : field.value ?? ""}
                      placeholder="Supplement Amount (mg)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time_of_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Taken</FormLabel>
                  <FormControl>
                    <Select
                      placeholder="Time of Day"
                      options={timeOptions}
                      // @ts-expect-error This is a bug in the react-select types
                      onChange={(e) => field.onChange(e.value)}
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
                <li key={field.id}>
                  <span>{field.supplement}</span>
                  <span>{field.amount} (mg)</span>
                  <span>{field.time_of_day}</span>
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
