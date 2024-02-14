import { type UseFormReturn, useForm } from "react-hook-form";
import type { z } from "zod";
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
import { Button } from "~/components/ui/button";
import { createMiscAction } from "~/server/actions/miscAction";
import { miscSchema } from "./schema";

export const MiscForm = () => {
  const form = useForm<z.infer<typeof miscSchema>>({
    resolver: zodResolver(miscSchema),
  });

  const onSubmit = async (values: z.infer<typeof miscSchema>) => {
    await createMiscAction(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormContainer>
          <>
            <h5>More Forms</h5>
            <MeditationForm form={form} />
            <IntermittentFastingForm form={form} />
            <ColdShowerForm form={form} />
            <Button type="submit">Submit</Button>
          </>
        </FormContainer>
      </form>
    </Form>
  );
};

export const MeditationForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof miscSchema>>;
}) => {
  return (
    <div className="flex gap-4 align-top">
      <FormField
        control={form.control}
        name="meditation"
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
  form: UseFormReturn<z.infer<typeof miscSchema>>;
}) => {
  return (
    <div className="flex gap-4 align-top">
      <FormField
        control={form.control}
        name="intermittent_fasting"
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
  form: UseFormReturn<z.infer<typeof miscSchema>>;
}) => {
  return (
    <div className="flex gap-4 align-top">
      <FormField
        control={form.control}
        name="cold_shower"
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
