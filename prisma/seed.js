/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const siteSettings = {
  businessName: "Luxe Nails Atelier",
  tagline: "Manicure, pedicure e nail artistry com acabamento premium.",
  businessEmail: "geral@luxenails.pt",
  bookingEmail: "marcacoes@luxenails.pt",
  phone: "+351 210 123 456",
  whatsapp: "+351 910 000 000",
  address: "Rua da Elegância, 28",
  city: "Lisboa",
  postalCode: "1250-120",
  googleMapsUrl: "https://maps.google.com/?q=Rua+da+Eleg%C3%A2ncia+28+Lisboa",
  instagramUrl: "https://instagram.com/luxenailsatelier",
  facebookUrl: "https://facebook.com/luxenailsatelier",
  tiktokUrl: "https://tiktok.com/@luxenailsatelier",
  heroImageUrl: "/placeholders/hero-premium.svg",
  logoUrl: "/placeholders/logo-wordmark.svg",
  faviconUrl: "/favicon.ico",
  bookingBufferMinutes: 15,
  maxAppointmentsPerDay: 14,
  allowDeposits: true,
  depositAmount: 15,
  loyaltyEnabled: true,
  couponsEnabled: true,
  metaTitle: "Luxe Nails Atelier | Manicure, Pedicure e Nail Art em Lisboa",
  metaDescription:
    "Salão premium de unhas em Lisboa com manicure, pedicure, gel, acrílico, marcações online e gestão completa de agenda.",
  metaKeywords:
    "salão de unhas lisboa, manicure, pedicure, nail art, gel, acrílico, marcações online, unhas premium",
  consentLabel:
    "Autorizo o tratamento dos meus dados para marcação, contacto e envio de informações sobre o serviço solicitado.",
};

const pageContents = [
  {
    slug: "home",
    sectionKey: "hero",
    title: "Unhas impecáveis com um ritual de beleza pensado ao detalhe.",
    subtitle: "Atendimento personalizado, ambiente elegante e resultados que valorizam a sua imagem.",
    content:
      "No Luxe Nails Atelier combinamos técnica, higiene, conforto e um olhar editorial para criar manicures, pedicures e nail art com acabamento premium.",
    imageUrl: "/placeholders/hero-premium.svg",
    ctaLabel: "Marcar Agora",
    ctaHref: "/marcacoes",
    metaTitle: "Luxe Nails Atelier | Cuidado premium para mãos e pés",
    metaDescription:
      "Descubra um espaço de unhas sofisticado, com serviços premium, equipa especializada e marcação online simples.",
    metaKeywords: "atelier de unhas, manicure premium, pedicure lisboa",
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "sobre",
    sectionKey: "story",
    title: "Um atelier nascido da paixão pela estética cuidada.",
    subtitle: "Entre beleza, bem-estar e serviço personalizado.",
    content:
      "O Luxe Nails Atelier foi pensado para mulheres que procuram um serviço premium, limpo, profissional e com atenção verdadeira ao detalhe.",
    imageUrl: "/placeholders/studio-space.svg",
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "sobre",
    sectionKey: "values",
    title: "Missão, visão e valores.",
    subtitle: "Sofisticação prática para a rotina real.",
    content:
      "Missão: elevar a experiência de manicure e pedicure. Visão: ser uma referência em cuidado premium de unhas em Lisboa. Valores: técnica, higiene, pontualidade, empatia, personalização e consistência.",
    isActive: true,
    sortOrder: 2,
  },
  {
    slug: "servicos",
    sectionKey: "intro",
    title: "Serviços desenhados para diferentes ritmos, gostos e objetivos.",
    subtitle: "Do look minimalista ao design artístico.",
    content:
      "Escolha o serviço ideal para manutenção regular, ocasião especial ou transformação completa, sempre com tempos transparentes e preços claros.",
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "galeria",
    sectionKey: "intro",
    title: "Portfólio de trabalhos recentes.",
    subtitle: "Acabamentos reais, captados no nosso espaço.",
    content:
      "Explore manicures elegantes, pedicures impecáveis, detalhes delicados e composições com nail art contemporânea.",
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "faq",
    sectionKey: "intro",
    title: "Perguntas frequentes.",
    subtitle: "Transparência antes da sua visita.",
    content:
      "Esclareça dúvidas sobre horários, atrasos, cancelamentos, pagamentos e preparação para o atendimento.",
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "testemunhos",
    sectionKey: "intro",
    title: "A confiança das clientes reflete-se na nossa agenda.",
    subtitle: "Opiniões reais sobre serviço, resultado e experiência.",
    content:
      "Trabalhamos para que cada visita seja memorável pela qualidade técnica, pelo ambiente e pela atenção ao detalhe.",
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "contactos",
    sectionKey: "intro",
    title: "Fale connosco ou visite o atelier.",
    subtitle: "Estamos disponíveis para marcações, dúvidas e acompanhamento.",
    content:
      "Pode entrar em contacto por telefone, email, formulário ou WhatsApp. Respondemos com rapidez e clareza.",
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "privacidade",
    sectionKey: "main",
    title: "Política de Privacidade",
    content:
      "Recolhemos apenas os dados necessários para processar marcações, responder a pedidos de contacto e gerir a relação comercial.",
    metaTitle: "Política de Privacidade | Luxe Nails Atelier",
    metaDescription: "Informação sobre tratamento de dados pessoais e contactos.",
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "termos",
    sectionKey: "main",
    title: "Termos e Condições",
    content:
      "As marcações dependem de disponibilidade e podem exigir sinal, quando ativo. Cancelamentos devem ser feitos com antecedência mínima de 24 horas.",
    metaTitle: "Termos e Condições | Luxe Nails Atelier",
    metaDescription: "Regras de marcação, cancelamento e funcionamento do espaço.",
    isActive: true,
    sortOrder: 1,
  },
];

