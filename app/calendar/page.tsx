/*
// app / calendar/ page.tsx
// Paul Valenzuela & OpenAI V1 
// Generates Calendar Object
*/

import CalendarPageClient from "./CalendarPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar Generator | Tona Designs",
  description: "Choose a template, month, year, and export a clean printable PDF calendar.",
};

export default function Page() {
  return <CalendarPageClient />;
}