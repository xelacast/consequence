"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
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
  let day: Date;
  if (typeof date === "string") {
    day = dayjs(date).toDate();
  } else {
    day = date;
  }

  const router = useRouter();

  // TODO Wrap the components in a provider to remove the date from the url unless it is being created or edited. Selected dates dont need this?
  const onDateChange = (date: Date) => {
    router.push(`/dashboard/day/${dayjs(date).format("YYYY-MM-DD")}`);
    return date;
  };

  const [month, setMonth] = React.useState(dayjs(date).toDate());
  const [dates, setDates] = React.useState<Date[]>([]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["documentedDates", month, dates],
    queryFn: async () => {
      const response = await fetch(`/api/day?month=${dayjs(month).month()}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json() as Promise<{ days: string[] }>;
    },
  });

  React.useEffect(() => {
    if (data && data.days.length > 0) {
      // filter dates out if they already exist
      const newDates = dates.filter(
        (date) => !data.days.includes(dayjs(date).toISOString()),
      );
      setDates([...newDates, ...data.days.map((date) => new Date(date))]);
    }
  }, [data]);

  const documentedStyle = {
    color: "black",
    backgroundColor: "#BDFFBE",
  };

  // TODO override current day and selected day hovered day css format

  // the calendar wont be dependant on the green how can we load this without spinning the calendar?

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
          modifiers={{
            documented: dates ?? [],
          }}
          modifiersStyles={{ documented: documentedStyle }}
          month={month}
          onMonthChange={setMonth}
        />
      </PopoverContent>
    </Popover>
  );
}
