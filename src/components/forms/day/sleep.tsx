import { type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { type daySchema } from "../day/schema";
import { Input } from "~/components/ui/input";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import Select from "react-select";

const options = [
  { value: "good", label: "Good" },
  { value: "bad", label: "Bad" },
] as Options[];

interface Options {
  value: string;
  label: string;
}

export const SleepFormV2 = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof daySchema>>;
}) => {
  return (
    <FormContainer>
      <>
        <h5>Sleep Quality and Duration</h5>
        <FormField
          control={form.control}
          name="sleep.rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quality</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Sleep Rating"
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sleep.quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quality</FormLabel>
              <FormControl>
                <Select
                  closeMenuOnSelect={false}
                  options={options}
                  onChange={(e) =>
                    field.onChange(e.map((c: { value: string }) => c.value))
                  }
                  isMulti
                  placeholder="Sleep Quality"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sleep.hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (Hours)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Sleep Duration (hrs)"
                  pattern="[0,9]"
                  type="number"
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    </FormContainer>
  );
};