const categories = [
  ["cat-manicure", "Manicure", "manicure", "Cuidados de mãos com acabamento clássico ou premium.", 1],
  ["cat-pedicure", "Pedicure", "pedicure", "Tratamentos para pés com foco em conforto e apresentação.", 2],
  ["cat-gel", "Gel e Builder", "gel-builder", "Estrutura, durabilidade e brilho elegante.", 3],
  ["cat-acrilico", "Acrílico", "acrilico", "Alongamento com desenho e resistência.", 4],
  ["cat-nail-art", "Nail Art", "nail-art", "Detalhes artísticos para eventos e coleções sazonais.", 5],
  ["cat-manutencao", "Manutenção e Remoção", "manutencao-remocao", "Serviços de manutenção, reforço e remoção segura.", 6],
];

const professionals = [
  {
    id: "pro-ana",
    name: "Ana Vieira",
    slug: "ana-vieira",
    specialty: "Builder gel, manicure premium e nail art editorial",
    bio: "Especialista em estruturas elegantes, linhas minimalistas e resultados duradouros.",
    email: "ana@luxenails.pt",
    phone: "+351 910 100 200",
    imageUrl: "/placeholders/team-ana.svg",
  },
  {
    id: "pro-clara",
    name: "Clara Melo",
    slug: "clara-melo",
    specialty: "Alongamentos, acrílico e desenhos personalizados",
    bio: "Focada em criações marcantes, reconstrução e soluções técnicas para quem quer estrutura e estilo.",
    email: "clara@luxenails.pt",
    phone: "+351 910 100 201",
    imageUrl: "/placeholders/team-clara.svg",
  },
  {
    id: "pro-marta",
    name: "Marta Soares",
    slug: "marta-soares",
    specialty: "Spa pedicure, manutenção e cuidado natural",
    bio: "Combina conforto, ritmo calmo e grande rigor técnico em serviços de manutenção e pedicure.",
    email: "marta@luxenails.pt",
    phone: "+351 910 100 202",
    imageUrl: "/placeholders/team-marta.svg",
  },
];

