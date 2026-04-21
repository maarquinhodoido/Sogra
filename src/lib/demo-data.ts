export type SiteSettingsData = {
  businessName: string;
  tagline: string;
  businessEmail: string;
  bookingEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  postalCode: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  heroImageUrl: string;
  logoUrl: string;
  faviconUrl: string;
  bookingBufferMinutes: number;
  maxAppointmentsPerDay: number;
  allowDeposits: boolean;
  depositAmount: number;
  loyaltyEnabled: boolean;
  couponsEnabled: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  consentLabel: string;
};

export type PageContentData = {
  slug: string;
  sectionKey: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type BannerData = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  placement: string;
  isActive?: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
};

export type ServiceCategoryData = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type ServiceData = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
  professionalSlugs: string[];
};

export type ProfessionalData = {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  bio: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  isActive?: boolean;
};

export type BusinessHourData = {
  weekday: number;
  opensAt: string;
  closesAt: string;
  breakStart?: string;
  breakEnd?: string;
  isClosed?: boolean;
  professionalSlug?: string;
};

export type TimeOffData = {
  title: string;
  reason?: string;
  startsAt: Date;
  endsAt: Date;
  isAllDay?: boolean;
  professionalSlug?: string;
};

export type GalleryItemData = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText?: string;
  description?: string;
  isFeatured?: boolean;
  sortOrder?: number;
};

export type TestimonialData = {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  serviceName?: string;
  isApproved?: boolean;
  isFeatured?: boolean;
};

export type FaqData = {
  id: string;
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type PromotionData = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  isActive?: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
};

export const demoSiteSettings: SiteSettingsData = {
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
    "Salão premium de unhas em Lisboa com manicure, pedicure, gel, acrílico, nail art, marcações online e gestão completa de agenda.",
  metaKeywords:
    "salão de unhas lisboa, manicure, pedicure, nail art, gel, acrílico, marcações online, unhas premium",
  consentLabel:
    "Autorizo o tratamento dos meus dados para marcação, contacto e envio de informações sobre o serviço solicitado.",
};

export const demoPageContents: PageContentData[] = [
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
    slug: "home",
    sectionKey: "about",
    title: "Detalhe, conforto e consistência em cada visita.",
    subtitle: "Uma experiência pensada para quem valoriza qualidade sem pressa.",
    content:
      "Criámos um espaço luminoso, sereno e organizado para que cada marcação decorra com tranquilidade, higiene rigorosa e acompanhamento profissional do início ao fim.",
    imageUrl: "/placeholders/studio-space.svg",
    isActive: true,
    sortOrder: 2,
  },
  {
    slug: "sobre",
    sectionKey: "story",
    title: "Um atelier nascido da paixão pela estética cuidada.",
    subtitle: "Entre beleza, bem-estar e serviço personalizado.",
    content:
      "O Luxe Nails Atelier foi pensado para mulheres que procuram um serviço premium, limpo, profissional e com atenção verdadeira ao detalhe. Cada cliente é recebida com diagnóstico personalizado, proposta estética coerente e acompanhamento ao longo do tempo.",
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
      "Recolhemos apenas os dados necessários para processar marcações, responder a pedidos de contacto e gerir a relação comercial. Os dados são tratados com base no consentimento da cliente e/ou na execução do serviço solicitado. Pode pedir acesso, retificação ou eliminação dos seus dados através do email geral do espaço.",
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
      "As marcações dependem de disponibilidade e podem exigir sinal, quando ativo. Atrasos superiores a 15 minutos podem implicar remarcação. Cancelamentos devem ser feitos com antecedência mínima de 24 horas. O atelier reserva-se ao direito de ajustar horários por motivos operacionais, comunicando sempre com a cliente.",
    metaTitle: "Termos e Condições | Luxe Nails Atelier",
    metaDescription: "Regras de marcação, cancelamento e funcionamento do espaço.",
    isActive: true,
    sortOrder: 1,
  },
];

