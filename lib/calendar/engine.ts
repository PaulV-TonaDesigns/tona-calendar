/*
// lib / calendar / engine.ts
// Paul Valenzuela & OpenAI V1 
// Calendar engine
*/

import { CalendarMonthData, CalendarCell, WeekStart } from "./types";
import { getUSHolidaysForMonth } from "./holidays/us";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const WEEKDAYS_SUN = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
const WEEKDAYS_MON = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];

function startIndexFor(weekStart: WeekStart) {
  return weekStart === "sunday" ? 0 : 1; // JS getDay(): 0=Sun..6=Sat
}



export function buildMonthData(
  year: number,
  monthIndex: number,
  weekStart: WeekStart = "sunday",
  opts?: { holidaysEnabled?: boolean }
): CalendarMonthData {
  const today = new Date();
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const firstOfMonth = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // normalize first weekday relative to weekStart
  const jsWeekday = firstOfMonth.getDay(); // 0=Sun..6=Sat
  const startIndex = startIndexFor(weekStart); // 0 for Sun-start, 1 for Mon-start
  const offset = (jsWeekday - startIndex + 7) % 7;

  // fill 6 weeks (42 cells) so layout never jumps; template can decide to hide last row if blank
  const totalCells = 42;

  const holidays = opts?.holidaysEnabled ? getUSHolidaysForMonth(year, monthIndex) : null;

  const cells: CalendarCell[] = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - offset + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      return { date: null, dayNumber: null, isToday: false };
    }
    const d = new Date(year, monthIndex, dayNum);

    return {
      date: d,
      dayNumber: dayNum,
      isToday: isSameDay(d, today),
      holidayLabel: holidays?.[dayNum],
    };
  });

  const weeks = [];
  for (let w = 0; w < 6; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7));
  }

  return {
    year,
    monthIndex,
    monthName: MONTH_NAMES[monthIndex],
    weekdays: weekStart === "sunday" ? WEEKDAYS_SUN : WEEKDAYS_MON,
    weeks,
  };
}