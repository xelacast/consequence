import dayjs from "dayjs";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.tz.setDefault("America/Denver");

export default dayjs;

/**
 *
 * @param time "HH:MM" format and Date in isoString/string/date format
 * @returns Date
 * @description: This function takes in a string from <TimePicker /> and returns an ISOstring
 */
export const datePickerFormater = ({
  time,
  selectedDate,
}: {
  time: string | null | undefined;
  selectedDate: string | Date | undefined;
}) => {
  let hours: string | undefined, minutes: string | undefined;
  if (typeof time === "string") [hours, minutes] = time.split(":");

  const int_hours = hours ? +hours : 0;
  const int_minutes = minutes ? +minutes : 0;

  const date = dayjs(selectedDate)
    .set("hours", int_hours)
    .set("minutes", int_minutes)
    .set("seconds", 0)
    .set("milliseconds", 0)
    .toDate();
  return date;
};

export const currentDay = (date: string | Date | undefined) => {
  // get start of day MM/DD/YYYY
  const startOfDay = dayjs(date).startOf("day").toISOString();
  const endOfDay = dayjs(date).endOf("day").toISOString();

  // get end of day
  return { startOfDay, endOfDay };
};

export const currentDate = (date?: string | Date) => {
  return dayjs(date).toDate();
};

export const twentyFourHourClock = ({
  time,
}: {
  time?: Date | string | null;
}) => {
  const date = dayjs(time);
  const minutes = date.minute();
  const hours = date.hour();

  return `${hours}:${minutes}`;
};
