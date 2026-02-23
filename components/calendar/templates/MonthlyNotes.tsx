import { CalendarMonthData } from "@/lib/calendar/types";

export default function MonthlyNotes({
  data,
  footerText = "tonadesigns.com",
  notesTitle = "NOTES",
}: {
  data: CalendarMonthData;
  footerText?: string;
  notesTitle?: string;
}) {
  const weeks = [...data.weeks];
  while (weeks.length > 5 && weeks[weeks.length - 1].every((c) => c.dayNumber == null)) {
    weeks.pop();
  }

  const cellBase: React.CSSProperties = {
  boxSizing: "border-box",
  borderRight: "1px solid #111",
  padding: "10px",
};

  return (
    <div style={{ boxSizing: "border-box",width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between",boxSizing: "border-box", marginBottom: 12 }}>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "0.08em" }}>
          {data.monthName.toUpperCase()} {data.year}
        </div>
        <div style={{
  ...cellBase,
  padding: "10px",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
}}>
          MONTHLY + NOTES
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.38fr", gap: 14 }}>
        {/* Calendar */}
        <div style={{ boxSizing: "border-box", border: "3px solid #111" }}>
          {/* Weekdays row */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    borderBottom: "2px solid #111",
    boxSizing: "border-box",
  }}
>
  {data.weekdays.map((d, i) => (
    <div
      key={d}
      style={{
        boxSizing: "border-box",
        padding: "10px",
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        borderRight: i === 6 ? "none" : "1px solid #111",
        display: "flex",
        alignItems: "center"
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
                  minHeight: 680 / weeks.length,
                  borderBottom: wi === weeks.length - 1 ? "none" : "1px solid #111",
                  boxSizing: "border-box"
                }}
              >
                {week.map((cell, ci) => (
                  <div
  key={`${wi}-${ci}`}
  style={{
    position: "relative",
    borderRight: ci === 6 ? "none" : "1px solid #111",
    padding: "10px",
    boxSizing: "border-box",
  }}
>
                    {cell.dayNumber ? (
                      <>
                        <div style={{ position: "absolute", top: 10, right: 12, fontSize: 16, fontWeight: 800 }}>
                          {cell.dayNumber}
                        </div>
                        {cell.holidayLabel ? (
                          <div style={{ marginTop: 30, fontSize: 10, fontWeight: 700 }}>
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

        {/* Notes Sidebar */}
        <div style={{ border: "3px solid #111" }}>
          <div style={{ padding: "10px 12px", borderBottom: "2px solid #111" }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.18em" }}>
              {notesTitle}
            </div>
          </div>

          <div style={{ padding: 12, display: "grid", gap: 10 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ height: 34, borderBottom: "1px solid #111", opacity: 0.9 }} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 10, textAlign: "center", fontSize: 10, letterSpacing: "0.08em", opacity: 0.7 }}>
        {footerText}
      </div>
    </div>
  );
}