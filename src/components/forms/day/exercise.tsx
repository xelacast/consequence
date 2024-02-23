import { type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { type daySchema } from "../day/schema";
import { ExerciseType } from "@prisma/client";
import { FormContainer } from "~/components/ui/formcontainer";
import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import Select from "react-select";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

const exerciseTypeOptions = Object.values(ExerciseType).map((type) => {
  return {
    label: type.charAt(0).toUpperCase() + type.substring(1),
    value: type.toLowerCase(),
  };
}) as Options[];

const exerciseDurationOptions = [
  { label: "15 mins", value: "15" },
  { label: "30 Mins", value: "30" },
  { label: "45 Mins", value: "45" },
  { label: "1 Hour", value: "60" },
  { label: "1 Hour 15 Mins", value: "75" },
  { label: "1 Hour 30 Mins", value: "90" },
] as Options[];

const exerciseIntensityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as Options[];

type Options = {
  label: string;
  value: string;
};

export const ExerciseFormV2 = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof daySchema>>;
}) => {
  return (
    <FormContainer>
      <>
        <h5>Exercise</h5>
        <FormField
          control={form.control}
          name="exercise.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
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
                <Select
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
                <Select
                  options={exerciseIntensityOptions}
                  // @ts-expect-error This is a bug in the react-select types
                  onChange={(e) => field.onChange(e.value)}
                  placeholder="Exercise Intensity"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exercise.time_of_day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time of Day</FormLabel>
              <FormControl>
                {/* <Input
                      {...field}
                      placeholder="Time of Day"
                      value={field.value || ""}
                      onChange={() => field.onChange(+field.value)}
                    /> */}
                <TimePicker {...field} onChange={(e) => field.onChange(e)} />
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
      </>
    </FormContainer>
  );
};
