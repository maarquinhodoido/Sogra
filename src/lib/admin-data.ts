import { prisma } from "@/lib/prisma";
import {
  type BannerData,
  demoBanners,
  demoFaqs,
  demoGalleryItems,
  demoPageContents,
  demoProfessionals,
  demoPromotions,
  demoServiceCategories,
  demoServices,
  demoSiteSettings,
  demoTestimonials,
  type FaqData,
  type GalleryItemData,
  type PageContentData,
  type ProfessionalData,
  type PromotionData,
  type ServiceCategoryData,
  type ServiceData,
  type SiteSettingsData,
  type TestimonialData,
} from "@/lib/demo-data";

type AdminPageContentRecord = PageContentData & { id?: string };
type AdminBannerRecord = BannerData & { id?: string };
type AdminPromotionRecord = PromotionData & { id?: string };
type AdminServiceCategoryRecord = ServiceCategoryData;
type AdminServiceRecord = Omit<ServiceData, "professionalSlugs"> & {
  professionalSlugs?: string[];
  category?: { id: string; name: string } | undefined;
};
type AdminGalleryRecord = GalleryItemData;
type AdminTestimonialRecord = TestimonialData;
type AdminFaqRecord = FaqData;
type AdminProfessionalRecord = ProfessionalData & {
  services?: Array<{ serviceId: string; service: { id: string; name: string } }>;
};
type AdminAvailabilityProfessionalRecord = { id: string; name: string };
type AdminBusinessHourRecord = {
  id?: string;
  weekday: number;
  opensAt: string;
  closesAt: string;
  breakStart?: string;
  breakEnd?: string;
  isClosed: boolean;
  professionalId?: string;
};
type AdminTimeOffRecord = {
  id?: string;
  title: string;
  reason?: string;
  startsAt: Date;
  endsAt: Date;
  isAllDay: boolean;
  professionalId?: string;
};

async function withAdminFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }

  return 0;
}

export async function getAdminDashboardData() {
  return withAdminFallback(async () => {
    const [appointments, customers, services, professionals, messages] = await Promise.all([
      prisma.appointment.count(),
      prisma.customer.count(),
      prisma.service.count({ where: { isActive: true } }),
      prisma.professional.count({ where: { isActive: true } }),
      prisma.contactMessage.count(),
    ]);

    return { appointments, customers, services, professionals, messages };
  }, {
    appointments: 0,
    customers: 0,
    services: demoServices.length,
    professionals: demoProfessionals.length,
    messages: 0,
  });
}

