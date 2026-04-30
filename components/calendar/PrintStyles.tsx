/*
// components / calendar / PrintStyles.tsx
// Paul Valenzuela & OpenAI V1 
// Style CSS for ??
*/

export default function PrintStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }

      @page {
        size: Letter landscape;
        margin: 0.25in;
      }

      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Helvetica Neue", Helvetica, sans-serif;
        color: #111;
      }

      /* Fixed letter-landscape minus 0.5in total margins = 10.5in × 8in */
      .print-area {
        width: 10.5in;
        height: 8in;
        overflow: hidden;
        position: relative;
        background: #fff;
      }

      /* On screen: scale down to fit viewport while keeping ratio */
      @media screen {
        body {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 24px;
          background: #e5e5e5;
        }
        .print-area {
          box-shadow: 0 4px 24px rgba(0,0,0,0.18);
          transform-origin: top center;
          /* Scale so 10.5in fits in the viewport */
          zoom: calc(min(100vw - 48px, 1008px) / 1008px);
        }
      }

      @media print {
        body { background: white; padding: 0; }
        .no-print { display: none !important; }
        .print-area { box-shadow: none !important; }
      }

      .watermark {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        pointer-events: none;
        z-index: 0;
      }
      .watermark span {
        font-size: 64px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        opacity: 0.06;
        transform: rotate(-18deg);
        user-select: none;
        white-space: nowrap;
      }

      .template-layer {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `}</style>
  );
}