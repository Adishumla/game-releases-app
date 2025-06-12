import { NextResponse } from "next/server";
import { format, subMonths, addMonths } from "date-fns";

export async function GET() {
  const baseUrl = process.env.VERCEL_URL;
  if (!baseUrl) {
    console.log("Skipping warmup - VERCEL_URL not set");
    return NextResponse.json({ status: "Warmup skipped" });
  }
  const now = new Date();
  const monthsToWarm: string[] = [];

  for (let i = 3; i > 0; i--) {
    const pastDate = subMonths(now, i);
    monthsToWarm.push(format(pastDate, "yyyy-MM"));
  }

  monthsToWarm.push(format(now, "yyyy-MM"));

  for (let i = 1; i <= 3; i++) {
    const futureDate = addMonths(now, i);
    monthsToWarm.push(format(futureDate, "yyyy-MM"));
  }

  console.log("Warming up the following months:", monthsToWarm);

  for (const month of monthsToWarm) {
    const url = `https://${baseUrl}/?month=${month}`;
    const res = await fetch(url, { cache: "no-cache" });

    if (!res.ok) {
      console.error(
        `Failed to warm up ${url}: ${res.status} ${res.statusText}`
      );
    } else {
      console.log(`Warmed up ${url} successfully`);
    }
  }

  return NextResponse.json({ status: "Warmed up pages" });
}