export const demoBanners: BannerData[] = [
  {
    id: "banner-home-main",
    title: "Novas clientes recebem avaliação estética gratuita na primeira visita.",
    subtitle: "Campanha de boas-vindas durante este mês.",
    imageUrl: "/placeholders/banner-premium.svg",
    ctaLabel: "Agendar Visita",
    ctaHref: "/marcacoes",
    placement: "home-hero",
    isActive: true,
  },
];

export const demoServiceCategories: ServiceCategoryData[] = [
  {
    id: "cat-manicure",
    name: "Manicure",
    slug: "manicure",
    description: "Cuidados de mãos com acabamento clássico ou premium.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "cat-pedicure",
    name: "Pedicure",
    slug: "pedicure",
    description: "Tratamentos para pés com foco em conforto e apresentação.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "cat-gel",
    name: "Gel e Builder",
    slug: "gel-builder",
    description: "Estrutura, durabilidade e brilho elegante.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "cat-acrilico",
    name: "Acrílico",
    slug: "acrilico",
    description: "Alongamento com desenho e resistência.",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "cat-nail-art",
    name: "Nail Art",
    slug: "nail-art",
    description: "Detalhes artísticos para eventos e coleções sazonais.",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "cat-manutencao",
    name: "Manutenção e Remoção",
    slug: "manutencao-remocao",
    description: "Serviços de manutenção, reforço e remoção segura.",
    sortOrder: 6,
    isActive: true,
  },
];

export const demoServices: ServiceData[] = [
  {
    id: "srv-signature-manicure",
    categoryId: "cat-manicure",
    name: "Signature Manicure",
    slug: "signature-manicure",
    description: "Preparação completa da unha, cutículas, hidratação intensiva e cor clássica ou nude elegante.",
    durationMinutes: 50,
    price: 22,
    imageUrl: "/placeholders/service-classic.svg",
    isActive: true,
    sortOrder: 1,
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
    isActive: true,
    sortOrder: 1,
    professionalSlugs: ["clara-melo", "marta-soares"],
  },
  {
    id: "srv-builder-gel",
    categoryId: "cat-gel",
    name: "Builder Gel Natural",
    slug: "builder-gel-natural",
    description: "Estrutura em gel com acabamento natural, reforço e brilho espelhado para rotina exigente.",
    durationMinutes: 95,
    price: 42,
    imageUrl: "/placeholders/service-gel.svg",
    isActive: true,
    sortOrder: 1,
    professionalSlugs: ["ana-vieira", "clara-melo"],
  },
  {
    id: "srv-acrylic-extensions",
    categoryId: "cat-acrilico",
    name: "Extensão Acrílica Sculpted",
    slug: "extensao-acrilica-sculpted",
    description: "Alongamento completo com estrutura personalizada e acabamento elegante de alta durabilidade.",
    durationMinutes: 120,
    price: 58,
    imageUrl: "/placeholders/service-acrylic.svg",
    isActive: true,
    sortOrder: 1,
    professionalSlugs: ["clara-melo"],
  },
  {
    id: "srv-nail-art-premium",
    categoryId: "cat-nail-art",
    name: "Nail Art Premium",
    slug: "nail-art-premium",
    description: "Composição artística personalizada com cromados, detalhes pintados à mão e aplicação de elementos premium.",
    durationMinutes: 45,
    price: 18,
    imageUrl: "/placeholders/service-art.svg",
    isActive: true,
    sortOrder: 1,
    professionalSlugs: ["ana-vieira", "clara-melo"],
  },
  {
    id: "srv-maintenance-gel",
    categoryId: "cat-manutencao",
    name: "Manutenção de Gel",
    slug: "manutencao-gel",
    description: "Correção de crescimento, reforço estrutural e renovação da cor para manter o resultado impecável.",
    durationMinutes: 80,
    price: 36,
    imageUrl: "/placeholders/service-maintenance.svg",
    isActive: true,
    sortOrder: 1,
    professionalSlugs: ["ana-vieira", "marta-soares"],
  },
  {
    id: "srv-removal-care",
    categoryId: "cat-manutencao",
    name: "Remoção Segura + Tratamento",
    slug: "remocao-segura-tratamento",
    description: "Remoção cuidadosa do material com proteção da lâmina ungueal e finalização hidratante.",
    durationMinutes: 35,
    price: 16,
    imageUrl: "/placeholders/service-removal.svg",
    isActive: true,
    sortOrder: 2,
    professionalSlugs: ["marta-soares", "clara-melo"],
  },
];

