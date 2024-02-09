import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../day/schema";
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
  {
    value: "good",
    label: "good",
  },
  { value: "restful", label: "restful" },
  { value: "peaceful", label: "peaceful" },
  { value: "deep", label: "deep" },
  { value: "uninterrupted", label: "uninterrupted" },
  { value: "satisfying", label: "satisfying" },
  { value: "rejuvenating", label: "rejuvenating" },
  { value: "refreshing", label: "refreshing" },
  { value: "calm", label: "calm" },
  { value: "comfortable", label: "comfortable" },
  { value: "sound", label: "sound" },
  { value: "healing", label: "healing" },
  { value: "relaxing", label: "relaxing" },
  { value: "serene", label: "serene" },
  { value: "consistent", label: "consistent" },
  { value: "blissful", label: "blissful" },
  { label: "restless", value: "restless" },
  { label: "troubled", value: "troubled" },
  { label: "light", value: "light" },
  { label: "fragmented", value: "fragmented" },
  { label: "unsatisfying", value: "unsatisfying" },
  { label: "draining", value: "draining" },
  { label: "exhausting", value: "exhausting" },
  { label: "aitated", value: "aitated" },
  { label: "uncomfortable", value: "uncomfortable" },
  { label: "disturbed", value: "disturbed" },
  { label: "harmful", value: "harmful" },
  { label: "tense", value: "tense" },
  { label: "chaotic", value: "chaotic" },
  { label: "irregular", value: "irregular" },
  { label: "miserable", value: "miserable" },
] as Option[];

interface Option {
  value: string;
  label: string;
}

export const PhysicalHealthForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  return (
    <FormContainer>
      <>
        <h5>Physical Health</h5>

        <FormField
          control={form.control}
          name="physical_health"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Physical Health Scale</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  max={10}
                  min={1}
                  placeholder="Physical Health 1-10"
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="physical_health_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Physical Health Description</FormLabel>
              <FormControl>
                <Select
                  closeMenuOnSelect={false}
                  isMulti
                  options={options}
                  onChange={(e) => field.onChange(e.map((c: any) => c.value))}
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

export const MentalHealthForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  return (
    <FormContainer>
      <>
        <h5>Mental Health</h5>

        <FormField
          control={form.control}
          name="mental_health"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mental Health Scale</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  max={10}
                  min={1}
                  placeholder="Physical Health 1-10"
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="physical_health_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mental Health Description</FormLabel>
              <FormControl>
                <Select
                  closeMenuOnSelect={false}
                  isMulti
                  options={options}
                  onChange={(e) => field.onChange(e.map((c: any) => c.value))}
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
