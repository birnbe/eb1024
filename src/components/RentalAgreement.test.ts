import { expect, test } from "vitest";
import { finalAmount } from "../utils";
import { ToolFullData } from "../interfaces";

const TOOL_DATA: ToolFullData[] = [
  {
    type: "chainsaw",
    code: "CHNS",
    brand: "Stihl",
    dailyCharge: 1.49,
    charges: {
      weekday: true,
      weekend: false,
      holiday: true,
    },
  },
  {
    type: "ladder",
    code: "LADW",
    brand: "Werner",
    dailyCharge: 1.99,
    charges: {
      weekday: true,
      weekend: true,
      holiday: false,
    },
  },
  {
    type: "jackhammer",
    code: "JAKD",
    brand: "DeWalt",
    dailyCharge: 2.99,
    charges: {
      weekday: true,
      weekend: false,
      holiday: false,
    },
  },
  {
    type: "jackhammer",
    code: "JAKR",
    brand: "Ridgid",
    dailyCharge: 2.99,
    charges: {
      weekday: true,
      weekend: false,
      holiday: false,
    },
  },
];
const tests = [
  {
    toolCode: "JAKR",
    checkout: new Date("9/3/15"),
    return: new Date("9/8/15"),
    discount: 101,
  },
  {
    toolCode: "LADW",
    checkout: new Date("7/2/20"),
    return: new Date("7/4/20"),
    discount: 10,
  },
  {
    toolCode: "CHNS",
    checkout: new Date("7/2/15"),
    return: new Date("7/7/15"),
    discount: 25,
  },
  {
    toolCode: "JAKD",
    checkout: new Date("9/3/15"),
    return: new Date("9/9/15"),
    discount: 0,
  },
  {
    toolCode: "JAKR",
    checkout: new Date("7/2/15"),
    return: new Date("7/11/15"),
    discount: 0,
  },
  {
    toolCode: "JAKR",
    checkout: new Date("7/2/20"),
    return: new Date("7/6/20"),
    discount: 50,
  },
];

test("Test 1: Discount above 100 throws Error", () => {
  expect(() =>
    finalAmount(
      tests[0].toolCode,
      tests[0].checkout,
      tests[0].return,
      tests[0].discount,
      TOOL_DATA
    )
  ).toThrowError("Discount");
});

test("Test 2", () => {
  expect(
    finalAmount(
      tests[1].toolCode,
      tests[1].checkout,
      tests[1].return,
      tests[1].discount,
      TOOL_DATA
    )
  ).toStrictEqual({
    preDiscountAmount: 1.99,
    discountAmount: 0.19899999999999998,
  });
});

test("Test 3", () => {
  expect(
    finalAmount(
      tests[2].toolCode,
      tests[2].checkout,
      tests[2].return,
      tests[2].discount,
      TOOL_DATA
    )
  ).toStrictEqual({
    preDiscountAmount: 4.47,
    discountAmount: 1.1175,
  });
});

test("Test 4", () => {
  expect(
    finalAmount(
      tests[3].toolCode,
      tests[3].checkout,
      tests[3].return,
      tests[3].discount,
      TOOL_DATA
    )
  ).toStrictEqual({
    preDiscountAmount: 8.97,
    discountAmount: 0,
  });
});

test("Test 5", () => {
  expect(
    finalAmount(
      tests[4].toolCode,
      tests[4].checkout,
      tests[4].return,
      tests[4].discount,
      TOOL_DATA
    )
  ).toStrictEqual({
    preDiscountAmount: 17.94,
    discountAmount: 0,
  });
});

test("Test 6", () => {
  expect(
    finalAmount(
      tests[5].toolCode,
      tests[5].checkout,
      tests[5].return,
      tests[5].discount,
      TOOL_DATA
    )
  ).toStrictEqual({
    preDiscountAmount: 2.99,
    discountAmount: 1.495,
  });
});
