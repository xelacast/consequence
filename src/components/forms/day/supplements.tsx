"use client";

import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { formSchema } from "../day/schema";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export function SupplementForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  const handleAddSupp = () => {
    const { supplement_name, supplement_amount, supplement_time_of_day } =
      form.getValues();
    if (!supplement_name) {
      return;
    }
    appendSupp({
      supplement: supplement_name,
      amount: supplement_amount,
      time_of_day: supplement_time_of_day,
    });

    form.setValue("supplement_name", "");
    form.setValue("supplement_amount", 0);
    form.setValue("supplement_time_of_day", 0);
  };

  const {
    fields: supplementFields,
    append: appendSupp,
    remove: removeSupp,
  } = useFieldArray({
    control: form.control,
    name: "supplements",
    shouldUnregister: true,
  });

  return (
    <FormContainer>
      <>
        <h5>Supplements</h5>
        <FormField
          control={form.control}
          name="supplement_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Supplement Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplement_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (mg)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(+e.target.value)}
                  value={field.value == 0 ? "" : field.value}
                  placeholder="Supplement Amount (mg)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplement_time_of_day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Taken</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Time Taken"
                  onChange={(e) => field.onChange(+e.target.value)}
                  value={field.value == 0 ? "" : field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={handleAddSupp}>
          Add Supplement
        </Button>
        {supplementFields.map((field, index) => (
          <ul key={field.id}>
            <li>
              <span>{field.supplement}</span>
              <span>{field.amount} (mg)</span>
              <span>{field.time_of_day}</span>
            </li>
          </ul>
        ))}
      </>
    </FormContainer>
  );
}
