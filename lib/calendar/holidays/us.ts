// us.ts

export type Holiday = { monthIndex: number; day: number; label: string };

function nthWeekdayOfMonth(year: number, monthIndex: number, weekday: number, nth: number) {
  // weekday: 0=Sun..6=Sat
  const first = new Date(year, monthIndex, 1);
  const firstWeekday = first.getDay();
  const delta = (weekday - firstWeekday + 7) % 7;
  const day = 1 + delta + (nth - 1) * 7;
  return new Date(year, monthIndex, day);
}

function lastWeekdayOfMonth(year: number, monthIndex: number, weekday: number) {
  const last = new Date(year, monthIndex + 1, 0);
  const delta = (last.getDay() - weekday + 7) % 7;
  return new Date(year, monthIndex, last.getDate() - delta);
}

export function getUSHolidaysForMonth(year: number, monthIndex: number): Record<number, string> {
  // returns map dayNumber -> label
  const map: Record<number, string> = {};

  // Fixed-date (Federal + common)
  const fixed: Holiday[] = [
    { monthIndex: 0, day: 1, label: "New Year’s Day" },
    { monthIndex: 6, day: 4, label: "Independence Day" },
    { monthIndex: 10, day: 11, label: "Veterans Day" },
    { monthIndex: 11, day: 25, label: "Christmas Day" },
  ];

  for (const h of fixed) {
    if (h.monthIndex === monthIndex) map[h.day] = h.label;
  }

  // Nth weekday holidays (Federal)
  // MLK Day: 3rd Monday in Jan
  if (monthIndex === 0) map[nthWeekdayOfMonth(year, 0, 1, 3).getDate()] = "MLK Day";
  // Presidents Day: 3rd Monday in Feb
  if (monthIndex === 1) map[nthWeekdayOfMonth(year, 1, 1, 3).getDate()] = "Presidents Day";
  // Memorial Day: last Monday in May
  if (monthIndex === 4) map[lastWeekdayOfMonth(year, 4, 1).getDate()] = "Memorial Day";
  // Labor Day: 1st Monday in Sep
  if (monthIndex === 8) map[nthWeekdayOfMonth(year, 8, 1, 1).getDate()] = "Labor Day";
  // Columbus Day: 2nd Monday in Oct
  if (monthIndex === 9) map[nthWeekdayOfMonth(year, 9, 1, 2).getDate()] = "Columbus Day";
  // Thanksgiving: 4th Thursday in Nov
  if (monthIndex === 10) map[nthWeekdayOfMonth(year, 10, 4, 4).getDate()] = "Thanksgiving";

  return map;
}