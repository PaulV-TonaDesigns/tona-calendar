/*
// lib / calendar / type.ts
// Paul Valenzuela & OpenAI V1 
// Switches between Sunday start week and Monday Start Week
*/


export type WeekStart = "sunday" | "monday";

export type CalendarCell = {
  date: Date | null;          // null = blank cell
  dayNumber: number | null;   // null = blank
  isToday: boolean;
  holidayLabel?: string;      // hook for later
};

export type CalendarWeek = CalendarCell[];

export type CalendarMonthData = {
  year: number;
  monthIndex: number; // 0-11
  monthName: string;
  weekdays: string[]; // already ordered based on weekStart
  weeks: CalendarWeek[]; // 5-6 weeks, each 7 cells
};