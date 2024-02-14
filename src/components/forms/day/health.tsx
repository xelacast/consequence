import { useForm } from "react-hook-form";
import type { z } from "zod";
import { healthSchema } from "../day/schema";
import { Input } from "~/components/ui/input";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { createHealthAction } from "~/server/actions/healthAction";
import {
  MentalHealthDescriptors,
  PhysicalHealthDescriptors,
} from "@prisma/client";

interface Option {
  value: string;
  label: string;
}

const mentalHealthOptions = Object.values(MentalHealthDescriptors).map(
  (desc) => ({
    label: desc.charAt(0).toUpperCase() + desc.substring(1),
    value: desc,
  }),
) as Option[];

const physicalHealthOptions = Object.values(PhysicalHealthDescriptors).map(
  (desc) => ({
    label: desc.charAt(0).toUpperCase() + desc.substring(1),
    value: desc,
  }),
) as Option[];

export const HealthFormV2 = () => {
  const form = useForm<z.infer<typeof healthSchema>>({
    resolver: zodResolver(healthSchema),
    defaultValues: {
      energy_level: 0,
      mental_health: 0,
      mental_health_description: [],
      physical_health: 0,
      physical_health_description: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof healthSchema>) => {
    await createHealthAction(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormContainer>
          <>
            <h5>Mental Health</h5>
            <FormField
              control={form.control}
              name="mental_health"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mental Health Scale</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      type="number"
                      max={10}
                      min={1}
                      placeholder="Physical Health 1-10"
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mental_health_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mental Health Description</FormLabel>
                  <FormControl>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={mentalHealthOptions}
                      onChange={(e) =>
                        field.onChange(e.map((c: { value: string }) => c.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        </FormContainer>
        <FormContainer>
          <>
            <h5>Physical Health</h5>
            <FormField
              control={form.control}
              name="physical_health"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Health Scale</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      type="number"
                      max={10}
                      min={1}
                      placeholder="Physical Health 1-10"
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="energy_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Energy Level Scale</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      type="number"
                      max={10}
                      min={1}
                      placeholder="Energy Levels 1-10"
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="physical_health_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Health Description</FormLabel>
                  <FormControl>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={physicalHealthOptions}
                      onChange={(e) => {
                        console.log(e);
                        return field.onChange(
                          e.map((c: { value: string }) => c.value),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </>
        </FormContainer>
      </form>
    </Form>
  );
};
