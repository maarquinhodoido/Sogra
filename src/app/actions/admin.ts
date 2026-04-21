"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validations";
import { createAdminSession, destroyAdminSession, requireAdminSession, verifyPassword, hashPassword } from "@/lib/auth";
import { limitRequest } from "@/lib/rate-limit";
import { normalizePhone, sanitizeMultiline, sanitizeText, slugify } from "@/lib/sanitize";
import { saveUploadedFile } from "@/lib/uploads";

export type AdminActionState = {
  error?: string;
};

function boolFromForm(formData: FormData, field: string) {
  return formData.get(field) === "on";
}

function numberFromForm(formData: FormData, field: string, fallback = 0) {
  const value = Number(formData.get(field));
  return Number.isFinite(value) ? value : fallback;
}

function decimalOrNull(formData: FormData, field: string) {
  const value = sanitizeText(String(formData.get(field) ?? ""));
  return value ? Number(value) : null;
}

function revalidateAll(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

async function buildUniqueProfessionalSlug(baseSlug: string, currentId?: string) {
  const normalizedBase = baseSlug || `profissional-${Date.now()}`;

  let candidate = normalizedBase;
  let suffix = 1;

  while (true) {
    const existing = await prisma.professional.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === currentId) {
      return candidate;
    }

    candidate = `${normalizedBase}-${suffix}`;
    suffix += 1;
  }
}

