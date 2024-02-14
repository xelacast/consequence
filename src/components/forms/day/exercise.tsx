import { useForm } from "react-hook-form";
import type { z } from "zod";
import { exerciseSchema } from "../day/schema";
import { ExerciseType } from "@prisma/client";
import { FormContainer } from "~/components/ui/formcontainer";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { Button } from "~/components/ui/button";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import dayjs from "~/lib/dates";
import { createExerciseAction } from "~/server/actions/exerciseAction";

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

export const ExerciseFormV2 = () => {
  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      // exercise_type: "",
      duration: 0,
      // intensity: "",
      time_of_day: dayjs().hour() + ":" + dayjs().minute(),
      fasted: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof exerciseSchema>) => {
    // console.log(values);
    // create exercise action
    // format the time before you send it to the server
    const hours = values.time_of_day.split(":")[0]!;
    const minutes = values.time_of_day.split(":")[1]!;
    const date = dayjs()
      .set("hours", +hours)
      .set("minutes", +minutes)
      .set("seconds", 0)
      .toISOString();
    values.time_of_day = date; // correctly formated isostring date
    console.log(values);
    await createExerciseAction(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormContainer>
          <>
            <h5>Exercise</h5>
            <FormField
              control={form.control}
              name="type"
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
              name="duration"
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
              name="intensity"
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
              name="time_of_day"
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
                    <TimePicker
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fasted"
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
            <Button type="submit">Submit</Button>
          </>
        </FormContainer>
      </form>
    </Form>
  );
};
