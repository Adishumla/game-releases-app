import { NextResponse } from "next/server";
import { format, subMonths, addMonths } from "date-fns";

export const runtime = "edge";

export async function GET() {
  try {
    const now = new Date();
    const monthsToWarm: string[] = [];

    // 3 months back
    for (let i = 3; i > 0; i--) {
      const pastDate = subMonths(now, i);
      monthsToWarm.push(format(pastDate, "yyyy-MM"));
    }

    // current month
    monthsToWarm.push(format(now, "yyyy-MM"));

    // 3 months forward
    for (let i = 1; i <= 3; i++) {
      const futureDate = addMonths(now, i);
      monthsToWarm.push(format(futureDate, "yyyy-MM"));
    }

    console.log("Warming up the following months:", monthsToWarm);

    for (const month of monthsToWarm) {
      const url = `https://game-releases-app.vercel.app/?month=${month}`;
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
  } catch (error) {
    console.error("Error warming up pages:", error);
    return NextResponse.json({ error: "Warmup failed" }, { status: 500 });
  }
}
