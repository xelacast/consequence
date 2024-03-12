"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import type { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { SupplementSchema } from "~/lib/schemas/supplement";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { FileTextIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import createSupplement, {
  updateSupplementActivation,
} from "~/lib/actions/supplementAction";
import { toCapitalize } from "~/lib/misc/useUpperCase";
import type { SetSupplementStateAction } from "../page";
import type {
  createSupplementSchema,
  readSupplementSchema,
} from "~/lib/schemas/supplement";
import { SelectMeasurement } from "./measurements";
import { SupplementHoverCard as SHC } from "./supplementHover";

export const ConfigureSupplements = ({
  className,
  setSupplements,
  supplements,
}: {
  className?: string;
  setSupplements: SetSupplementStateAction;
  supplements: z.infer<typeof readSupplementSchema>[] | undefined;
}) => {
  const form = useForm<z.infer<typeof SupplementSchema>>({
    resolver: zodResolver(SupplementSchema),
  });

  const onSubmit = async (values: z.infer<typeof SupplementSchema>) => {
    const {
      brand_name,
      name,
      serving_size,
      serving_size_unit,
      ingredients,
      description,
      other_ingredients,
      warnings,
      storage,
      notes,
      company,
      manufacture,
    } = values;

    // format data into create schema
    const val: z.infer<typeof createSupplementSchema> = {
      brand_name: brand_name.toLowerCase(),
      name: name.toLowerCase(),
      serving_size,
      serving_size_unit,
      ingredients: [
        ...ingredients.values.map((i) => ({
          ...i,
          name: i.name.toLowerCase(),
        })),
      ],
      description,
      other_ingredients,
      warnings,
      storage,
      notes,
      company,
      manufacture,
    };
    // clear the form fields
    form.setValue("brand_name", "");
    form.setValue("name", "");
    form.setValue("serving_size", 0);
    form.setValue("serving_size_unit", "mg");
    form.setValue("ingredients.values", []);

    const { id } = await createSupplement(val);
    if (!id || !supplements) return;
    // add to current state for perceived update
    setSupplements([...supplements, { id, activated: true, ...val }]);
  };

  // should this be broken down into smaller components?
  // Users will eventually have a search mechanism and this will be a last resort
  return (
    <Form {...form}>
      <form
        className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        method="post"
      >
        <FormField
          control={form.control}
          name="brand_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="brand name"
                  value={(field.value as string | null) ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplement Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="supplement name"
                  value={(field.value as string | null) ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row gap-2">
          <FormField
            control={form.control}
            name="serving_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serving Size</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(+e.target.value)}
                    placeholder="servings"
                    value={field.value ? field.value : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SelectMeasurement name="serving_size_unit" />
        </div>
        <AmountPerServing />
        <Button type="submit">Add Supplement</Button>
      </form>
    </Form>
  );
};

/**
 *
 * @param className String for className styling with tailwindcss on parent level for UI
 * @returns amount per serving form field and field array UI. React.ReactNode Return
 */
const AmountPerServing = ({ className }: { className?: string }) => {
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

      <Button type="button" className="mt-2" onClick={addValue}>
        Add ingredient
      </Button>
      <ul>
        {controlledFields.map((field, index) => (
          <li key={field.id}>
            <p>
              {field.name}
              {field.amount_per_serving}
              {field.amount_per_serving_unit}
              {field?.daily_value}
            </p>
            <Button type="button" onClick={() => remove(index)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 *
 * @param className String for className styling with tailwindcss,
 * @param supplements list of supplements to show
 * @param isError error from fetching the supplements
 * @param isLoading loading state of fetching the supplements
 * @returns list of configured supplements with a checkbox to "activate" them on the dashboard for selection
 * @dependencies readConfigSupplementsAction
 * @description list of names and brands of supplements to activate/show activation for dashboard and day/supplement creation
 * the list of ingredients and extra details will be shown on hover or click
 * activation of the supplement will be on the click of a button
 * activation is used for the dashboard and the day/supplement creation
 * Many people will have a ton of supplements/medication to take. Some do not take them all the time. My Thought is I would activate/deactivate used supplements
 */

export const ShowConfiguredSupplements = ({
  className,
  supplements,
  isError,
  isLoading,
}: {
  className?: string;
  supplements: z.infer<typeof readSupplementSchema>[] | undefined;
  isError: Error | undefined;
  isLoading: boolean;
}) => {
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  const updateActivation = async (id: string, activated: boolean) => {
    await updateSupplementActivation(id, activated);
  };

  return (
    <div className={cn(className)}>
      <h1>Supplements</h1>
      <ul>
        {supplements?.map((supplement, index) => {
          return (
            <li key={index} className="mt-2 flex gap-2">
              <SupplementHoverCard
                supplement={supplement}
                index={index}
                updateActivation={updateActivation}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const SupplementHoverCard = ({
  supplement,
  index,
  updateActivation,
}: {
  supplement: z.infer<typeof readSupplementSchema>;
  index: number;
  updateActivation: (id: string, activated: boolean) => Promise<void>;
}) => {
  const [activated, setActivated] = useState(supplement.activated);
  return (
    <SHC supplement={supplement}>
      <Button
        name={`activation.${index}`}
        id={`activation.${index}`}
        className="flex gap-2 data-[activated=false]:bg-slate-500 data-[activated=true]:bg-green-500"
        data-activated={activated}
        onClick={async () => {
          setActivated(!activated);
          await updateActivation(supplement.id!, !activated);
        }}
      >
        {toCapitalize(supplement.name)} - {toCapitalize(supplement.brand_name)}
        <FileTextIcon />
      </Button>
    </SHC>
  );
};
