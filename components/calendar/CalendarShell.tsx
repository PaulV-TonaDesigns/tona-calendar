/*
// components / calendar / CalendarShell.tsx
// Paul Valenzuela & OpenAI V1 
// Holds the calendar?
*/

import PrintStyles from "./PrintStyles";

export default function CalendarShell({
  children,
  watermarkText = "tonadesigns.com",
}: {
  children: React.ReactNode;
  watermarkText?: string;
}) {
  return (
    <div className="print-area" style={{ position: "relative", background: "#fff" }}>
      <PrintStyles />
      <div className="watermark" aria-hidden="true">
        <span>{watermarkText}</span>
      </div>
      <div className="template-layer">{children}</div>
    </div>
  );
}