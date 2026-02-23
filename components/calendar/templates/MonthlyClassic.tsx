/*
// components / calendar / templates / MonthlyClassic.tsx
// Paul Valenzuela & OpenAI V1 
// ???
*/


import { CalendarMonthData } from "@/lib/calendar/types";

export default function MonthlyClassic({
  data,
  footerText = "tonadesigns.com",
  sideLabel, // hook for later (TO DO)
}: {
  data: CalendarMonthData;
  footerText?: string;
  sideLabel?: string;
}) {
  // Optional: hide final empty week row
  const weeks = [...data.weeks];
  while (weeks.length > 5 && weeks[weeks.length - 1].every(c => c.dayNumber == null)) {
    weeks.pop();
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "0.08em" }}>
          {data.monthName.toUpperCase()} {data.year}
        </div>
        <div style={{ height: 2, background: "#111", marginTop: 6 }} />
        {/* Hook for later: side label like "TO DO" */}
        {sideLabel ? (
          <div style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase" }}>{sideLabel}</div>
        ) : null}
      </div>

      {/* Grid */}
      <div style={{ border: "3px solid #111" }}>
        {/* Weekdays row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "2px solid #111" }}>
          {data.weekdays.map((d) => (
            <div
              key={d}
              style={{
                padding: "8px 10px",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRight: "1px solid #111",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div style={{ display: "grid", gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}>
          {weeks.map((week, wi) => (
            <div
              key={wi}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                minHeight: 520 / weeks.length, // ensures consistent page fit
                borderBottom: wi === weeks.length - 1 ? "none" : "1px solid #111",
              }}
            >
              {week.map((cell, ci) => (
                <div
                  key={`${wi}-${ci}`}
                  style={{
                    position: "relative",
                    borderRight: ci === 6 ? "none" : "1px solid #111",
                    padding: 10,
                  }}
                >
                  {cell.dayNumber ? (
                    <>
                      <div style={{ position: "absolute", top: 10, left: 12, fontSize: 18, fontWeight: 700 }}>
                        {cell.dayNumber}
                      </div>

                      {/* Hook for later: holiday label */}
                      {cell.holidayLabel ? (
                        <div style={{ marginTop: 28, fontSize: 10, fontWeight: 600 }}>
                          {cell.holidayLabel}
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 10, textAlign: "center", fontSize: 10, letterSpacing: "0.08em", opacity: 0.7 }}>
        {footerText}
      </div>
    </div>
  );
}