import { useForm } from "react-hook-form";
import type { z } from "zod";
import { sleepSchema } from "../day/schema";
import { Input } from "~/components/ui/input";
import { FormContainer } from "~/components/ui/formcontainer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSleepAction } from "~/server/actions/sleepAction";
import { Button } from "~/components/ui/button";

const options = [
  { value: "good", label: "Good" },
  { value: "bad", label: "Bad" },
] as Options[];

interface Options {
  value: string;
  label: string;
}

export const SleepFormV2 = () => {
  const form = useForm<z.infer<typeof sleepSchema>>({
    resolver: zodResolver(sleepSchema),
    defaultValues: {
      hours: 0,
      minutes: 0,
      quality: [""],
      rating: 0,
    },
  });
  const onSubmit = async (values: z.infer<typeof sleepSchema>) => {
    await createSleepAction(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormContainer>
          <>
            <h5>Sleep Quality and Duration</h5>
            <FormField
              control={form.control}
              name="rating"
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
              name="quality"
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
              name="hours"
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
            <Button type="submit">Submit</Button>
          </>
        </FormContainer>
      </form>
    </Form>
  );
};
