import { UseFormReturn } from "react-hook-form";
import { formSchema } from "./schema";
import { z } from "zod";
import { FormContainer } from "~/components/ui/formcontainer";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

export const MiscForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  return (
    <FormContainer>
      <>
        <h5>More Forms</h5>
        <MeditationForm form={form} />
        <IntermittentFastingForm form={form} />
        <ColdShowerForm form={form} />
      </>
    </FormContainer>
  );
};

export const MeditationForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  return (
    <FormField
      control={form.control}
      name="meditation_duration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Meditation</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="number"
              onChange={(event) => field.onChange(+event.target.value)}
              placeholder="Duration (min)"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const IntermittentFastingForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  return (
    <FormField
      control={form.control}
      name="intermittent_fasting_duration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Intermittent Fasting</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="IF" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="23-1">23-1</SelectItem>
              <SelectItem value="22-2">22-2</SelectItem>
              <SelectItem value="20-4">20-4</SelectItem>
              <SelectItem value="18-6">18-6</SelectItem>
              <SelectItem value="16-8">16-8</SelectItem>
              <SelectItem value="14-10">14-10</SelectItem>
              <SelectItem value="12-12">12-12</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const ColdShowerForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  return (
    <div className="flex gap-4 align-top">
      <FormField
        control={form.control}
        name="coldshower"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
            <FormLabel>Cold Shower</FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
