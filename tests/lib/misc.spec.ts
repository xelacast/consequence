import { test, describe, expect } from "vitest";

import { addCommasToNumber } from "~/lib/misc/addComma";
import { toCapitalize } from "~/lib/misc/useUpperCase";

describe("misc", () => {
  test("Add commas to numbers", () => {
    const million = addCommasToNumber(1000000);
    expect(million).toBe("1,000,000");
    const billion = addCommasToNumber(1000000000);
    expect(billion).toBe("1,000,000,000");
    const multiMillion = addCommasToNumber(123456789);
    expect(multiMillion).toBe("123,456,789");
  });
  test("Do not add a comma to this three digit number", () => {
    const number = addCommasToNumber(100);
    expect(number).toBe("100");
  });
});

describe("useUpperCase", () => {
  test("Capitalize a single word", () => {
    const capitalized = toCapitalize("hello");
    expect(capitalized).toBe("Hello");
  });
  test("Capitalize multiple words", () => {
    const capitalized = toCapitalize("hello world");
    expect(capitalized).toBe("Hello World");
  });
});
