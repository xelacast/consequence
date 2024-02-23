import { type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { FormContainer } from "~/components/ui/formcontainer";
import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { type daySchema } from "./schema";

export const MiscForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof daySchema>>;
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
  form: UseFormReturn<z.infer<typeof daySchema>>;
}) => {
  return (
    <div className="flex gap-4 align-top">
      <FormField
        control={form.control}
        name="misc.meditation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
            <FormLabel>Meditation</FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export const IntermittentFastingForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof daySchema>>;
}) => {
  return (
    <div className="flex gap-4 align-top">
      <FormField
        control={form.control}
        name="misc.intermittent_fasting"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
            <FormLabel>Intermittent Fasting</FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export const ColdShowerForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof daySchema>>;
}) => {
  return (
    <div className="flex gap-4 align-top">
      <FormField
        control={form.control}
        name="misc.cold_shower"
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
