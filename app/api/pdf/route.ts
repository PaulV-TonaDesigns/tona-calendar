/*
app / api / pdf / route.ts
TonaSuite Calendar PDF Engine – Production Safe
*/

import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const origin = req.nextUrl.origin;

    const calendarUrl = new URL("/calendar", origin);
    searchParams.forEach((v, k) => calendarUrl.searchParams.set(k, v));

    const year = searchParams.get("y") ?? "2026";
    const monthIndex = Number(searchParams.get("m") ?? "0");
    const filename = `calendar-${year}-${String(monthIndex + 1).padStart(2, "0")}.pdf`;

    const isProduction = process.env.NODE_ENV === "production";

    let browser;

    if (isProduction) {
      // Vercel/Lambda: use sparticuz compressed Chromium
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteerCore = (await import("puppeteer-core")).default;
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      // Local dev: use full puppeteer which ships its own Chromium
      const puppeteer = (await import("puppeteer")).default;
      browser = await puppeteer.launch({ headless: true });
    }

    try {
      const page = await browser.newPage();

      await page.goto(calendarUrl.toString(), {
        waitUntil: "networkidle0",
        timeout: 60000,
      });

      const pdfBuffer = await page.pdf({
        format: "Letter",
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "0.25in",
          right: "0.25in",
          bottom: "0.25in",
          left: "0.25in",
        },
      });

      return new Response(Buffer.from(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      });
    } finally {
      await browser.close();
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? String(err), stack: err?.stack ?? null }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}