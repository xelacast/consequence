import { useFormContext } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { type $Enums, StressSymptoms } from "@prisma/client";
import TimePicker from "react-time-picker";
import { datePickerFormatter } from "~/lib/dates";
import { ReusableSelect } from "../reusableSelect";
import type { DayType } from "../day";

const stressOptions = Object.values(StressSymptoms).map((symptom) => {
  return {
    label: symptom
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" "),
    value: symptom,
  };
}) as Options[];

interface Options {
  value: $Enums.StressSymptoms;
  label: string;
}

export const StressForm = () => {
  const form = useFormContext<DayType>();
  return (
    <FormContainer>
      <h5>Stress</h5>
      <FormField
        control={form.control}
        name="stress.rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stress Rating</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Stress Rating"
                onChange={(e) => field.onChange(+e.target.value)}
                autoComplete="off"
              />
            </FormControl>
            <FormDescription>Higher is worse</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stress.symptoms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stress Symptoms</FormLabel>
            <FormControl>
              <ReusableSelect
                defaultValue={field.value?.map((c) => ({
                  value: c,
                  label: c.substring(0, 1).toUpperCase() + c.substring(1),
                }))}
                options={stressOptions}
                onChange={(e) =>
                  field.onChange(e.map((c: { value: string }) => c.value))
                }
                isMulti
                isSearchable
                closeMenuOnSelect={false}
              />
            </FormControl>
            <FormDescription>
              Select up to 5 Symptoms you have been experiencing.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stress.notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes (optional)</FormLabel>
            <FormControl>
              <Textarea
                className="resize-none"
                {...field}
                value={field.value ?? ""}
                maxLength={250}
              />
            </FormControl>
            <FormDescription>
              Jot down any more information you would like to be aware of. Max
              characters: {field.value?.length}/250
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stress.time_of_day"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time of Day</FormLabel>
            <FormControl>
              <TimePicker
                onChange={(e: string | null) => {
                  const time = datePickerFormatter({
                    time: e,
                    selectedDate: form.getValues("date"),
                  });
                  field.onChange(time);
                }}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormDescription>
              Choose the time you were feeling this way. Or leave blank for
              current.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormContainer>
  );
};
