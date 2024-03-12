"use client";

import { ExerciseFormV2 } from "~/app/dashboard/day/components/forms/exercise";
import { HealthFormV2 } from "~/app/dashboard/day/components/forms/health";
import { MiscForm } from "~/app/dashboard/day/components/forms/misc";
import { SleepFormV2 } from "~/app/dashboard/day/components/forms/sleep";
import { ConfiguredSupplements } from "~/app/dashboard/day/components/forms/supplements";
import { type UseFormReturn, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Fragment } from "react";
import { createDayAction } from "~/lib/actions/dayAction";
import {
  DayProvider,
  useDayForm,
  useDayFormDispatch,
  type Node,
} from "~/lib/state/dayContext";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { toCapitalize } from "~/lib/misc/useUpperCase";
import { daySchema } from "~/lib/schemas/day";
import { StressForm } from "~/app/dashboard/day/components/forms/stress";
import { datePickerFormatter } from "~/lib/dates";

/**
 * @param date: string YYYY-MM-DD format
 * @returns all forms for the day
 * @description This is the container for all the forms for create day.
 * I was originally going to use separate forms for each section but I think
 * it would be better to have all the forms in one place. This might be a bit messy
 */

export type DayType = z.infer<typeof daySchema>;
export type DayFormType = UseFormReturn<DayType>;

export const CreateDayForms = ({ date }: { date: string }) => {
  const form = useForm<z.infer<typeof daySchema>>({
    resolver: zodResolver(daySchema),
    defaultValues: {
      date: date,
      stress: {
        time_of_day: datePickerFormatter({
          selectedDate: date,
          time: undefined,
        }),
      },
      misc: {
        cold_shower: false,
        meditation: false,
        intermittent_fasting: false,
      },
      supplements: { toggle: false },
    },
  });

  const onSubmit = async (values: z.infer<typeof daySchema>) => {
    await createDayAction(values);
  };

  return <DayFormContainer form={form} onSubmit={onSubmit} />;
};

/**
 *
 * @param param0
 * @returns forms for creating the day
 */
export const DayFormContainer = ({
  initialState,
  form,
  onSubmit,
}: {
  initialState?: Node[];
  form: UseFormReturn<z.infer<typeof daySchema>>;
  onSubmit: (values: z.infer<typeof daySchema>) => void;
}) => {
  return (
    <DayProvider initialState={initialState}>
      <div className="flex flex-row">
        <Form {...form}>
          <FormsToAdd className="my-4 ml-4 basis-80 rounded-md border p-4 md:min-w-80" />
          <div className="w-auto basis-auto">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 p-4 md:grid-cols-2">
                <SleepFormV2 />
                <HealthFormV2 />
                <StressForm />
                <MiscForm />
                <AddedForm />
                <Button className="" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Form>
      </div>
    </DayProvider>
  );
};

/**
 * @param className, form
 * @returns checkboxs for the forms to add to the context
 * @description This component is tightly coupled to the dayForm context. It is used to add forms to the context. It is also used to toggle the forms in the context. In the edit form page the DayProvider State is initialized with the appropriate forms based on state provided to the component. ~/app/src/dashboard/day/components/updateDay.tsx
 */

export const FormsToAdd = ({ className }: { className?: string }) => {
  // for the checkbox. Mainly used for the edit feature for initial state rendering
  const form = useFormContext<DayType>();
  const { supplements, exercise } = form.getValues();
  const checked = {
    supplements: supplements?.toggle,
    exercise: exercise?.toggle,
  };

  return (
    <section id="added-forms" className={cn(className)}>
      <div className={"flex flex-col gap-2"}>
        <FormCheckBox
          checked={checked.supplements}
          node={ConfiguredSupplements}
          formLabel="supplements"
        />
        <FormCheckBox
          checked={checked.exercise}
          node={ExerciseFormV2}
          formLabel="exercise"
        />
      </div>
    </section>
  );
};

type AllowedLabels = "misc" | "exercise" | "supplements";

/**
 *
 * @param node, form, name, formLabel, checked
 * @returns Checkbox for the form to add to the context
 * @description // Boiler plate for the form add checkbox
 */
const FormCheckBox = ({
  node,
  formLabel,
  checked = false,
}: {
  node: Node;
  formLabel: AllowedLabels;
  checked: boolean | undefined;
}) => {
  const dispatch = useDayFormDispatch();
  const Node = node;
  const form = useFormContext<DayType>();
  return (
    <div className="flex gap-2 align-top">
      <Checkbox
        id={formLabel}
        name={formLabel}
        defaultChecked={checked}
        onCheckedChange={(e) => {
          // @ts-expect-error need to fix this
          form.setValue(`${formLabel}.toggle`, e);
          if (e) dispatch({ node: Node, type: "ADD" });
          else {
            // need custom value setting since all schemas are different
            form.setValue(formLabel, undefined);
            dispatch({ node, type: "REMOVE" });
          }
        }}
      />
      <Label htmlFor={formLabel}>{toCapitalize(formLabel)}</Label>
    </div>
  );
};

/**
 *
 * @param form - UseFormReturn<z.infer<typeof daySchema>>
 * @returns Component UI of the forms that are added to the context
 * @description useFormContext<DayType> is an outer wrapper of this function
 */
// might need a ref to forward to
export const AddedForm = () => {
  const forms = useDayForm();
  return forms?.length
    ? forms.map(({ node, key }) => {
        const Form = node;
        return (
          <Fragment key={key}>
            <Form />
          </Fragment>
        );
      })
    : null;
};
