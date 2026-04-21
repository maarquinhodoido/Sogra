"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { contactSchema, appointmentSchema } from "@/lib/validations";
import { limitRequest } from "@/lib/rate-limit";
import { normalizePhone, sanitizeMultiline, sanitizeText } from "@/lib/sanitize";
import { sendEmail } from "@/lib/mailer";
import { combineDateAndTime, generateManageToken, getAvailableSlots } from "@/lib/booking";

export type PublicFormState = {
  error?: string;
};

async function getRequestIp() {
  const requestHeaders = await headers();
  return requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

export async function submitContactAction(
  _previousState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  const ip = await getRequestIp();
  const rate = limitRequest(`contact:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });

  if (!rate.allowed) {
    return { error: "Limite temporário atingido. Tente novamente dentro de alguns minutos." };
  }

  const parsed = contactSchema.safeParse({
    name: sanitizeText(String(formData.get("name"))),
    email: sanitizeText(String(formData.get("email"))),
    phone: normalizePhone(String(formData.get("phone") ?? "")),
    subject: sanitizeText(String(formData.get("subject") ?? "")),
    message: sanitizeMultiline(String(formData.get("message"))),
    consent: formData.get("consent") === "on",
    website: sanitizeText(String(formData.get("website") ?? "")),
  });

  if (!parsed.success) {
    return { error: "Verifique os dados do formulário e tente novamente." };
  }

  const payload = parsed.data;

  try {
    await prisma.contactMessage.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        subject: payload.subject || null,
        message: payload.message,
        consent: payload.consent,
      },
    });
  } catch {
    console.info("Contact fallback", payload);
  }

  await sendEmail({
    to: process.env.ADMIN_EMAIL ?? "admin@luxenails.pt",
    subject: `Novo contacto de ${payload.name}`,
    html: `<p><strong>Nome:</strong> ${payload.name}</p><p><strong>Email:</strong> ${payload.email}</p><p><strong>Telefone:</strong> ${payload.phone || "-"}</p><p><strong>Assunto:</strong> ${payload.subject || "-"}</p><p>${payload.message}</p>`,
  });

  redirect("/contactos?sent=1");
}

export async function submitAppointmentAction(
  _previousState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  const ip = await getRequestIp();
  const rate = limitRequest(`booking:${ip}`, { limit: 6, windowMs: 15 * 60 * 1000 });

  if (!rate.allowed) {
    return { error: "Demasiadas tentativas de marcação. Aguarde alguns minutos." };
  }

  const parsed = appointmentSchema.safeParse({
    serviceId: sanitizeText(String(formData.get("serviceId"))),
    professionalId: sanitizeText(String(formData.get("professionalId"))),
    date: sanitizeText(String(formData.get("date"))),
    startTime: sanitizeText(String(formData.get("startTime"))),
    name: sanitizeText(String(formData.get("name"))),
    phone: normalizePhone(String(formData.get("phone"))),
    email: sanitizeText(String(formData.get("email"))),
    notes: sanitizeMultiline(String(formData.get("notes") ?? "")),
    consent: formData.get("consent") === "on",
    website: sanitizeText(String(formData.get("website") ?? "")),
  });

  if (!parsed.success) {
    return { error: "Preencha todos os campos obrigatórios corretamente." };
  }

  const payload = parsed.data;
  const availableSlots = await getAvailableSlots(
    payload.serviceId,
    payload.professionalId,
    payload.date,
  );

  if (!availableSlots.some((slot) => slot.value === payload.startTime)) {
    return { error: "Este horário deixou de estar disponível. Escolha outro horário." };
  }

  const startAt = combineDateAndTime(payload.date, payload.startTime);
  const manageToken = generateManageToken();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const service = await prisma.service.findUnique({ where: { id: payload.serviceId } });
    const professional = await prisma.professional.findUnique({
      where: { id: payload.professionalId },
    });

    if (!service || !professional) {
      return { error: "Serviço ou profissional inválido." };
    }

    const endAt = new Date(startAt.getTime() + service.durationMinutes * 60 * 1000);

    let customer = await prisma.customer.findFirst({
      where: {
        OR: [{ phone: payload.phone }, { email: payload.email }],
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
        },
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        customerId: customer.id,
        serviceId: service.id,
        professionalId: professional.id,
        startAt,
        endAt,
        status: "PENDING",
        clientNotes: payload.notes || null,
        manageToken,
      },
    });

    await sendEmail({
      to: payload.email,
      subject: "Confirmação da sua marcação",
      html: `<p>Olá ${payload.name},</p><p>A sua marcação foi registada com sucesso para <strong>${service.name}</strong> com <strong>${professional.name}</strong>.</p><p>Data e hora: ${startAt.toLocaleString("pt-PT")}</p><p>Pode gerir a sua marcação aqui: <a href="${siteUrl}/marcacoes/gerir/${manageToken}">${siteUrl}/marcacoes/gerir/${manageToken}</a></p>`,
    });

    redirect(`/marcacoes/sucesso?id=${appointment.id}&token=${manageToken}`);
  } catch {
    console.info("Booking fallback", payload);
    redirect(`/marcacoes/sucesso?demo=1&token=${manageToken}`);
  }
}

export async function cancelAppointmentByToken(token: string) {
  try {
    await prisma.appointment.update({
      where: { manageToken: token },
      data: { status: "CANCELED" },
    });
  } catch {
    return { error: "Não foi possível cancelar a marcação." };
  }

  redirect(`/marcacoes/gerir/${token}?status=canceled`);
}

export async function rescheduleAppointmentByToken(
  token: string,
  _previousState: PublicFormState,
  formData: FormData,
): Promise<PublicFormState> {
  const date = sanitizeText(String(formData.get("date")));
  const startTime = sanitizeText(String(formData.get("startTime")));

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { manageToken: token },
      include: { service: true },
    });

    if (!appointment) {
      return { error: "Marcação não encontrada." };
    }

    const slots = await getAvailableSlots(appointment.serviceId, appointment.professionalId, date);

    if (!slots.some((slot) => slot.value === startTime)) {
      return { error: "Horário indisponível. Escolha outra opção." };
    }

    const startAt = combineDateAndTime(date, startTime);
    const endAt = new Date(startAt.getTime() + appointment.service.durationMinutes * 60 * 1000);

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        startAt,
        endAt,
        status: "CONFIRMED",
      },
    });
  } catch {
    return { error: "Não foi possível reagendar neste momento." };
  }

  redirect(`/marcacoes/gerir/${token}?status=rescheduled`);
}