export async function loginAdminAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rate = limitRequest(`admin-login:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });

  if (!rate.allowed) {
    return { error: "Demasiadas tentativas de login. Aguarde alguns minutos." };
  }

  const parsed = adminLoginSchema.safeParse({
    email: sanitizeText(String(formData.get("email"))),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { error: "Credenciais inválidas." };
  }

  const { email, password } = parsed.data;

  let user = null;

  try {
    user = await prisma.adminUser.findUnique({ where: { email } });
  } catch {
    user = null;
  }

  if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Email ou password incorretos." };
  }

  await createAdminSession({ id: user.id, email: user.email, name: user.name, role: user.role });

  try {
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
  } catch {
    // Ignore login timestamp errors.
  }

  redirect("/admin");
}

export async function logoutAdminAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdminSession();

  const existing = await prisma.siteSettings.findFirst();
  const data = {
    businessName: sanitizeText(String(formData.get("businessName"))),
    tagline: sanitizeText(String(formData.get("tagline"))),
    businessEmail: sanitizeText(String(formData.get("businessEmail"))),
    bookingEmail: sanitizeText(String(formData.get("bookingEmail"))),
    phone: normalizePhone(String(formData.get("phone"))),
    whatsapp: normalizePhone(String(formData.get("whatsapp"))),
    address: sanitizeText(String(formData.get("address"))),
    city: sanitizeText(String(formData.get("city"))),
    postalCode: sanitizeText(String(formData.get("postalCode"))),
    googleMapsUrl: sanitizeText(String(formData.get("googleMapsUrl"))),
    instagramUrl: sanitizeText(String(formData.get("instagramUrl"))),
    facebookUrl: sanitizeText(String(formData.get("facebookUrl"))),
    tiktokUrl: sanitizeText(String(formData.get("tiktokUrl"))),
    heroImageUrl: sanitizeText(String(formData.get("heroImageUrl"))),
    logoUrl: sanitizeText(String(formData.get("logoUrl"))),
    faviconUrl: sanitizeText(String(formData.get("faviconUrl"))),
    bookingBufferMinutes: numberFromForm(formData, "bookingBufferMinutes", 15),
    maxAppointmentsPerDay: numberFromForm(formData, "maxAppointmentsPerDay", 12),
    allowDeposits: boolFromForm(formData, "allowDeposits"),
    depositAmount: decimalOrNull(formData, "depositAmount"),
    loyaltyEnabled: boolFromForm(formData, "loyaltyEnabled"),
    couponsEnabled: boolFromForm(formData, "couponsEnabled"),
    metaTitle: sanitizeText(String(formData.get("metaTitle"))),
    metaDescription: sanitizeMultiline(String(formData.get("metaDescription"))),
    metaKeywords: sanitizeText(String(formData.get("metaKeywords"))),
    consentLabel: sanitizeMultiline(String(formData.get("consentLabel"))),
  };

  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.siteSettings.create({ data });
  }

  revalidateAll(["/", "/contactos", "/marcacoes", "/admin/configuracoes"]);
}

export async function savePageContentAction(formData: FormData) {
  await requireAdminSession();

  const id = sanitizeText(String(formData.get("id") ?? ""));
  const slug = sanitizeText(String(formData.get("slug")));
  const sectionKey = sanitizeText(String(formData.get("sectionKey")));
  const data = {
    slug,
    sectionKey,
    title: sanitizeText(String(formData.get("title"))),
    subtitle: sanitizeText(String(formData.get("subtitle"))) || null,
    content: sanitizeMultiline(String(formData.get("content"))) || null,
    imageUrl: sanitizeText(String(formData.get("imageUrl"))) || null,
    ctaLabel: sanitizeText(String(formData.get("ctaLabel"))) || null,
    ctaHref: sanitizeText(String(formData.get("ctaHref"))) || null,
    metaTitle: sanitizeText(String(formData.get("metaTitle"))) || null,
    metaDescription: sanitizeMultiline(String(formData.get("metaDescription"))) || null,
    metaKeywords: sanitizeText(String(formData.get("metaKeywords"))) || null,
    isActive: boolFromForm(formData, "isActive"),
    sortOrder: numberFromForm(formData, "sortOrder"),
  };

  if (id) {
    await prisma.pageContent.update({ where: { id }, data });
  } else {
    await prisma.pageContent.create({ data });
  }

  revalidateAll(["/", `/${slug === "home" ? "" : slug}`, "/admin/conteudo"]);
}

export async function deletePageContentAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.pageContent.delete({ where: { id } });
  revalidateAll(["/", "/admin/conteudo"]);
}

export async function saveBannerAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const data = {
    title: sanitizeText(String(formData.get("title"))),
    subtitle: sanitizeText(String(formData.get("subtitle"))) || null,
    imageUrl: sanitizeText(String(formData.get("imageUrl"))) || null,
    ctaLabel: sanitizeText(String(formData.get("ctaLabel"))) || null,
    ctaHref: sanitizeText(String(formData.get("ctaHref"))) || null,
    placement: sanitizeText(String(formData.get("placement"))),
    isActive: boolFromForm(formData, "isActive"),
  };

  if (id) {
    await prisma.banner.update({ where: { id }, data });
  } else {
    await prisma.banner.create({ data });
  }

  revalidateAll(["/", "/admin/conteudo"]);
}

export async function deleteBannerAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.banner.delete({ where: { id } });
  revalidateAll(["/", "/admin/conteudo"]);
}

export async function savePromotionAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const data = {
    title: sanitizeText(String(formData.get("title"))),
    subtitle: sanitizeText(String(formData.get("subtitle"))) || null,
    description: sanitizeMultiline(String(formData.get("description"))),
    badge: sanitizeText(String(formData.get("badge"))) || null,
    ctaLabel: sanitizeText(String(formData.get("ctaLabel"))) || null,
    ctaHref: sanitizeText(String(formData.get("ctaHref"))) || null,
    imageUrl: sanitizeText(String(formData.get("imageUrl"))) || null,
    isActive: boolFromForm(formData, "isActive"),
  };

  if (id) {
    await prisma.promotion.update({ where: { id }, data });
  } else {
    await prisma.promotion.create({ data });
  }

  revalidateAll(["/", "/admin/conteudo"]);
}

export async function deletePromotionAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.promotion.delete({ where: { id } });
  revalidateAll(["/", "/admin/conteudo"]);
}

export async function saveServiceCategoryAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const name = sanitizeText(String(formData.get("name")));
  const data = {
    name,
    slug: sanitizeText(String(formData.get("slug"))) || slugify(name),
    description: sanitizeMultiline(String(formData.get("description"))) || null,
    sortOrder: numberFromForm(formData, "sortOrder"),
    isActive: boolFromForm(formData, "isActive"),
  };

  if (id) {
    await prisma.serviceCategory.update({ where: { id }, data });
  } else {
    await prisma.serviceCategory.create({ data });
  }

  revalidateAll(["/servicos", "/admin/servicos", "/marcacoes", "/"]);
}

export async function deleteServiceCategoryAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.serviceCategory.delete({ where: { id } });
  revalidateAll(["/servicos", "/admin/servicos", "/marcacoes", "/"]);
}

export async function saveServiceAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const name = sanitizeText(String(formData.get("name")));
  const data = {
    categoryId: sanitizeText(String(formData.get("categoryId"))),
    name,
    slug: sanitizeText(String(formData.get("slug"))) || slugify(name),
    description: sanitizeMultiline(String(formData.get("description"))),
    durationMinutes: numberFromForm(formData, "durationMinutes", 45),
    price: numberFromForm(formData, "price", 0),
    imageUrl: sanitizeText(String(formData.get("imageUrl"))) || null,
    isActive: boolFromForm(formData, "isActive"),
    sortOrder: numberFromForm(formData, "sortOrder"),
  };

  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }

  revalidateAll(["/servicos", "/admin/servicos", "/marcacoes", "/"]);
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.service.delete({ where: { id } });
  revalidateAll(["/servicos", "/admin/servicos", "/marcacoes", "/"]);
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdminSession();
  const title = sanitizeText(String(formData.get("title")));
  const altText = sanitizeText(String(formData.get("altText"))) || null;
  const kind = sanitizeText(String(formData.get("kind"))) || "gallery";
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return;
  }

  const filePath = await saveUploadedFile(file);

  if (!filePath) {
    return;
  }

  await prisma.mediaAsset.create({
    data: {
      title,
      altText,
      kind,
      fileName: file.name,
      filePath,
    },
  });

  revalidateAll(["/admin/galeria"]);
}

export async function saveGalleryItemAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const data = {
    title: sanitizeText(String(formData.get("title"))),
    category: sanitizeText(String(formData.get("category"))),
    imageUrl: sanitizeText(String(formData.get("imageUrl"))),
    altText: sanitizeText(String(formData.get("altText"))) || null,
    description: sanitizeMultiline(String(formData.get("description"))) || null,
    isFeatured: boolFromForm(formData, "isFeatured"),
    sortOrder: numberFromForm(formData, "sortOrder"),
  };

  if (id) {
    await prisma.galleryItem.update({ where: { id }, data });
  } else {
    await prisma.galleryItem.create({ data });
  }

  revalidateAll(["/galeria", "/", "/admin/galeria"]);
}

export async function deleteGalleryItemAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.galleryItem.delete({ where: { id } });
  revalidateAll(["/galeria", "/", "/admin/galeria"]);
}

export async function saveProfessionalAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const name = sanitizeText(String(formData.get("name"))) || "Profissional";
  const baseSlug = sanitizeText(String(formData.get("slug"))) || slugify(name);
  const uniqueSlug = await buildUniqueProfessionalSlug(baseSlug, id || undefined);
  const serviceIds = formData.getAll("serviceIds").map((value) => sanitizeText(String(value))).filter(Boolean);
  const data = {
    name,
    slug: uniqueSlug,
    specialty: sanitizeText(String(formData.get("specialty"))) || "Especialista",
    bio: sanitizeMultiline(String(formData.get("bio"))),
    email: sanitizeText(String(formData.get("email"))) || null,
    phone: normalizePhone(String(formData.get("phone"))) || null,
    imageUrl: sanitizeText(String(formData.get("imageUrl"))) || null,
    isActive: boolFromForm(formData, "isActive"),
  };

  const professional = id
    ? await prisma.professional.update({ where: { id }, data })
    : await prisma.professional.create({ data });

  await prisma.professionalService.deleteMany({ where: { professionalId: professional.id } });
  if (serviceIds.length) {
    await prisma.professionalService.createMany({
      data: serviceIds.map((serviceId) => ({ professionalId: professional.id, serviceId })),
    });
  }

  revalidateAll(["/sobre", "/admin/equipa", "/marcacoes", "/"]);
}

export async function deleteProfessionalAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.professional.delete({ where: { id } });
  revalidateAll(["/sobre", "/admin/equipa", "/marcacoes", "/"]);
}

export async function saveBusinessHourAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const data = {
    weekday: numberFromForm(formData, "weekday"),
    opensAt: sanitizeText(String(formData.get("opensAt"))),
    closesAt: sanitizeText(String(formData.get("closesAt"))),
    breakStart: sanitizeText(String(formData.get("breakStart"))) || null,
    breakEnd: sanitizeText(String(formData.get("breakEnd"))) || null,
    isClosed: boolFromForm(formData, "isClosed"),
    professionalId: sanitizeText(String(formData.get("professionalId"))) || null,
  };

  if (id) {
    await prisma.businessHour.update({ where: { id }, data });
  } else {
    await prisma.businessHour.create({ data });
  }

  revalidateAll(["/marcacoes", "/contactos", "/admin/disponibilidade", "/"]);
}

export async function saveTimeOffAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const data = {
    title: sanitizeText(String(formData.get("title"))),
    reason: sanitizeMultiline(String(formData.get("reason"))) || null,
    startsAt: new Date(String(formData.get("startsAt"))),
    endsAt: new Date(String(formData.get("endsAt"))),
    isAllDay: boolFromForm(formData, "isAllDay"),
    professionalId: sanitizeText(String(formData.get("professionalId"))) || null,
  };

  if (id) {
    await prisma.timeOff.update({ where: { id }, data });
  } else {
    await prisma.timeOff.create({ data });
  }

  revalidateAll(["/marcacoes", "/admin/disponibilidade"]);
}

export async function deleteTimeOffAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.timeOff.delete({ where: { id } });
  revalidateAll(["/marcacoes", "/admin/disponibilidade"]);
}

export async function saveTestimonialAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const data = {
    clientName: sanitizeText(String(formData.get("clientName"))),
    rating: numberFromForm(formData, "rating", 5),
    comment: sanitizeMultiline(String(formData.get("comment"))),
    serviceName: sanitizeText(String(formData.get("serviceName"))) || null,
    isApproved: boolFromForm(formData, "isApproved"),
    isFeatured: boolFromForm(formData, "isFeatured"),
  };

  if (id) {
    await prisma.testimonial.update({ where: { id }, data });
  } else {
    await prisma.testimonial.create({ data });
  }

  revalidateAll(["/", "/testemunhos", "/admin/testemunhos"]);
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.testimonial.delete({ where: { id } });
  revalidateAll(["/", "/testemunhos", "/admin/testemunhos"]);
}

export async function saveFaqAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const data = {
    question: sanitizeText(String(formData.get("question"))),
    answer: sanitizeMultiline(String(formData.get("answer"))),
    sortOrder: numberFromForm(formData, "sortOrder"),
    isActive: boolFromForm(formData, "isActive"),
  };

  if (id) {
    await prisma.faqItem.update({ where: { id }, data });
  } else {
    await prisma.faqItem.create({ data });
  }

  revalidateAll(["/faq", "/", "/admin/faq"]);
}

export async function deleteFaqAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.faqItem.delete({ where: { id } });
  revalidateAll(["/faq", "/", "/admin/faq"]);
}

export async function saveAppointmentAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  const startAtValue = sanitizeText(String(formData.get("startAt")));
  const status = sanitizeText(String(formData.get("status")));
  const internalNotes = sanitizeMultiline(String(formData.get("internalNotes"))) || null;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!appointment) {
    return;
  }

  const startAt = startAtValue ? new Date(startAtValue) : appointment.startAt;
  const endAt = new Date(startAt.getTime() + appointment.service.durationMinutes * 60 * 1000);

  await prisma.appointment.update({
    where: { id },
    data: { startAt, endAt, status, internalNotes },
  });

  revalidateAll(["/admin/marcacoes", "/marcacoes"]);
}

export async function saveCustomerNotesAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  const notes = sanitizeMultiline(String(formData.get("notes"))) || null;
  await prisma.customer.update({ where: { id }, data: { notes } });
  revalidateAll(["/admin/clientes"]);
}

export async function saveAdminUserAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id") ?? ""));
  const password = String(formData.get("password") ?? "");
  const baseData = {
    name: sanitizeText(String(formData.get("name"))),
    email: sanitizeText(String(formData.get("email"))),
    role: sanitizeText(String(formData.get("role"))),
    notes: sanitizeMultiline(String(formData.get("notes"))) || null,
    isActive: boolFromForm(formData, "isActive"),
  };

  if (id) {
    await prisma.adminUser.update({
      where: { id },
      data: password ? { ...baseData, passwordHash: await hashPassword(password) } : baseData,
    });
  } else {
    await prisma.adminUser.create({
      data: {
        ...baseData,
        passwordHash: await hashPassword(password || "Admin123!"),
      },
    });
  }

  revalidateAll(["/admin/utilizadores"]);
}

export async function deleteAdminUserAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.adminUser.delete({ where: { id } });
  revalidateAll(["/admin/utilizadores"]);
}

export async function saveContactMessageAction(formData: FormData) {
  await requireAdminSession();
  const id = sanitizeText(String(formData.get("id")));
  await prisma.contactMessage.update({
    where: { id },
    data: { replied: boolFromForm(formData, "replied") },
  });
  revalidateAll(["/admin/contactos"]);
}
