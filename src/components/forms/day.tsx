"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { SupplementForm } from "./day/supplements";

import { formSchema } from "./day/schema";
import { SleepForm } from "./day/sleep";
import { ExerciseForm } from "./day/exercise";
import { MiscForm } from "./day/misc";
import { MentalHealthForm, PhysicalHealthForm } from "./day/health";
import { createDay } from "~/server/actions/dayAction";

export function DayForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meditation_duration: 0,
      coldshower: false,
      intermittent_fasting: false,
      exercise_fasted: false,
      sleep_duration: 0,
      supplement_amount: 0,
      exercise_duration: 0,
      exercise_intensity: "",
      exercise_time_of_day: 0,
      exercise_type: "",
      supplement_name: "",
      supplement_time_of_day: 0,
      sleep_bed_time: "",
      sleep_quality: 0,
      sleep_wake_time: "",
      intermittent_fasting_duration: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // form values will be type safe and validated
    // send to server actions
    createDay(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container mx-auto justify-center space-x-8 space-y-8"
      >
        <div></div> {/** floating div to fix layout issue */}
        <SupplementForm form={form} />
        <SleepForm form={form} />
        <ExerciseForm form={form} />
        <MiscForm form={form} />
        <PhysicalHealthForm form={form} />
        <MentalHealthForm form={form} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
