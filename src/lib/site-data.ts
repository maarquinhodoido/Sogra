import { prisma } from "@/lib/prisma";
import {
  demoBanners,
  demoBusinessHours,
  demoFaqs,
  demoGalleryItems,
  demoPageContents,
  demoProfessionals,
  demoPromotions,
  demoServiceCategories,
  demoServices,
  demoSiteSettings,
  demoTestimonials,
  type BannerData,
  type BusinessHourData,
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

async function withFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
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

export async function getSiteSettings(): Promise<SiteSettingsData> {
  return withFallback(async () => {
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return demoSiteSettings;
    }

    return {
      ...settings,
      depositAmount: settings.depositAmount ? toNumber(settings.depositAmount) : 0,
      heroImageUrl: settings.heroImageUrl ?? demoSiteSettings.heroImageUrl,
      logoUrl: settings.logoUrl ?? demoSiteSettings.logoUrl,
      faviconUrl: settings.faviconUrl ?? demoSiteSettings.faviconUrl,
      instagramUrl: settings.instagramUrl ?? demoSiteSettings.instagramUrl,
      facebookUrl: settings.facebookUrl ?? demoSiteSettings.facebookUrl,
      tiktokUrl: settings.tiktokUrl ?? demoSiteSettings.tiktokUrl,
      metaTitle: settings.metaTitle ?? demoSiteSettings.metaTitle,
      metaDescription: settings.metaDescription ?? demoSiteSettings.metaDescription,
      metaKeywords: settings.metaKeywords ?? demoSiteSettings.metaKeywords,
    } satisfies SiteSettingsData;
  }, demoSiteSettings);
}

export async function getPageSections(slug: string): Promise<PageContentData[]> {
  return withFallback<PageContentData[]>(async () => {
    const rows = await prisma.pageContent.findMany({
      where: { slug, isActive: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });

    if (!rows.length) {
      return demoPageContents.filter((item) => item.slug === slug);
    }

    return rows.map((row) => ({
      slug: row.slug,
      sectionKey: row.sectionKey,
      title: row.title,
      subtitle: row.subtitle ?? undefined,
      content: row.content ?? undefined,
      imageUrl: row.imageUrl ?? undefined,
      ctaLabel: row.ctaLabel ?? undefined,
      ctaHref: row.ctaHref ?? undefined,
      metaTitle: row.metaTitle ?? undefined,
      metaDescription: row.metaDescription ?? undefined,
      metaKeywords: row.metaKeywords ?? undefined,
      isActive: row.isActive,
      sortOrder: row.sortOrder,
    }));
  }, demoPageContents.filter((item) => item.slug === slug));
}

export async function getPageSection(slug: string, sectionKey: string) {
  const sections = await getPageSections(slug);
  return sections.find((item) => item.sectionKey === sectionKey) ?? null;
}

export async function getBanners(placement?: string): Promise<BannerData[]> {
  return withFallback<BannerData[]>(async () => {
    const rows = await prisma.banner.findMany({
      where: {
        isActive: true,
        ...(placement ? { placement } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    if (!rows.length) {
      return placement
        ? demoBanners.filter((item) => item.placement === placement)
        : demoBanners;
    }

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle ?? undefined,
      imageUrl: row.imageUrl ?? undefined,
      ctaLabel: row.ctaLabel ?? undefined,
      ctaHref: row.ctaHref ?? undefined,
      placement: row.placement,
      isActive: row.isActive,
      startsAt: row.startsAt ?? undefined,
      endsAt: row.endsAt ?? undefined,
    }));
  }, placement ? demoBanners.filter((item) => item.placement === placement) : demoBanners);
}

export async function getServiceCategoriesWithServices(): Promise<
  Array<ServiceCategoryData & { services: ServiceData[] }>
> {
  return withFallback<Array<ServiceCategoryData & { services: ServiceData[] }>>(async () => {
    const rows = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      include: {
        services: {
          where: { isActive: true },
          include: {
            professionals: {
              include: {
                professional: true,
              },
            },
          },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (!rows.length) {
      return demoServiceCategories.map((category) => ({
        ...category,
        services: demoServices.filter((service) => service.categoryId === category.id),
      }));
    }

    return rows.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      services: category.services.map((service) => ({
        id: service.id,
        categoryId: service.categoryId,
        name: service.name,
        slug: service.slug,
        description: service.description,
        durationMinutes: service.durationMinutes,
        price: toNumber(service.price),
        imageUrl: service.imageUrl ?? undefined,
        isActive: service.isActive,
        sortOrder: service.sortOrder,
        professionalSlugs: service.professionals.map((item) => item.professional.slug),
      })),
    }));
  },
  demoServiceCategories.map((category) => ({
    ...category,
    services: demoServices.filter((service) => service.categoryId === category.id),
  })));
}

export async function getServices(): Promise<ServiceData[]> {
  const categories = await getServiceCategoriesWithServices();
  return categories.flatMap((category) => category.services);
}

export async function getProfessionals(): Promise<ProfessionalData[]> {
  return withFallback<ProfessionalData[]>(async () => {
    const rows = await prisma.professional.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return rows.length
      ? rows.map((row) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          specialty: row.specialty,
          bio: row.bio,
          email: row.email ?? undefined,
          phone: row.phone ?? undefined,
          imageUrl: row.imageUrl ?? undefined,
          isActive: row.isActive,
        }))
      : demoProfessionals;
  }, demoProfessionals);
}

