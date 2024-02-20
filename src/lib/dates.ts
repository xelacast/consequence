import dayjs from "dayjs";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.tz.setDefault("America/Denver");

export default dayjs;

/**
 *
 * @param time "HH:MM" format
 * @returns ISOstring
 * @description: This function takes in a string from <TimePicker /> and returns an ISOstring
 */
export const datePickerFormater = ({ time }: { time: string | undefined }) => {
  let hours: string | undefined, minutes: string | undefined;
  if (time) [hours, minutes] = time.split(":");
  if (!hours || !minutes) return dayjs().toISOString();

  const int_hours = hours ? +hours : 0;
  const int_minutes = minutes ? +minutes : 0;

  const date = dayjs()
    .set("hours", int_hours)
    .set("minutes", int_minutes)
    .set("seconds", 0)
    .set("milliseconds", 0)
    .toISOString();
  return date;
};

export const currentDay = (date: string | Date) => {
  // get start of day MM/DD/YYYY
  const startOfDay = dayjs(date).startOf("day").toISOString();
  const endOfDay = dayjs(date).endOf("day").toISOString();

  // get end of day
  return { startOfDay, endOfDay };
};
