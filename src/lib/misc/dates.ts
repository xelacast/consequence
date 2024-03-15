import dayjs from "dayjs";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(LocalizedFormat);

dayjs.tz.setDefault("America/Denver");

export default dayjs;

/**
 *
 * @param time "HH:MM" format and Date in isoString/string/date format
 * @returns Date
 * @description: This function takes in a string from <TimePicker /> and returns an ISOstring.
 * @considerationOfChange dont destructure components with undefined types just use normal prarameters.
 */
export const datePickerFormatter = ({
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

/**
 *
 * @param date objects
 * @returns current local time string in am/pm format
 */
export const currentTime = (date?: string | Date | null) => {
  return dayjs(date).format("LT");
};

/**
 *
 * @param month values expected are 0-11. January starting at 0 and December ending at 11
 * @description returns values of month +- 7 days to supply the calendar for the date picker with documented dates
 * @returns date types in {start, end} object format
 */
export const getCalendarDocumentedDates = (month: number | null) => {
  let currentMonth: dayjs.Dayjs;

  if (month) currentMonth = dayjs().set("month", month);
  else currentMonth = dayjs();

  const start = currentMonth.startOf("month").subtract(7, "days").toDate();
  const end = currentMonth.endOf("month").add(7, "days").toDate();

  return { start, end };
};