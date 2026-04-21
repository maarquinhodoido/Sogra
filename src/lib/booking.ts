import crypto from "node:crypto";
import { addMinutes, endOfDay, isBefore, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import {
  demoBusinessHours,
  demoProfessionals,
  demoServices,
  demoSiteSettings,
  demoTimeOffs,
} from "@/lib/demo-data";

const SLOT_STEP = 15;

function parseTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function combineDateAndTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && endA > startB;
}

async function getBookingContext(serviceId: string, professionalId: string, date: string) {
  const targetDate = new Date(`${date}T00:00:00`);
  const weekday = targetDate.getDay();
  const fallbackService = demoServices.find((item) => item.id === serviceId) ?? demoServices[0];
  const fallbackProfessional =
    demoProfessionals.find((item) => item.id === professionalId) ?? demoProfessionals[0];

  try {
    const [service, professional, settings, hours, timeOffs, appointments] = await Promise.all([
      prisma.service.findUnique({ where: { id: serviceId } }),
      prisma.professional.findUnique({ where: { id: professionalId } }),
      prisma.siteSettings.findFirst(),
      prisma.businessHour.findMany({ where: { weekday } }),
      prisma.timeOff.findMany({
        where: {
          startsAt: { lte: endOfDay(targetDate) },
          endsAt: { gte: startOfDay(targetDate) },
        },
      }),
      prisma.appointment.findMany({
        where: {
          professionalId,
          startAt: { gte: startOfDay(targetDate), lte: endOfDay(targetDate) },
          status: { notIn: ["CANCELED", "NO_SHOW"] },
        },
        orderBy: { startAt: "asc" },
      }),
    ]);

    return {
      serviceDuration: service?.durationMinutes ?? fallbackService.durationMinutes,
      bufferMinutes: settings?.bookingBufferMinutes ?? demoSiteSettings.bookingBufferMinutes,
      maxAppointmentsPerDay: settings?.maxAppointmentsPerDay ?? demoSiteSettings.maxAppointmentsPerDay,
      hours,
      timeOffs,
      appointments,
      professionalSlug: professional?.slug ?? fallbackProfessional.slug,
    };
  } catch {
    return {
      serviceDuration: fallbackService.durationMinutes,
      bufferMinutes: demoSiteSettings.bookingBufferMinutes,
      maxAppointmentsPerDay: demoSiteSettings.maxAppointmentsPerDay,
      hours: demoBusinessHours
        .filter((item) => item.weekday === weekday)
        .map((item, index) => ({
          id: `fallback-${index}`,
          weekday: item.weekday,
          opensAt: item.opensAt,
          closesAt: item.closesAt,
          breakStart: item.breakStart ?? null,
          breakEnd: item.breakEnd ?? null,
          isClosed: item.isClosed ?? false,
          professionalId: null,
        })),
      timeOffs: demoTimeOffs
        .filter(
          (item) =>
            (!item.professionalSlug || item.professionalSlug === fallbackProfessional.slug) &&
            item.startsAt <= endOfDay(targetDate) &&
            item.endsAt >= startOfDay(targetDate),
        )
        .map((item, index) => ({
          id: `timeoff-${index}`,
          title: item.title,
          reason: item.reason ?? null,
          startsAt: item.startsAt,
          endsAt: item.endsAt,
          isAllDay: item.isAllDay ?? true,
          professionalId: null,
        })),
      appointments: [],
      professionalSlug: fallbackProfessional.slug,
    };
  }
}

export async function getAvailableSlots(serviceId: string, professionalId: string, date: string) {
  const context = await getBookingContext(serviceId, professionalId, date);
  const dayRows = context.hours.filter((row) => !row.professionalId);
  const selectedHours = dayRows[0];

  if (!selectedHours || selectedHours.isClosed) {
    return [];
  }

  if (context.appointments.length >= context.maxAppointmentsPerDay) {
    return [];
  }

  const openMinutes = parseTime(selectedHours.opensAt);
  const closeMinutes = parseTime(selectedHours.closesAt);
  const breakStart = selectedHours.breakStart ? parseTime(selectedHours.breakStart) : null;
  const breakEnd = selectedHours.breakEnd ? parseTime(selectedHours.breakEnd) : null;
  const slots: Array<{ value: string; label: string }> = [];
  const durationWithBuffer = context.serviceDuration + context.bufferMinutes;
  const now = new Date();

  for (
    let cursor = openMinutes;
    cursor + context.serviceDuration <= closeMinutes;
    cursor += SLOT_STEP
  ) {
    if (
      breakStart !== null &&
      breakEnd !== null &&
      cursor < breakEnd &&
      cursor + context.serviceDuration > breakStart
    ) {
      continue;
    }

    const slotStart = combineDateAndTime(date, formatTime(cursor));
    const slotEnd = addMinutes(slotStart, context.serviceDuration);
    const slotEndWithBuffer = addMinutes(slotStart, durationWithBuffer);

    if (isBefore(slotStart, now)) {
      continue;
    }

    const conflictsAppointments = context.appointments.some((appointment) => {
      const blockedStart = addMinutes(appointment.startAt, -context.bufferMinutes);
      const blockedEnd = addMinutes(appointment.endAt, context.bufferMinutes);
      return overlaps(slotStart, slotEndWithBuffer, blockedStart, blockedEnd);
    });

    if (conflictsAppointments) {
      continue;
    }

    const conflictsTimeOff = context.timeOffs.some((timeOff) =>
      overlaps(slotStart, slotEnd, timeOff.startsAt, timeOff.endsAt),
    );

    if (conflictsTimeOff) {
      continue;
    }

    slots.push({
      value: formatTime(cursor),
      label: formatTime(cursor),
    });
  }

  return slots;
}

export function generateManageToken() {
  return crypto.randomBytes(24).toString("hex");
}
