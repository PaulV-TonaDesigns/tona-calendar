/*
// components / calendar / PrintStyles.tsx
// Paul Valenzuela & OpenAI V1 
// Style CSS for ??
*/


export default function PrintStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      /* Page + print basics */
      @page {
  size: Letter landscape;
  margin: 0.25in;
}

      * { box-sizing: border-box; }
      html, body { height: 100%; }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Helvetica Neue", Helvetica, sans-serif;
        color: #111;
      }

      /* Hide UI controls when printing */
      @media print {
        .no-print { display: none !important; }
        .print-area { box-shadow: none !important; border: none !important; }
      }

      /* Watermark */
      .watermark {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        pointer-events: none;
        z-index: 0;
      }
      .watermark span{
        font-size: 64px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        opacity: 0.06;
        transform: rotate(-18deg);
        user-select: none;
        white-space: nowrap;
      }

      /* Ensure template content stays above watermark */
      .template-layer {
        position: relative;
        z-index: 1;
      }
    `}</style>
  );
}