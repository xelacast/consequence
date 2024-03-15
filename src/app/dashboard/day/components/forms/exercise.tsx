import { useFormContext } from "react-hook-form";
import { type $Enums, ExerciseType } from "@prisma/client";
import { FormContainer } from "~/components/ui/formcontainer";
import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { datePickerFormatter } from "~/lib/misc/dates";
import { ReusableSelect } from "../reusableSelect";
import type { DayType } from "../day";

const exerciseTypeOptions = Object.values(ExerciseType).map((type) => {
  return {
    label: type.charAt(0).toUpperCase() + type.substring(1),
    value: type.toLowerCase(),
  };
}) as { label: string; value: $Enums.ExerciseType }[];

const exerciseDurationOptions = [
  { label: "15 mins", value: 15 },
  { label: "30 Mins", value: 30 },
  { label: "45 Mins", value: 45 },
  { label: "1 Hour", value: 60 },
  { label: "1 Hour 15 Mins", value: 75 },
  { label: "1 Hour 30 Mins", value: 90 },
] as { label: string; value: number }[];

const exerciseIntensityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as {
  label: string;
  value: "low" | "medium" | "high";
}[];

export const ExerciseFormV2 = () => {
  const form = useFormContext<DayType>();
  return (
    <FormContainer>
      <h5>Exercise</h5>
      <FormField
        control={form.control}
        name="exercise.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <ReusableSelect
                isMulti={false}
                defaultValue={
                  field.value
                    ? {
                        label:
                          field.value.substring(0, 1).toUpperCase() +
                          field.value.substring(1),
                        value: field.value,
                      }
                    : undefined
                }
                options={exerciseTypeOptions}
                // @ts-expect-error This is a bug in the react-select types
                onChange={(e) => field.onChange(e.value)}
                placeholder="Exercise Type"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="exercise.duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <FormControl>
              <ReusableSelect
                isMulti={false}
                defaultValue={
                  field.value
                    ? {
                        label: field.value.toString() + " Mins",
                        value: field.value,
                      }
                    : undefined
                }
                // @ts-expect-error This is a bug in the react-select types
                onChange={(e) => field.onChange(+e.value)}
                options={exerciseDurationOptions}
                placeholder="Exercise Duration"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="exercise.intensity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Intensity</FormLabel>
            <FormControl>
              <ReusableSelect
                isMulti={false}
                defaultValue={
                  field.value
                    ? {
                        label:
                          field.value.substring(0, 1).toUpperCase() +
                          field.value.substring(1),
                        value: field.value,
                      }
                    : undefined
                }
                options={exerciseIntensityOptions}
                // @ts-expect-error Not sure how to get around this atm
                onChange={(e: {
                  label: string;
                  value: "low" | "medium" | "high";
                }) => field.onChange(e.value)}
                placeholder="Exercise Intensity"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="exercise.time_of_day_string"
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
                  form.setValue("exercise.time_of_day", time);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="exercise.fasted"
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
    </FormContainer>
  );
};
