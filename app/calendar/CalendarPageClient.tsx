/*
// app / calendar / CalendarPageClient.tsx
// Paul Valenzuela & OpenAI V1.1 
// Builds Calendar:  
// -- Reads defaults
// -- Provides dropdown UI
// -- Updates preview instantly
// -- Adds Download PDF
// -- Leaves holidays as a hook
*/

"use client";

import { useMemo, useState } from "react";
import CalendarShell from "@/components/calendar/CalendarShell";
import { buildMonthData } from "@/lib/calendar/engine";
import { WeekStart } from "@/lib/calendar/types";
import { getTemplate, TemplateId, TEMPLATES } from "@/components/calendar/templates/registry";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const MONTHS = Array.from({ length: 12 }).map((_, i) =>
  new Date(2000, i, 1).toLocaleString(undefined, { month: "long" })
);

function clampMonth(m: number) {
  if (Number.isNaN(m)) return 0;
  return Math.min(11, Math.max(0, m));
}


const COLORS = {
  teal: "#14b8a6",
  navy: "#0f172a",
  gray900: "#111827",
  gray700: "#374151",
  gray500: "#6b7280",
  gray200: "#e5e7eb",
  gray100: "#f3f4f6",
  white: "#ffffff",
};

const controlStyle: React.CSSProperties = {
  height: 36,
  padding: "0 12px",
  borderRadius: 10,
  border: `1px solid ${COLORS.gray200}`,
  background: COLORS.white,
  color: COLORS.gray900,
  fontSize: 14,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  color: COLORS.gray700,
  fontSize: 13,
  fontWeight: 600,
};

function btnBase(): React.CSSProperties {
  return {
    height: 36,
    padding: "0 14px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    userSelect: "none",
    whiteSpace: "nowrap",
  };
}

const btnPrimary: React.CSSProperties = {
  ...btnBase(),
  background: COLORS.teal,
  color: COLORS.white,
  boxShadow: "0 10px 18px rgba(20,184,166,0.22)",
};

const btnSecondary: React.CSSProperties = {
  ...btnBase(),
  background: COLORS.navy,
  color: COLORS.white,
  boxShadow: "0 10px 18px rgba(15,23,42,0.18)",
};

const btnTertiary: React.CSSProperties = {
  ...btnBase(),
  background: COLORS.gray100,
  color: COLORS.gray900,
  border: `1px solid ${COLORS.gray200}`,
};

const btnGhost: React.CSSProperties = {
  ...btnBase(),
  background: "transparent",
  color: COLORS.gray700,
  border: `1px solid ${COLORS.gray200}`,
};

export default function CalendarPageClient() {
  const now = new Date();
  const router = useRouter();
  const sp = useSearchParams();


  // 1) Read from URL (shareable state)
  const initialYear = Number(sp.get("y") ?? now.getFullYear());
  const initialMonthIndex = clampMonth(Number(sp.get("m") ?? now.getMonth()));
  const initialWeekStart = (sp.get("ws") === "monday" ? "monday" : "sunday") as WeekStart;
  const initialTemplateId = ((sp.get("t") as TemplateId) ?? "monthly-classic");
  const initialHol = sp.get("hol") === "1";

  const [templateId, setTemplateId] = useState<TemplateId>(
    TEMPLATES.some(t => t.id === initialTemplateId) ? initialTemplateId : "monthly-classic"
  );
  const [monthIndex, setMonthIndex] = useState<number>(initialMonthIndex);
  const [year, setYear] = useState<number>(initialYear);
  const [weekStart, setWeekStart] = useState<WeekStart>(initialWeekStart);
  const [holidaysEnabled, setHolidaysEnabled] = useState<boolean>(initialHol);
  const initialWeekIndex = Number(sp.get("w") ?? "0");
const [weekIndex, setWeekIndex] = useState<number>(Number.isFinite(initialWeekIndex) ? initialWeekIndex : 0);

  // 2) Push state -> URL (no reload)
  useEffect(() => {
    const qs = new URLSearchParams({
  y: String(year),
  m: String(monthIndex),
  ws: weekStart,
  t: templateId,
  hol: holidaysEnabled ? "1" : "0",
  w: String(weekIndex),
});

    router.replace(`/calendar?${qs.toString()}`, { scroll: false });
  }, [year, monthIndex, weekStart, templateId, holidaysEnabled, router]);

  const data = useMemo(() => {
    const d = buildMonthData(year, monthIndex, weekStart, { holidaysEnabled });
    return d;
  }, [year, monthIndex, weekStart, holidaysEnabled]);

  const template = getTemplate(templateId);
  const TemplateComponent = template.Component;

  const pdfHref = useMemo(() => {
    const qs = new URLSearchParams({
      y: String(year),
      m: String(monthIndex),
      ws: weekStart,
      t: templateId,
      hol: holidaysEnabled ? "1" : "0",
    });
    return `/api/pdf?${qs.toString()}`;
  }, [year, monthIndex, weekStart, templateId, holidaysEnabled]);

  // (Keep your return JSX exactly as you have it, using setYear/setMonthIndex/etc.)
  // Optional: add a “Copy link” button (below).
  return (
    <div style={{ minHeight: "100vh", background: "#f6f6f7" }}>
      <style>{`
  button:hover { transform: translateY(-1px); }
  button:active { transform: translateY(0px); box-shadow: none !important; }
  select:focus, input:focus { border-color: rgba(20,184,166,0.55) !important; box-shadow: 0 0 0 4px rgba(20,184,166,0.12); }
`}</style>
      {/* Top controls bar */}
      <div
        className="no-print"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e5e5e7",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 16px",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 700, letterSpacing: "0.02em" }}>
            Tona Calendar
          </div>

          <div style={{ width: 1, height: 22, background: "#e5e5e7", margin: "0 6px" }} />

          {/* Template */}
          <label style={labelStyle}>
  Template
  <select
    value={templateId}
    onChange={(e) => setTemplateId(e.target.value as TemplateId)}
    style={controlStyle}
  >
    {TEMPLATES.map((t) => (
      <option key={t.id} value={t.id}>
        {t.name}
      </option>
    ))}
  </select>
