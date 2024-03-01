"use client";

import { ExerciseFormV2 } from "~/components/forms/day/exercise";
import { HealthFormV2 } from "~/components/forms/day/health";
import { MiscForm } from "~/components/forms/day/misc";
import { SleepFormV2 } from "~/components/forms/day/sleep";
import { SupplementFormV2 } from "~/components/forms/day/supplements";
import { StressForm } from "./forms/day/stress";
import { type UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { daySchema } from "./forms/day/schema";
import dayjs from "dayjs";
import { Form } from "./ui/form";
import { Button } from "./ui/button";
import { Fragment } from "react";
import { createDayAction } from "~/lib/actions/dayAction";
import {
  type Context,
  DayProvider,
  useDayForm,
  useDayFormDispatch,
} from "~/lib/state/dayContext";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { cn } from "~/lib/utils";

/**
 * @param date: string YYYY-MM-DD format
 * @returns all forms for the day
 * @description This is the container for all the forms for create day.
 * I was originally going to use seperate forms for each section but I think
 * it would be better to have all the forms in one place. This might be a bit messy
 */

type DayForm = UseFormReturn<z.infer<typeof daySchema>>;

export const CreateDayForms = ({ date }: { date: string }) => {
  const form = useForm<z.infer<typeof daySchema>>({
    resolver: zodResolver(daySchema),
    defaultValues: {
      date: date,
      stress: {
        time_of_day: dayjs().hour() + ":" + dayjs().minute(),
      },
      misc: {
        cold_shower: false,
        meditation: false,
        intermittent_fasting: false,
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof daySchema>) => {
    await createDayAction(values);
  };

  return <DayFormContainer form={form} onSubmit={onSubmit} />;
};

export const DayFormContainer = ({
  initialState,
  form,
  onSubmit,
}: {
  initialState?: Context;
  form: UseFormReturn<z.infer<typeof daySchema>>;
  onSubmit: (values: z.infer<typeof daySchema>) => void;
}) => {
  return (
    <DayProvider initialState={initialState}>
      <div className="flex flex-row">
        <Form {...form}>
          <FormsToAdd
            className="my-4 ml-4 basis-80 rounded-md border p-4 md:min-w-80"
            form={form}
          />
          <div className="w-auto basis-auto">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-3 gap-4  p-4">
                <SleepFormV2 form={form} />
                <HealthFormV2 form={form} />
                <StressForm form={form} />
                <AddedForm form={form} />
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

export const FormsToAdd = ({
  className,
  form,
}: {
  className?: string;
  form: DayForm | UseFormReturn<z.infer<typeof daySchema>>;
}) => {
  const dispatch = useDayFormDispatch();
  // for the checkbox. Mainly used for the edit feature for intial state rendering
  const { supplements, exercise, misc } = form.getValues();
  const checked = {
    supps: supplements?.toggle ? true : false,
    misc: misc ? true : false, // fix this to check if any of the misc fields are true
    exercise: exercise?.toggle ? true : false,
  };

  return (
    <section id="added-forms" className={cn(className)}>
      <div className={"flex flex-col"}>
        <Label htmlFor="supplements">
          <Checkbox
            id="supplements"
            defaultChecked={checked.supps}
            onCheckedChange={(e: boolean) => {
              form.setValue("supplements.toggle", e);
              if (e) dispatch({ node: SupplementFormV2, type: "ADD" });
              else {
                form.setValue("supplements", undefined);
                dispatch({ node: SupplementFormV2, type: "REMOVE" });
              }
            }}
          />
          Supplements
        </Label>
        <Label htmlFor="exercise">
          <Checkbox
            id="exercise"
            defaultChecked={checked.exercise}
            onCheckedChange={(e: boolean) => {
              form.setValue("exercise.toggle", e);
              if (e) dispatch({ node: ExerciseFormV2, type: "ADD" });
              else {
                form.setValue("exercise", undefined);
                dispatch({ node: ExerciseFormV2, type: "REMOVE" });
              }
            }}
          />
          Exercise
        </Label>
        <Label htmlFor="misc">
          <Checkbox
            defaultChecked={
              form.getValues("misc") &&
              Object.values(form.getValues("misc")).filter(
                (s) => typeof s === "boolean" && s,
              ).length > 0
            }
            id="misc"
            onCheckedChange={(e: boolean) => {
              if (e) {
                dispatch({ node: MiscForm, type: "ADD" });
              } else {
                dispatch({ node: MiscForm, type: "REMOVE" });
              }
            }}
          />
          Misc Form
        </Label>
      </div>
    </section>
  );
};

// Boiler plate for the form add checkbox
// const FormCheckBox = ({
//   node,
//   form,
//   name,
//   formLabel,
// }: {
//   node: Node;
//   form: DayForm;
//   name: typeof form.control._names;
//   formLabel: keyof z.infer<typeof daySchema>; // cant use generics unless a pick/partial is used only for the optional fields
// }) => {
//   const dispatch = useDayFormDispatch();
//   const Node = node
//   return (
//     <Label htmlFor={name}>
//       <Checkbox
//         id={name}
//         name={name}
//         onCheckedChange={(e) => {
//           // form.setValue(`${formLabel}.toggle`, e); // * need a formLabel type to take a partial/pick of the form schema
//           if (e) dispatch({ node: Node, type: "ADD" });
//           else {
//             // need custom value setting since all schemas are different
//             form.setValue(formLabel, undefined);
//             dispatch({ node, type: "REMOVE" });
//           }
//         }}
//       />
//       {name}
//     </Label>
//   );
// };

// Component UI of the forms that are added to the context
export const AddedForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof daySchema>>;
}) => {
  const forms = useDayForm();
  return forms?.length
    ? forms.map(({ node, key }) => {
        const Form = node;
        return (
          <Fragment key={key}>
            <Form form={form} />
          </Fragment>
        );
      })
    : null;
};
