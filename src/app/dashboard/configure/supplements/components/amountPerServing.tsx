"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import type { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { SupplementSchema } from "~/lib/schemas/supplement";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

import { SelectMeasurement } from "./measurements";
import { SupplementFactsTable } from "./supplementHover";
/**
 *
 * @param className String for className styling with tailwindcss on parent level for UI
 * @returns amount per serving form field and field array UI. React.ReactNode
 * @description This is a bit of a mess
 */
export const AmountPerServing = ({ className }: { className?: string }) => {
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [bounce, setBounce] = useState(false);
  const form = useFormContext<z.infer<typeof SupplementSchema>>();

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: "ingredients.values",
  });

  const watchIngredients = form.watch("ingredients");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchIngredients.values[index],
    };
  });

  // Adding ingredients to the form
  const addValue = () => {
    const { amount_per_serving, amount_per_serving_unit, name, daily_value } =
      watchIngredients.placeHolders;
    // custom error handling for the nested data in the form
    // Can this be done a different way?
    // As of https://github.com/react-hook-form/react-hook-form/issues/10251 it seems to be a bug
    if (!amount_per_serving || !amount_per_serving_unit || !name) {
      if (!name) {
        form.setError(`ingredients.placeHolders.name`, {
          message: "Please fill out name",
          type: "manual",
        });
      } else {
        form.clearErrors(`ingredients.placeHolders.name`);
      }
      if (!amount_per_serving) {
        form.setError(`ingredients.placeHolders.amount_per_serving`, {
          message: "Please fill out amount per serving",
          type: "manual",
        });
      } else if (amount_per_serving > 10000) {
        form.setError(`ingredients.placeHolders.amount_per_serving`, {
          message: "Amount per serving must be less than 10000",
          type: "manual",
        });
      } else {
        form.clearErrors(`ingredients.placeHolders.amount_per_serving`);
      }
      if (!amount_per_serving_unit) {
        form.setError(`ingredients.placeHolders.amount_per_serving_unit`, {
          message: "Please fill out a measurement",
          type: "manual",
        });
      } else {
        form.clearErrors(`ingredients.placeHolders.amount_per_serving_unit`);
      }
      return;
    }

    form.clearErrors("ingredients");

    append({
      name,
      amount_per_serving,
      amount_per_serving_unit,
      daily_value,
    });

    form.setValue("ingredients.placeHolders.name", "");
    form.setValue("ingredients.placeHolders.amount_per_serving", null);
    form.setValue(
      "ingredients.placeHolders.amount_per_serving_unit",
      undefined,
    );
    form.setValue("ingredients.placeHolders.daily_value", null);
  };

  return (
    <div className={cn(className)}>
      <FormField
        control={form.control}
        name="ingredients.values"
        render={() => (
          <FormItem>
            <FormLabel>Ingredients</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={"ingredients.placeHolders.name"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="name" value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-row gap-2">
        <FormField
          control={form.control}
          name={`ingredients.placeHolders.amount_per_serving`}
          render={({ field }) => (
            <FormItem className="basis-72">
              <FormLabel>Amount Per Serving</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  autoComplete="off"
                  placeholder="serving size"
                  onChange={(e) => field.onChange(+e.target.value)}
                  value={(field.value as string | null) ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SelectMeasurement name="ingredients.placeHolders.amount_per_serving_unit" />
      </div>
      <FormField
        control={form.control}
        name={`ingredients.placeHolders.daily_value`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Daily Value</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                onChange={(e) => field.onChange(+e.target.value)}
                placeholder="dv"
                value={(field.value as string | null) ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex w-full items-center justify-between ">
        <Button
          type="button"
          className="mt-4"
          onClick={() => {
            addValue();
            setIngredientsOpen(true);
          }}
        >
          Add ingredient
        </Button>
        <ChevronUpIcon
          onClick={() => setIngredientsOpen(!ingredientsOpen)}
          onMouseEnter={() => setBounce(true)}
          onMouseLeave={() => setTimeout(() => setBounce(false), 500)}
          data-open={ingredientsOpen}
          className="size-8 cursor-pointer transition-all duration-300 ease-in-out data-[open=false]:rotate-180"
        />
      </div>
      <div
        data-open={ingredientsOpen}
        data-bounce={bounce}
        className="transition-height mt-4 h-0 overflow-hidden duration-300 ease-out data-[open=true]:h-[20vh] data-[open=false]:overflow-hidden"
      >
        <SupplementFactsTable
          ingredients={controlledFields}
          removable={true}
          remove={remove}
        />
      </div>
    </div>
  );
};