const services = [
  {
    id: "srv-signature-manicure",
    categoryId: "cat-manicure",
    name: "Signature Manicure",
    slug: "signature-manicure",
    description: "Preparação completa da unha, cutículas, hidratação intensiva e cor clássica ou nude elegante.",
    durationMinutes: 50,
    price: 22,
    imageUrl: "/placeholders/service-classic.svg",
    professionalSlugs: ["ana-vieira", "marta-soares"],
  },
  {
    id: "srv-spa-pedicure",
    categoryId: "cat-pedicure",
    name: "Spa Pedicure Deluxe",
    slug: "spa-pedicure-deluxe",
    description: "Esfoliação, máscara nutritiva, cuidado de cutículas, verniz de longa duração e massagem relaxante.",
    durationMinutes: 70,
    price: 34,
    imageUrl: "/placeholders/service-spa.svg",
    professionalSlugs: ["clara-melo", "marta-soares"],
  },
  {
    id: "srv-builder-gel",
    categoryId: "cat-gel",
    name: "Builder Gel Natural",
    slug: "builder-gel-natural",
    description: "Estrutura em gel com acabamento natural e brilho espelhado.",
    durationMinutes: 95,
    price: 42,
    imageUrl: "/placeholders/service-gel.svg",
    professionalSlugs: ["ana-vieira", "clara-melo"],
  },
  {
    id: "srv-acrylic-extensions",
    categoryId: "cat-acrilico",
    name: "Extensão Acrílica Sculpted",
    slug: "extensao-acrilica-sculpted",
    description: "Alongamento completo com estrutura personalizada e acabamento elegante.",
    durationMinutes: 120,
    price: 58,
    imageUrl: "/placeholders/service-acrylic.svg",
    professionalSlugs: ["clara-melo"],
  },
  {
    id: "srv-nail-art-premium",
    categoryId: "cat-nail-art",
    name: "Nail Art Premium",
    slug: "nail-art-premium",
    description: "Composição artística personalizada com detalhes premium.",
    durationMinutes: 45,
    price: 18,
    imageUrl: "/placeholders/service-art.svg",
    professionalSlugs: ["ana-vieira", "clara-melo"],
  },
  {
    id: "srv-maintenance-gel",
    categoryId: "cat-manutencao",
    name: "Manutenção de Gel",
    slug: "manutencao-gel",
    description: "Correção de crescimento, reforço estrutural e renovação da cor.",
    durationMinutes: 80,
    price: 36,
    imageUrl: "/placeholders/service-maintenance.svg",
    professionalSlugs: ["ana-vieira", "marta-soares"],
  },
];

const businessHours = [
  [0, "00:00", "00:00", true],
  [1, "09:30", "19:00", false],
  [2, "09:30", "19:00", false],
  [3, "09:30", "19:00", false],
  [4, "09:30", "20:00", false],
  [5, "09:30", "20:00", false],
  [6, "10:00", "17:00", false],
];

const galleryItems = [
  ["gal-1", "Nude minimalista com brilho suave", "manicure", "/placeholders/gallery-nude.svg", "Acabamento limpo e elegante.", true, 1],
  ["gal-2", "French contemporânea dourada", "nail-art", "/placeholders/gallery-french.svg", "Releitura editorial da french manicure.", true, 2],
  ["gal-3", "Pedicure spa em tons rosé", "pedicure", "/placeholders/gallery-pedicure.svg", "Conforto e apresentação premium.", true, 3],
  ["gal-4", "Builder gel natural glossy", "gel", "/placeholders/gallery-gel.svg", "Brilho espelhado para o quotidiano.", false, 4],
];

const testimonials = [
  ["tes-1", "Rita Almeida", 5, "Ambiente lindíssimo, atendimento pontual e unhas perfeitas durante semanas.", "Builder Gel Natural", true, true],
  ["tes-2", "Joana Matos", 5, "Finalmente encontrei um espaço onde a técnica e o bom gosto caminham juntos.", "Spa Pedicure Deluxe", true, true],
  ["tes-3", "Carolina Pires", 5, "Marcação online muito simples e excelente gestão do tempo.", "Signature Manicure", true, true],
];

const faqs = [
  ["faq-1", "Como funciona a marcação online?", "Escolha o serviço, a profissional, a data e a hora disponíveis. Depois preencha os seus dados e recebe confirmação.", 1],
  ["faq-2", "Posso cancelar ou reagendar?", "Sim. Recomendamos fazê-lo com pelo menos 24 horas de antecedência.", 2],
  ["faq-3", "Quanto tempo de atraso é permitido?", "Mantemos uma tolerância até 15 minutos.", 3],
  ["faq-4", "Aceitam pagamento de sinal?", "A estrutura do site já suporta ativação de sinal.", 4],
];