export async function getBusinessHours(): Promise<BusinessHourData[]> {
  return withFallback(async () => {
    const rows = await prisma.businessHour.findMany({ orderBy: { weekday: "asc" } });
    return rows.length
      ? rows.map((row) => ({
          weekday: row.weekday,
          opensAt: row.opensAt,
          closesAt: row.closesAt,
          breakStart: row.breakStart ?? undefined,
          breakEnd: row.breakEnd ?? undefined,
          isClosed: row.isClosed,
        }))
      : demoBusinessHours;
  }, demoBusinessHours);
}

export async function getGalleryItems(): Promise<GalleryItemData[]> {
  return withFallback<GalleryItemData[]>(async () => {
    const rows = await prisma.galleryItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return rows.length
      ? rows.map((row) => ({
          id: row.id,
          title: row.title,
          category: row.category,
          imageUrl: row.imageUrl,
          altText: row.altText ?? undefined,
          description: row.description ?? undefined,
          isFeatured: row.isFeatured,
          sortOrder: row.sortOrder,
        }))
      : demoGalleryItems;
  }, demoGalleryItems);
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  return withFallback<TestimonialData[]>(async () => {
    const rows = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.length
      ? rows.map((row) => ({
          id: row.id,
          clientName: row.clientName,
          rating: row.rating,
          comment: row.comment,
          serviceName: row.serviceName ?? undefined,
          isApproved: row.isApproved,
          isFeatured: row.isFeatured,
        }))
      : demoTestimonials;
  }, demoTestimonials);
}

export async function getFaqs(): Promise<FaqData[]> {
  return withFallback(async () => {
    const rows = await prisma.faqItem.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return rows.length ? rows : demoFaqs;
  }, demoFaqs);
}

export async function getPromotions(): Promise<PromotionData[]> {
  return withFallback<PromotionData[]>(async () => {
    const rows = await prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.length
      ? rows.map((row) => ({
          id: row.id,
          title: row.title,
          subtitle: row.subtitle ?? undefined,
          description: row.description,
          badge: row.badge ?? undefined,
          ctaLabel: row.ctaLabel ?? undefined,
          ctaHref: row.ctaHref ?? undefined,
          imageUrl: row.imageUrl ?? undefined,
          isActive: row.isActive,
          startsAt: row.startsAt ?? undefined,
          endsAt: row.endsAt ?? undefined,
        }))
      : demoPromotions;
  }, demoPromotions);
}

export async function getHomepageData() {
  const [settings, hero, about, banners, categories, gallery, testimonials, promotions, faqs, professionals, hours] =
    await Promise.all([
      getSiteSettings(),
      getPageSection("home", "hero"),
      getPageSection("home", "about"),
      getBanners("home-hero"),
      getServiceCategoriesWithServices(),
      getGalleryItems(),
      getTestimonials(),
      getPromotions(),
      getFaqs(),
      getProfessionals(),
      getBusinessHours(),
    ]);

  return {
    settings,
    hero,
    about,
    banners,
    categories,
    gallery,
    testimonials,
    promotions,
    faqs,
    professionals,
    hours,
  };
}

export async function getFooterData() {
  const [settings, hours] = await Promise.all([getSiteSettings(), getBusinessHours()]);
  return { settings, hours };
}

export async function buildPageMetadata(slug: string) {
  const settings = await getSiteSettings();
  const sections = await getPageSections(slug);
  const seoSection = sections.find((item) => item.metaTitle || item.metaDescription);

  return {
    title: seoSection?.metaTitle ?? settings.metaTitle,
    description: seoSection?.metaDescription ?? settings.metaDescription,
    keywords: (seoSection?.metaKeywords ?? settings.metaKeywords)
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
  };
}