export const demoProfessionals: ProfessionalData[] = [
  {
    id: "pro-ana",
    name: "Ana Vieira",
    slug: "ana-vieira",
    specialty: "Builder gel, manicure premium e nail art editorial",
    bio: "Especialista em estruturas elegantes, linhas minimalistas e resultados duradouros para clientes que procuram sofisticação sem excessos.",
    email: "ana@luxenails.pt",
    phone: "+351 910 100 200",
    imageUrl: "/placeholders/team-ana.svg",
    isActive: true,
  },
  {
    id: "pro-clara",
    name: "Clara Melo",
    slug: "clara-melo",
    specialty: "Alongamentos, acrílico e desenhos personalizados",
    bio: "Focada em criações marcantes, reconstrução e soluções técnicas para quem quer estrutura, estilo e resistência.",
    email: "clara@luxenails.pt",
    phone: "+351 910 100 201",
    imageUrl: "/placeholders/team-clara.svg",
    isActive: true,
  },
  {
    id: "pro-marta",
    name: "Marta Soares",
    slug: "marta-soares",
    specialty: "Spa pedicure, manutenção e cuidado natural",
    bio: "Combina conforto, ritmo calmo e grande rigor técnico em serviços de manutenção, pedicure e recuperação da unha natural.",
    email: "marta@luxenails.pt",
    phone: "+351 910 100 202",
    imageUrl: "/placeholders/team-marta.svg",
    isActive: true,
  },
];

export const demoBusinessHours: BusinessHourData[] = [
  { weekday: 0, opensAt: "00:00", closesAt: "00:00", isClosed: true },
  { weekday: 1, opensAt: "09:30", closesAt: "19:00", breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 2, opensAt: "09:30", closesAt: "19:00", breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 3, opensAt: "09:30", closesAt: "19:00", breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 4, opensAt: "09:30", closesAt: "20:00", breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 5, opensAt: "09:30", closesAt: "20:00", breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 6, opensAt: "10:00", closesAt: "17:00", breakStart: "13:30", breakEnd: "14:00" },
];

export const demoTimeOffs: TimeOffData[] = [
  {
    title: "Formação interna da equipa",
    reason: "Atualização técnica trimestral",
    startsAt: new Date("2026-05-11T09:00:00.000Z"),
    endsAt: new Date("2026-05-11T13:00:00.000Z"),
    isAllDay: false,
  },
];

export const demoGalleryItems: GalleryItemData[] = [
  {
    id: "gal-1",
    title: "Nude minimalista com brilho suave",
    category: "manicure",
    imageUrl: "/placeholders/gallery-nude.svg",
    altText: "Manicure nude premium",
    description: "Acabamento limpo, brilho delicado e formato almond elegante.",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: "gal-2",
    title: "French contemporânea dourada",
    category: "nail-art",
    imageUrl: "/placeholders/gallery-french.svg",
    altText: "French manicure com detalhe dourado",
    description: "Releitura editorial da french manicure com traço metálico fino.",
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: "gal-3",
    title: "Pedicure spa em tons rosé",
    category: "pedicure",
    imageUrl: "/placeholders/gallery-pedicure.svg",
    altText: "Pedicure premium rosé",
    description: "Tom sofisticado e acabamento uniforme pensado para conforto e longevidade.",
    isFeatured: true,
    sortOrder: 3,
  },
  {
    id: "gal-4",
    title: "Builder gel natural glossy",
    category: "gel",
    imageUrl: "/placeholders/gallery-gel.svg",
    altText: "Builder gel glossy natural",
    description: "Reforço elegante com brilho espelhado para o quotidiano.",
    isFeatured: false,
    sortOrder: 4,
  },
  {
    id: "gal-5",
    title: "Acrílico sculpted com design fine line",
    category: "acrilico",
    imageUrl: "/placeholders/gallery-acrylic.svg",
    altText: "Alongamento acrílico com detalhe fine line",
    description: "Estrutura precisa com detalhe artístico discreto.",
    isFeatured: false,
    sortOrder: 5,
  },
  {
    id: "gal-6",
    title: "Coleção bridal soft pearl",
    category: "nail-art",
    imageUrl: "/placeholders/gallery-bridal.svg",
    altText: "Nail art bridal com pérolas suaves",
    description: "Inspirado em eventos especiais e cerimónias elegantes.",
    isFeatured: true,
    sortOrder: 6,
  },
];

