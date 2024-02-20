import { useForm } from "react-hook-form";
import type { z } from "zod";
import { stressSchema } from "../day/schema";
import { Input } from "~/components/ui/input";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { StressSymptoms } from "@prisma/client";
import TimePicker from "react-time-picker";
import dayjs, { datePickerFormater } from "~/lib/dates";
import { createStressAction } from "~/server/actions/stressAction";

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
  value: string;
  label: string;
}

export const StressForm = () => {
  const form = useForm<z.infer<typeof stressSchema>>({
    resolver: zodResolver(stressSchema),
    defaultValues: {
      rating: 0,
      notes: "",
      symptoms: [],
      time_of_day: dayjs().hour() + ":" + dayjs().minute(),
    },
  });
  const onSubmit = async (values: z.infer<typeof stressSchema>) => {
    // get and set timestamp
    const time = datePickerFormater({ time: values.time_of_day });
    values.time_of_day = time;

    console.log(values);
    await createStressAction(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormContainer>
          <>
            <h5>Stress</h5>
            <FormField
              control={form.control}
              name="rating"
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
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stress Symptoms</FormLabel>
                  <FormControl>
                    <Select
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
                    Select up to 5 Symptoms you have been exeriencing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      {...field}
                      maxLength={250}
                    />
                  </FormControl>
                  <FormDescription>
                    Jot down any more information you would like to be aware of.
                    Max characters: {field.value?.length}/250
                  </FormDescription>
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
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose the time you were feeling this way. Or leave blank
                    for current.
                  </FormDescription>
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
