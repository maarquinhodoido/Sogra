import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/booking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId") ?? "";
  const professionalId = searchParams.get("professionalId") ?? "";
  const date = searchParams.get("date") ?? "";

  if (!serviceId || !professionalId || !date) {
    return NextResponse.json({ slots: [] }, { status: 400 });
  }

  const slots = await getAvailableSlots(serviceId, professionalId, date);
  return NextResponse.json({ slots });
}
