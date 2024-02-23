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
import { datePickerFormater } from "~/lib/dates";
import {
  DayProvider,
  useDayForm,
  useDayFormDispatch,
} from "~/lib/state/context/dayContext";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { cn } from "~/lib/utils";

/**
 *
 * @param date: string
 * @returns all forms for the day
 * @description This is the container for all the forms for create day.
 * I was originally going to use seperate forms for each section but I think
 * it would be better to have all the forms in one place. This might be a bit messy
 * ? How will I create modularity? The schema and forms aren't too hard to change
 */

type DayForm = UseFormReturn<z.infer<typeof daySchema>>;

export const DayForms = ({ date }: { date: string }) => {
  const form = useForm<z.infer<typeof daySchema>>({
    resolver: zodResolver(daySchema),
    defaultValues: {
      date: date,
      supplements: {
        supplements: [],
        measurement: { label: "mg", value: "mg" },
        amount: 0,
        time_taken: dayjs().hour() + ":" + dayjs().minute(),
      },
      misc: {
        cold_shower: false,
        meditation: false,
        intermittent_fasting: false,
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof daySchema>) => {
    // must set appropriate dates values for supplements, exercise, stress
    if (values.supplements?.supplements)
      values.supplements.supplements = values.supplements?.supplements?.map(
        (supp) => {
          return {
            ...supp,
            time_taken: datePickerFormater({ time: supp.time_taken }),
          };
        },
      );
    if (values?.exercise?.time_of_day)
      values.exercise.time_of_day = datePickerFormater({
        time: values.exercise.time_of_day,
      });
    if (values.stress.time_of_day)
      values.stress.time_of_day = datePickerFormater({
        time: values.stress.time_of_day,
      });

    console.log(values);
    const res = await createDayAction(values);
    console.log(res);
  };

  return (
    <DayProvider>
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

// Multiple components to add to this list based on an object/list to render to the client. ie. an add button on the UI to add a new form to the list
/**
 *
 * @contextWrapper DayFormProvider
 * @param className, form<daySchema>
 * @returns list of forms to add to the context
 */

const FormsToAdd = ({
  className,
  form,
}: {
  className?: string;
  form: DayForm;
}) => {
  const dispatch = useDayFormDispatch();
  return (
    <section id="added-forms" className={cn(className)}>
      <div className={"flex flex-col"}>
        {/* <FormCheckBox
          dispatch={dispatch}
          node={SupplementFormV2}
          form={form}
          name={"Supplements"}
          formLabel="supplements.supplements"
        /> */}
        <Label htmlFor="supplements">
          <Checkbox
            id="supplements"
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
//   dispatch,
//   node,
//   form,
//   name,
//   formLabel,
// }: {
//   dispatch: Reducer;
//   node: Node;
//   form: DayForm;
//   name: string;
//   formLabel: keyof z.infer<typeof daySchema>; // cant use generics unless a pick/partial is used only for the optional fields
// }) => {
//   return (
//     <Label htmlFor={name}>
//       <Checkbox
//         id={name}
//         onCheckedChange={(e) => {
//           // form.setValue(`${formLabel}.toggle`, e); // * need a formLabel type to take a partial/pick of the form schema
//           if (e) dispatch({ node, type: "ADD" });
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
const AddedForm = ({
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