export async function getAdminContentData(): Promise<{
  pages: AdminPageContentRecord[];
  banners: AdminBannerRecord[];
  promotions: AdminPromotionRecord[];
}> {
  return withAdminFallback<{
    pages: AdminPageContentRecord[];
    banners: AdminBannerRecord[];
    promotions: AdminPromotionRecord[];
  }>(async () => {
    const [pages, banners, promotions] = await Promise.all([
      prisma.pageContent.findMany({ orderBy: [{ slug: "asc" }, { sortOrder: "asc" }] }),
      prisma.banner.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.promotion.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return {
      pages: pages.map((page) => ({
        id: page.id,
        slug: page.slug,
        sectionKey: page.sectionKey,
        title: page.title,
        subtitle: page.subtitle ?? undefined,
        content: page.content ?? undefined,
        imageUrl: page.imageUrl ?? undefined,
        ctaLabel: page.ctaLabel ?? undefined,
        ctaHref: page.ctaHref ?? undefined,
        metaTitle: page.metaTitle ?? undefined,
        metaDescription: page.metaDescription ?? undefined,
        metaKeywords: page.metaKeywords ?? undefined,
        isActive: page.isActive,
        sortOrder: page.sortOrder,
      })),
      banners: banners.map((banner) => ({
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle ?? undefined,
        imageUrl: banner.imageUrl ?? undefined,
        ctaLabel: banner.ctaLabel ?? undefined,
        ctaHref: banner.ctaHref ?? undefined,
        placement: banner.placement,
        isActive: banner.isActive,
      })),
      promotions: promotions.map((promotion) => ({
        id: promotion.id,
        title: promotion.title,
        subtitle: promotion.subtitle ?? undefined,
        description: promotion.description,
        badge: promotion.badge ?? undefined,
        ctaLabel: promotion.ctaLabel ?? undefined,
        ctaHref: promotion.ctaHref ?? undefined,
        imageUrl: promotion.imageUrl ?? undefined,
        isActive: promotion.isActive,
      })),
    };
  }, {
    pages: demoPageContents.map((page) => ({ id: undefined, ...page })),
    banners: demoBanners,
    promotions: demoPromotions,
  });
}

export async function getAdminServicesData(): Promise<{
  categories: AdminServiceCategoryRecord[];
  services: AdminServiceRecord[];
}> {
  return withAdminFallback<{
    categories: AdminServiceCategoryRecord[];
    services: AdminServiceRecord[];
  }>(async () => {
    const [categories, services] = await Promise.all([
      prisma.serviceCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
      prisma.service.findMany({
        include: { category: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
    ]);

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? undefined,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
      })),
      services: services.map((service) => ({
        id: service.id,
        categoryId: service.categoryId,
        name: service.name,
        slug: service.slug,
        description: service.description,
        durationMinutes: service.durationMinutes,
        price: Number(service.price),
        imageUrl: service.imageUrl ?? undefined,
        isActive: service.isActive,
        sortOrder: service.sortOrder,
        category: service.category
          ? { id: service.category.id, name: service.category.name }
          : undefined,
      })),
    };
  }, {
    categories: demoServiceCategories,
    services: demoServices.map((service) => ({
      ...service,
      category: demoServiceCategories.find((category) => category.id === service.categoryId),
    })),
  });
}

export async function getAdminGalleryData(): Promise<{
  gallery: AdminGalleryRecord[];
  media: Array<{ id: string; title: string; filePath: string }>;
}> {
  return withAdminFallback<{
    gallery: AdminGalleryRecord[];
    media: Array<{ id: string; title: string; filePath: string }>;
  }>(async () => {
    const [gallery, media] = await Promise.all([
      prisma.galleryItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
      prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return {
      gallery: gallery.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
        altText: item.altText ?? undefined,
        description: item.description ?? undefined,
        isFeatured: item.isFeatured,
        sortOrder: item.sortOrder,
      })),
      media: media.map((asset) => ({ id: asset.id, title: asset.title, filePath: asset.filePath })),
    };
  }, { gallery: demoGalleryItems, media: [] });
}

export async function getAdminAppointmentsData() {
  return withAdminFallback(async () => {
    return prisma.appointment.findMany({
      include: {
        customer: true,
        service: true,
        professional: true,
      },
      orderBy: { startAt: "desc" },
    });
  }, []);
}

