/*
// app / api / pdf / route.ts
// Paul Valenzuela & OpenAI V2 
// PDF Printing
// pupeteer version
*/

import { NextRequest } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";

export const runtime = "nodejs";

function getBaseUrl(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const baseUrl = getBaseUrl(req);
  const calendarUrl = new URL("/calendar", baseUrl);
  searchParams.forEach((v, k) => calendarUrl.searchParams.set(k, v));

  const year = searchParams.get("y") ?? "2026";
  const monthIndex = Number(searchParams.get("m") ?? "0");
  const filename = `calendar-${year}-${String(monthIndex + 1).padStart(2, "0")}.pdf`;

  const isProd = process.env.NODE_ENV === "production";

  const browser = await puppeteerCore.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: true,
});

  try {
    const page = await browser.newPage();

    await page.goto(calendarUrl.toString(), { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
  format: "Letter",
  landscape: true,
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
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
}