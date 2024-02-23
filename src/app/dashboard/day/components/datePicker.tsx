"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export function DatePicker({ date }: { date: Date | string }) {
  // const [date, setDate] = React.useState<Date>();
  let day: Date;
  if (typeof date === "string") {
    day = dayjs(date).toDate();
  } else {
    day = date;
  }

  const router = useRouter();
  const onDateChange = (date: Date) => {
    router.push(`/dashboard/day/${dayjs(date).format("YYYY-MM-DD")}`);
    return date;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? dayjs(date).format("MMMM D, YYYY") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={day}
          // @ts-expect-error - onDateChange is not the best option for state change imo
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