const promotions = [
  ["promo-1", "Glow Week", "Pack manicure + nail art minimal", "Durante esta semana, marque Signature Manicure com detalhe fine line premium por um valor especial.", "Novidade", "Reservar promoção", "/marcacoes", "/placeholders/promo-glow.svg", true],
  ["promo-2", "Pedicure Ritual de Primavera", "Conforto e hidratação profunda", "Serviço sazonal com foco em renovação e hidratação.", "Sazonal", "Ver horários", "/marcacoes", "/placeholders/promo-spring.svg", true],
];

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@luxenails.pt";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { name: "Administradora Principal", passwordHash, role: "SUPER_ADMIN", isActive: true },
    create: {
      name: "Administradora Principal",
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
      notes: "Conta inicial criada pelo seed.",
    },
  });

  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({ data: siteSettings });
  }

  for (const item of pageContents) {
    await prisma.pageContent.upsert({
      where: { slug_sectionKey: { slug: item.slug, sectionKey: item.sectionKey } },
      update: item,
      create: item,
    });
  }

  for (const [id, name, slug, description, sortOrder] of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug },
      update: { id, name, slug, description, sortOrder, isActive: true },
      create: { id, name, slug, description, sortOrder, isActive: true },
    });
  }

  for (const item of professionals) {
    await prisma.professional.upsert({
      where: { slug: item.slug },
      update: { ...item, isActive: true },
      create: { ...item, isActive: true },
    });
  }

  for (const item of services) {
    await prisma.service.upsert({
      where: { slug: item.slug },
      update: {
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        slug: item.slug,
        description: item.description,
        durationMinutes: item.durationMinutes,
        price: item.price,
        imageUrl: item.imageUrl,
        sortOrder: 1,
        isActive: true,
      },
      create: {
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        slug: item.slug,
        description: item.description,
        durationMinutes: item.durationMinutes,
        price: item.price,
        imageUrl: item.imageUrl,
        sortOrder: 1,
        isActive: true,
      },
    });
  }

  const dbServices = await prisma.service.findMany();
  const dbProfessionals = await prisma.professional.findMany();

  for (const professional of dbProfessionals) {
    const supportedServices = dbServices.filter((service) => {
      const source = services.find((item) => item.slug === service.slug);
      return source && source.professionalSlugs.includes(professional.slug);
    });

    for (const service of supportedServices) {
      await prisma.professionalService.upsert({
        where: {
          professionalId_serviceId: {
            professionalId: professional.id,
            serviceId: service.id,
          },
        },
        update: {},
        create: {
          professionalId: professional.id,
          serviceId: service.id,
        },
      });
    }
  }

  await prisma.businessHour.deleteMany();
  for (const [weekday, opensAt, closesAt, isClosed] of businessHours) {
    await prisma.businessHour.create({
      data: {
        weekday,
        opensAt,
        closesAt,
        breakStart: isClosed ? null : "13:00",
        breakEnd: isClosed ? null : "14:00",
        isClosed,
      },
    });
  }

  for (const [id, title, category, imageUrl, description, isFeatured, sortOrder] of galleryItems) {
    await prisma.galleryItem.upsert({
      where: { id },
      update: { title, category, imageUrl, description, isFeatured, sortOrder },
      create: { id, title, category, imageUrl, description, isFeatured, sortOrder },
    });
  }

  for (const [id, clientName, rating, comment, serviceName, isApproved, isFeatured] of testimonials) {
    await prisma.testimonial.upsert({
      where: { id },
      update: { clientName, rating, comment, serviceName, isApproved, isFeatured },
      create: { id, clientName, rating, comment, serviceName, isApproved, isFeatured },
    });
  }

  for (const [id, question, answer, sortOrder] of faqs) {
    await prisma.faqItem.upsert({
      where: { id },
      update: { question, answer, sortOrder, isActive: true },
      create: { id, question, answer, sortOrder, isActive: true },
    });
  }

  for (const [id, title, subtitle, description, badge, ctaLabel, ctaHref, imageUrl, isActive] of promotions) {
    await prisma.promotion.upsert({
      where: { id },
      update: { title, subtitle, description, badge, ctaLabel, ctaHref, imageUrl, isActive },
      create: { id, title, subtitle, description, badge, ctaLabel, ctaHref, imageUrl, isActive },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });