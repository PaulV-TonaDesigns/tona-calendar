import { Suspense } from "react";
import CalendarPageClient from "./calendar/CalendarPageClient";

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading calendar…</div>}>
      <CalendarPageClient />
    </Suspense>
  );
}