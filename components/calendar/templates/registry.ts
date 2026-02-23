/*
// components / calendar / templates / registry.ts
// Paul Valenzuela & OpenAI V1 
// Registers Templates
*/

import MonthlyClassic from "./MonthlyClassic";
import WeeklyPlanner from "./WeeklyPlanner";
import MonthlyNotes from "./MonthlyNotes";

export type TemplateId = "monthly-classic" | "weekly-planner" | "monthly-notes";

export const TEMPLATES: {
  id: TemplateId;
  name: string;
  Component: any;
}[] = [
  { id: "monthly-classic", name: "Monthly Classic", Component: MonthlyClassic },
  { id: "weekly-planner", name: "Weekly Planner", Component: WeeklyPlanner },
  { id: "monthly-notes", name: "Monthly + Notes", Component: MonthlyNotes },
];

export function getTemplate(id: TemplateId) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}