</label>

          {/* Month */}
         <label style={labelStyle}>
  Month
  <select
    value={monthIndex}
    onChange={(e) => setMonthIndex(parseInt(e.target.value, 10))}
    style={controlStyle}
  >
    {MONTHS.map((m, i) => (
      <option key={m} value={i}>
        {m}
      </option>
    ))}
  </select>
</label>

          {/* Year */}
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            Year
            <input
  type="number"
  value={year}
  onChange={(e) => setYear(parseInt(e.target.value, 10) || now.getFullYear())}
  style={{ ...controlStyle, width: 110 }}
/>
          </label>
          <button
  type="button"
  onClick={() => {
    const n = new Date();
    setYear(n.getFullYear());
    setMonthIndex(n.getMonth());
  }}
  style={btnGhost}
>
  Today
</button>
{templateId === "weekly-planner" ? (
  <label style={labelStyle}>
    Week
    <select
      value={weekIndex}
      onChange={(e) => setWeekIndex(parseInt(e.target.value, 10))}
      style={controlStyle}
    >
      {data.weeks
        .filter((w) => w.some((c) => c.dayNumber != null))
        .map((_, i) => (
          <option key={i} value={i}>
            Week {i + 1}
          </option>
        ))}
    </select>
  </label>
) : null}

          {/* Week start */}
          <label style={labelStyle}>
  Week starts
  <select
    value={weekStart}
    onChange={(e) => setWeekStart(e.target.value as WeekStart)}
    style={controlStyle}
  >
    <option value="sunday">Sunday</option>
    <option value="monday">Monday</option>
  </select>
</label>

          {/* Holidays */}
          {/* Holidays */}
<label style={{ ...labelStyle, gap: 10 }}>
  <input
    type="checkbox"
    checked={holidaysEnabled}
    onChange={(e) => setHolidaysEnabled(e.target.checked)}
    style={{ width: 16, height: 16, accentColor: COLORS.teal }}
  />
  Holidays
</label>

          {/* Actions */}

          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
  <button
    type="button"
    onClick={async () => {
      await navigator.clipboard.writeText(window.location.href);
    }}
    style={btnTertiary}
  >
    Copy Link
  </button>

  <button onClick={() => window.print()} style={btnSecondary}>
    Print
  </button>

  <a href={pdfHref} style={{ textDecoration: "none" }}>
    <button type="button" style={btnPrimary}>
      Download PDF
    </button>
  </a>
</div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
          }}
        >
          {/* Preview card */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e5e7",
              borderRadius: 14,
              padding: 14,
              boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
            }}
          >
            <CalendarShell watermarkText="tonadesigns.com">
  <TemplateComponent
    data={data}
    weekIndex={templateId === "weekly-planner" ? weekIndex : undefined}
    footerText="tonadesigns.com"
  />
</CalendarShell>
          </div>

          {/* Optional: future templates list / upsell panel */}
          {/* Keep empty for V1 to stay clean */}
        </div>
      </div>
    </div>
  );

}