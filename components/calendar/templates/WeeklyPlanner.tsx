import { CalendarMonthData } from "@/lib/calendar/types";

export default function WeeklyPlanner({
  data,
  weekIndex = 0,
  footerText = "tonadesigns.com",
}: {
  data: CalendarMonthData;
  weekIndex?: number; // 0..5
  footerText?: string;
}) {
  const weeks = [...data.weeks];
  while (weeks.length > 5 && weeks[weeks.length - 1].every((c) => c.dayNumber == null)) {
    weeks.pop();
  }

  const safeWeekIndex = Math.min(Math.max(0, weekIndex), weeks.length - 1);
  const week = weeks[safeWeekIndex];

  // Week range label
  const firstDate = week.find((c) => c.date)?.date ?? null;
  const lastDate = [...week].reverse().find((c) => c.date)?.date ?? null;
  const range =
    firstDate && lastDate
      ? `${firstDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${lastDate.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`
      : `${data.monthName} ${data.year}`;

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "0.06em" }}>
          WEEKLY PLANNER
        </div>
        <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.8 }}>
          {range}
        </div>
      </div>

      {/* Days */}
      <div style={{ border: "3px solid #111" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "2px solid #111" }}>
          {data.weekdays.map((d, i) => (
            <div
              key={d}
              style={{
                padding: "10px 10px",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRight: i === 6 ? "none" : "1px solid #111",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", minHeight: 520 }}>
          {week.map((cell, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                borderRight: i === 6 ? "none" : "1px solid #111",
                padding: 12,
              }}
            >
              {cell.dayNumber ? (
                <>
                  <div style={{ position: "absolute", top: 10, right: 12, fontSize: 18, fontWeight: 800 }}>
                    {cell.dayNumber}
                  </div>
                  {cell.holidayLabel ? (
                    <div style={{ marginTop: 30, fontSize: 11, fontWeight: 700 }}>
                      {cell.holidayLabel}
                    </div>
                  ) : null}
                </>
              ) : null}
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