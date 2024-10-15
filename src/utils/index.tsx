/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  isSaturday,
  isSunday,
  setDay,
  getDay,
  subDays,
  eachDayOfInterval,
  isWeekend,
  isSameDay,
  isBefore,
  getYear,
  format,
} from "date-fns";
import type { Day } from "date-fns";
import { ChargeableDays, ToolFullData } from "../interfaces";

export function getIndependenceDay(year: number) {
  const independenceDay = new Date(year, 6, 4);
  const holiday = isSaturday(independenceDay)
    ? new Date(year, 6, 3)
    : isSunday(independenceDay)
    ? new Date(year, 6, 5)
    : independenceDay;
  return holiday;
}

export function getLaborDay(year: number) {
  const monday = 1;
  const beginningOfMonth = new Date(year, 8, 1);
  const theday = getDay(beginningOfMonth);
  return setDay(beginningOfMonth, monday, {
    weekStartsOn: theday as Day,
  });
}

export function billableDays(
  startDate: Date,
  endDate: Date,
  chargeableDays: ChargeableDays
) {
  // return date is not billable, so check day before end date
  let chargedDays = eachDayOfInterval({ start: startDate, end: subDays(endDate, 1) });
  if (!chargeableDays.weekend) chargedDays = chargedDays.filter((date) => !isWeekend(date));
  if (!chargeableDays.holiday)
    chargedDays = chargedDays.filter(
      (date) =>
        !isSameDay(date, getIndependenceDay(getYear(date))) &&
        !isSameDay(date, getLaborDay(getYear(date)))
    );
    return chargedDays.length;
}

export const formattedDate = (date: Date | null) => 
  date !== null ? format(date, "M/d/yy") : null;

export const getActiveTool = (toolCode: string, toolFullData: ToolFullData[]) => toolFullData.find((tool: ToolFullData) => tool.code === toolCode);

export const roundToNearestCent = (amount: number) => (Math.round(amount * 100) / 100).toFixed(2);

export function agreementValidation( startDate: Date,
  endDate: Date, discount: number) {
    if (isSameDay(startDate, endDate)) throw new Error("Checkout and return dates cannot be the same.");
    if (isBefore(endDate, startDate)) throw new Error("Return date cannot be before checkout date.");
    if (discount < 0 || discount > 100) throw new Error("Discount must be between 0 and 100.");

  }
export function finalAmount( toolCode: string, startDate: Date,
  endDate: Date, discount: number, toolFullData: ToolFullData[]) {

    // try {
      agreementValidation(startDate, endDate, discount);
      const activeTool = getActiveTool(toolCode, toolFullData);
      
      // toolFullData.find((tool: ToolFullData) => tool.code === toolCode);
      if (!activeTool?.charges) return;
      console.log('activeTool',activeTool)
      const chargedDays = billableDays(startDate, endDate, activeTool?.charges )
      console.log('chargedDays',chargedDays);
      console.log('dailyCharge',activeTool.dailyCharge)
      const preDiscount = chargedDays * activeTool.dailyCharge;

      console.log('preDiscount', preDiscount, roundToNearestCent(preDiscount))
      const discountAmount = chargedDays * activeTool.dailyCharge * (discount)/100
      const postDiscount = chargedDays * activeTool.dailyCharge * (100-discount)/100;
      console.log('discountAmount', discountAmount, roundToNearestCent(discountAmount))
      console.log('postDiscount', postDiscount, roundToNearestCent(postDiscount))

      return {
        preDiscountAmount: preDiscount,
        discountAmount: discountAmount,
      }
    // } catch (e) {
    //   console.log('error',e)
    // }


  }
