"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import React from "react";
import createSupplement from "~/lib/actions/supplementAction";
import { type ReadSupplementsType } from "../page";
import type { createSupplementSchema } from "~/lib/schemas/supplement";
import { SelectMeasurement } from "./measurements";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AmountPerServing } from "./amountPerServing";

type ConfigureSupplement = z.infer<typeof createSupplementSchema>;

export const ConfigureSupplements = ({ className }: { className?: string }) => {
  // get query to show updated supplements onSuccess
  const queryClient = useQueryClient();
  // mutation to connect to react hook form
  const mutation = useMutation({
    mutationFn: async (val: ConfigureSupplement) => {
      const { data } = await createSupplement(val);
      return data;
    },
    onSuccess: (data) => {
      form.setValue("brand_name", "");
      form.setValue("name", "");
      form.setValue("serving_size", 0);
      form.setValue("serving_size_unit", "mg");
      form.setValue("ingredients.values", []);
      // show popup success message
      toast(`${data?.name} supplement added`, {
        description: new Date().toLocaleTimeString(),
      });
      // refetch the data for other components
      queryClient.setQueryData(
        ["supplements"],
        (oldData: ReadSupplementsType[]) =>
          oldData ? [...oldData, data] : [data],
      );
    },
  });

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
    const val: ConfigureSupplement = {
      brand_name: brand_name.toLowerCase(),
      name: name.toLowerCase(),
      serving_size,
      serving_size_unit,
      ingredients: [
        ...ingredients.values.map((i) => ({
          ...i,
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

    mutation.mutate(val);
  };

  // should this be broken down into smaller components?
  // Users will eventually have a search mechanism and this will be a last resort
  return (
    <Form {...form}>
      <form
        className={cn("grid grid-cols-1 content-start gap-4", className)}
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
                  value={field.value ?? ""}
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
                  value={field.value ?? ""}
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
        <AmountPerServing className="rounded-lg border p-4 shadow-md" />
        <Button type="submit" disabled={mutation.status == "pending"}>
          Add Supplement
        </Button>
      </form>
    </Form>
  );
};
