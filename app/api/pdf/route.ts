/*
app / api / pdf / route.ts
TonaSuite Calendar PDF Engine – Production Safe
*/

import { NextRequest } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // ✅ Reliable origin detection (works on Vercel)
    const origin = req.nextUrl.origin;

    const calendarUrl = new URL("/calendar", origin);
    searchParams.forEach((v, k) =>
      calendarUrl.searchParams.set(k, v)
    );

    const year = searchParams.get("y") ?? "2026";
    const monthIndex = Number(searchParams.get("m") ?? "0");
    const filename = `calendar-${year}-${String(monthIndex + 1).padStart(2, "0")}.pdf`;

    // ✅ Launch Chromium (Vercel compatible)
    const browser = await puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    try {
      const page = await browser.newPage();

      // Longer timeout for production
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
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in",
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
    // ✅ Return actual error so you can debug instead of silent 500
    return new Response(
      JSON.stringify({
        error: err?.message ?? String(err),
        stack: err?.stack ?? null,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}