import { useForm } from "react-hook-form";
import type { z } from "zod";
import { mealsSchema } from "../day/schema";
import { ExerciseType } from "@prisma/client";
import { FormContainer } from "~/components/ui/formcontainer";
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
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import dayjs from "~/lib/dates";

const exerciseTypeOptions = Object.values(ExerciseType).map((type) => {
  return {
    label: type.charAt(0).toUpperCase() + type.substring(1),
    value: type.toLowerCase(),
  };
}) as Options[];

type Options = {
  label: string;
  value: string;
};

export const MealsForm = () => {
  const form = useForm<z.infer<typeof mealsSchema>>({
    resolver: zodResolver(mealsSchema),
    defaultValues: {
      time_of_day: dayjs().hour() + ":" + dayjs().minute(),
    },
  });

  const onSubmit = async (values: z.infer<typeof mealsSchema>) => {
    // create exercise action
    // format the time before you send it to the server
    console.log(values);
    // const date = datePickerFormater({ time: values.time_of_day });

    // values.time_of_day = date; // correctly formated isostring date
    // await createExerciseAction(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormContainer>
          <>
            <h5>Exercise</h5>
            <FormField
              control={form.control}
              name="meal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal</FormLabel>
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
              name="time_of_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Day</FormLabel>
                  <FormControl>
                    <TimePicker
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        </FormContainer>
      </form>
    </Form>
  );
};