export const demoTestimonials: TestimonialData[] = [
  {
    id: "tes-1",
    clientName: "Rita Almeida",
    rating: 5,
    comment:
      "Ambiente lindíssimo, atendimento pontual e unhas perfeitas durante semanas. A experiência sente-se premium em todos os detalhes.",
    serviceName: "Builder Gel Natural",
    isApproved: true,
    isFeatured: true,
  },
  {
    id: "tes-2",
    clientName: "Joana Matos",
    rating: 5,
    comment:
      "Finalmente encontrei um espaço onde a técnica e o bom gosto caminham juntos. A pedicure spa é impecável.",
    serviceName: "Spa Pedicure Deluxe",
    isApproved: true,
    isFeatured: true,
  },
  {
    id: "tes-3",
    clientName: "Carolina Pires",
    rating: 5,
    comment:
      "Marcação online muito simples, atendimento acolhedor e excelente gestão do tempo. Volto sempre.",
    serviceName: "Signature Manicure",
    isApproved: true,
    isFeatured: true,
  },
];

export const demoFaqs: FaqData[] = [
  {
    id: "faq-1",
    question: "Como funciona a marcação online?",
    answer:
      "Escolha o serviço, a profissional, a data e a hora disponíveis. Depois preencha os seus dados e recebe confirmação imediata no ecrã e por email quando configurado.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "faq-2",
    question: "Posso cancelar ou reagendar?",
    answer:
      "Sim. Recomendamos fazê-lo com pelo menos 24 horas de antecedência. Após a marcação, recebe um link de gestão para cancelar ou reagendar consoante a disponibilidade.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "faq-3",
    question: "Quanto tempo de atraso é permitido?",
    answer:
      "Mantemos uma tolerância até 15 minutos. Acima desse limite, a equipa pode precisar de reajustar ou remarcar o serviço para não afetar a agenda seguinte.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "faq-4",
    question: "Aceitam pagamento de sinal?",
    answer:
      "A estrutura do site já suporta ativação de sinal. Quando ativo, a informação aparece no fluxo de marcação e na confirmação.",
    sortOrder: 4,
    isActive: true,
  },
];

export const demoPromotions: PromotionData[] = [
  {
    id: "promo-1",
    title: "Glow Week",
    subtitle: "Pack manicure + nail art minimal",
    description:
      "Durante esta semana, marque Signature Manicure com detalhe fine line premium por um valor especial.",
    badge: "Novidade",
    ctaLabel: "Reservar promoção",
    ctaHref: "/marcacoes",
    imageUrl: "/placeholders/promo-glow.svg",
    isActive: true,
  },
  {
    id: "promo-2",
    title: "Pedicure Ritual de Primavera",
    subtitle: "Conforto e hidratação profunda",
    description:
      "Serviço sazonal com foco em renovação, esfoliação suave e tons rosé selecionados pela equipa.",
    badge: "Sazonal",
    ctaLabel: "Ver horários",
    ctaHref: "/marcacoes",
    imageUrl: "/placeholders/promo-spring.svg",
    isActive: true,
  },
];
