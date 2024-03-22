import { describe, expect, test } from "vitest";
import {
  currentDate,
  currentDay,
  currentTime,
  datePickerFormatter,
  getCalendarDocumentedDates,
} from "~/lib/misc/dates";

test("gets current date", () => {
  const date = currentDate("12-15-2021");
  expect(date).toBeInstanceOf(Date);
  expect(date).toEqual(new Date("12-15-2021"));
});

/**
 * Current Day Test
 * @description this function return the start of the day and the end of the day with the current time zone
 */
test("gets current day", () => {
  const { startOfDay, endOfDay } = currentDay("12-15-2021");
  expect(startOfDay).toBe("2021-12-15T07:00:00.000Z");
  expect(endOfDay).toBe("2021-12-16T06:59:59.999Z");
});

/**
 * Current Time Test
 * @description this function return the current time with the current time zone
 */
test("gets current time", () => {
  const time = currentTime("2021-12-15T12:00:00.000Z");
  expect(time).toBe("5:00 AM");
});

/**
 * Date Picker Formatter Test
 * @description this function return the date with the current time zone
 */
test("formats date picker", () => {
  const date = datePickerFormatter({
    time: "12:00",
    selectedDate: "2021-12-15",
  });
  expect(date).toBeInstanceOf(Date);
  expect(date).toEqual(new Date("2021-12-15T19:00:00.000Z"));
});

/**
 * Get Calendar Documented Dates Test
 * @description this function return the start and end of the month with the current time zone +/- 1 month
 */
describe("Get Calendar Documented Dates +/- 1 month", () => {
  test("gets calendar documented dates for November of 2024", () => {
    const { start, end } = getCalendarDocumentedDates(11, 2024);
    expect(start).toBeInstanceOf(Date);
    expect(end).toBeInstanceOf(Date);
    expect(start).toEqual(new Date("2024-11-01T06:00:00.000Z"));
    expect(end).toEqual(new Date("2025-02-01T06:59:59.999Z"));
  });
  test("gets calendar documented dates for April 2019", () => {
    const { start, end } = getCalendarDocumentedDates(3, 2019);
    expect(start).toBeInstanceOf(Date);
    expect(end).toBeInstanceOf(Date);
    expect(start.getMonth()).toEqual(2);
    expect(end.getMonth()).toEqual(4);
    expect(start.getFullYear()).toEqual(2019);
    expect(end.getFullYear()).toEqual(2019);
    expect(start.getDate()).toEqual(1);
    expect(end.getDate()).toEqual(30);
  });
});