export async function getAdminCustomersData() {
  return withAdminFallback(async () => {
    return prisma.customer.findMany({
      include: {
        appointments: {
          include: {
            service: true,
            professional: true,
          },
          orderBy: { startAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }, []);
}

export async function getAdminTeamData(): Promise<{
  professionals: AdminProfessionalRecord[];
  services: AdminServiceRecord[];
}> {
  return withAdminFallback<{
    professionals: AdminProfessionalRecord[];
    services: AdminServiceRecord[];
  }>(async () => {
    const [professionals, services] = await Promise.all([
      prisma.professional.findMany({
        include: {
          services: { include: { service: true } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.service.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    ]);

    return {
      professionals: professionals.map((professional) => ({
        id: professional.id,
        name: professional.name,
        slug: professional.slug,
        specialty: professional.specialty,
        bio: professional.bio,
        email: professional.email ?? undefined,
        phone: professional.phone ?? undefined,
        imageUrl: professional.imageUrl ?? undefined,
        isActive: professional.isActive,
        services: professional.services.map((entry) => ({
          serviceId: entry.serviceId,
          service: { id: entry.service.id, name: entry.service.name },
        })),
      })),
      services: services.map((service) => ({
        id: service.id,
        categoryId: service.categoryId,
        name: service.name,
        slug: service.slug,
        description: service.description,
        durationMinutes: service.durationMinutes,
        price: Number(service.price),
        imageUrl: service.imageUrl ?? undefined,
        isActive: service.isActive,
        sortOrder: service.sortOrder,
      })),
    };
  }, {
    professionals: demoProfessionals.map((professional) => ({ ...professional, services: [] })),
    services: demoServices,
  });
}

export async function getAdminAvailabilityData(): Promise<{
  hours: AdminBusinessHourRecord[];
  timeOffs: AdminTimeOffRecord[];
  professionals: AdminAvailabilityProfessionalRecord[];
}> {
  return withAdminFallback<{
    hours: AdminBusinessHourRecord[];
    timeOffs: AdminTimeOffRecord[];
    professionals: AdminAvailabilityProfessionalRecord[];
  }>(async () => {
    const [hours, timeOffs, professionals] = await Promise.all([
      prisma.businessHour.findMany({ orderBy: [{ weekday: "asc" }, { createdAt: "asc" }] }),
      prisma.timeOff.findMany({
        include: { professional: true },
        orderBy: { startsAt: "asc" },
      }),
      prisma.professional.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    ]);

    return {
      hours: hours.map((hour) => ({
        id: hour.id,
        weekday: hour.weekday,
        opensAt: hour.opensAt,
        closesAt: hour.closesAt,
        breakStart: hour.breakStart ?? undefined,
        breakEnd: hour.breakEnd ?? undefined,
        isClosed: hour.isClosed,
        professionalId: hour.professionalId ?? undefined,
      })),
      timeOffs: timeOffs.map((timeOff) => ({
        id: timeOff.id,
        title: timeOff.title,
        reason: timeOff.reason ?? undefined,
        startsAt: timeOff.startsAt,
        endsAt: timeOff.endsAt,
        isAllDay: timeOff.isAllDay,
        professionalId: timeOff.professionalId ?? undefined,
      })),
      professionals: professionals.map((professional) => ({
        id: professional.id,
        name: professional.name,
      })),
    };
  }, {
    hours: [],
    timeOffs: [],
    professionals: demoProfessionals.map((professional) => ({
      id: professional.id,
      name: professional.name,
    })),
  });
}

export async function getAdminTestimonialsData(): Promise<AdminTestimonialRecord[]> {
  return withAdminFallback<AdminTestimonialRecord[]>(async () => {
    const rows = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((item) => ({
      id: item.id,
      clientName: item.clientName,
      rating: item.rating,
      comment: item.comment,
      serviceName: item.serviceName ?? undefined,
      isApproved: item.isApproved,
      isFeatured: item.isFeatured,
    }));
  }, demoTestimonials);
}

export async function getAdminFaqData(): Promise<AdminFaqRecord[]> {
  return withAdminFallback<AdminFaqRecord[]>(async () => prisma.faqItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }), demoFaqs);
}

export async function getAdminSettingsData(): Promise<SiteSettingsData> {
  return withAdminFallback<SiteSettingsData>(async () => {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      return demoSiteSettings;
    }

    return {
      ...settings,
      depositAmount: settings.depositAmount ? toNumber(settings.depositAmount) : 0,
      instagramUrl: settings.instagramUrl ?? "",
      facebookUrl: settings.facebookUrl ?? "",
      tiktokUrl: settings.tiktokUrl ?? "",
      heroImageUrl: settings.heroImageUrl ?? "",
      logoUrl: settings.logoUrl ?? "",
      faviconUrl: settings.faviconUrl ?? "",
      metaTitle: settings.metaTitle ?? "",
      metaDescription: settings.metaDescription ?? "",
      metaKeywords: settings.metaKeywords ?? "",
    };
  }, demoSiteSettings);
}

export async function getAdminUsersData() {
  return withAdminFallback(async () => prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } }), []);
}

export async function getAdminContactsData() {
  return withAdminFallback(async () => prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }), []);
}
