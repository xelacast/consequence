import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../day/schema";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export const SleepForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  return (
    <FormContainer>
      <>
        <h5>Sleep Quality and Duration</h5>
        <FormField
          control={form.control}
          name="sleep_quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quality</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Sleep Quality" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sleep_duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (Hours)</FormLabel>
              <FormControl>
                <Input
                  {...field}
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
        <FormField
          control={form.control}
          name="sleep_wake_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wake Time</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Sleep Wake Time" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sleep_bed_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sleep Bed Time</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Bed Time" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    </FormContainer>
  );
};
