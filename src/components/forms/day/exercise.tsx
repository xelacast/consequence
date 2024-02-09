import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../day/schema";
import { Input } from "~/components/ui/input";
import { FormContainer } from "~/components/ui/formcontainer";
import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export const ExerciseForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  return (
    <FormContainer>
      <>
        <h5>Exercise</h5>
        <FormField
          control={form.control}
          name="exercise_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Exercise Type" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exercise_duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Exercise Duration" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exercise_intensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intensity</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Exercise Intensity" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exercise_time_of_day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time of Day</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Time of Day" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exercise_fasted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start justify-center space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormLabel>Exercise Fasted</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </>
    </FormContainer>
  );
};
