import { useFormContext } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import {
  type $Enums,
  MentalHealthDescriptors,
  PhysicalHealthDescriptors,
} from "@prisma/client";
import type { DayType } from "../day";
import { ReusableSelect } from "../reusableSelect";

interface MentalHealthOption {
  value: $Enums.MentalHealthDescriptors;
  label: string;
}

interface PhysicalHealthOption {
  value: $Enums.PhysicalHealthDescriptors;
  label: string;
}

const mentalHealthOptions = Object.values(MentalHealthDescriptors).map(
  (desc) => ({
    label: desc.charAt(0).toUpperCase() + desc.substring(1),
    value: desc,
  }),
) as MentalHealthOption[];

const physicalHealthOptions = Object.values(PhysicalHealthDescriptors).map(
  (desc) => ({
    label: desc.charAt(0).toUpperCase() + desc.substring(1),
    value: desc,
  }),
) as PhysicalHealthOption[];

export const HealthFormV2 = () => {
  const form = useFormContext<DayType>();
  return (
    <FormContainer>
      <h5>Mental Health</h5>
      <FormField
        control={form.control}
        name="health.mental_health"
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
        name="health.mental_health_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mental Health Description</FormLabel>
            <FormControl>
              <ReusableSelect
                defaultValue={field.value?.map((c) => ({
                  value: c,
                  label: c.substring(0, 1).toUpperCase() + c.substring(1),
                }))}
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
      <h5>Physical Health</h5>
      <FormField
        control={form.control}
        name="health.physical_health"
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
        name="health.energy_levels"
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
        name="health.physical_health_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Physical Health Quality</FormLabel>
            <FormControl>
              <ReusableSelect
                defaultValue={field.value?.map((c) => ({
                  value: c,
                  label: c.substring(0, 1).toUpperCase() + c.substring(1),
                }))}
                closeMenuOnSelect={false}
                options={physicalHealthOptions}
                onChange={(e) =>
                  field.onChange(e.map((c: { value: string }) => c.value))
                }
                isMulti
                placeholder="Physical Quality"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormContainer>
  );
};
