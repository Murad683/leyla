/**
 * One-time content seed for Phase A (admin CMS -> live v2 site wiring).
 *
 * Populates SiteSettings, HeroSection, ServiceItem (4) and PortfolioItem (5)
 * with the EXACT text/images the v2 frontend currently hard-codes, so the
 * public site looks unchanged once the pages start reading from the API.
 *
 * Does NOT touch User or Contact. Safe to run against the live DB.
 * Re-running overwrites Settings/Hero/Services/Portfolio with these defaults
 * (so run it once, before Leyla starts editing in the admin panel).
 *
 *   docker compose -f deploy/compose.yml exec -T leyla-api node /app/prisma/seed-content.js
 */
const { PrismaClient } = require('./generated/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const SETTINGS = {
  logoUrl: null,
  phone: null,
  email: null,
  address: 'Bakı, Azərbaycan',
  facebookUrl: null,
  instagramUrl: 'https://www.instagram.com/leiylamammadly/',
  linkedinUrl: null,
  twitterUrl: null,
  metaTitle: 'Leyla Məmmədli — SMM & Rəqəmsal Marketinq',
  metaDescription:
    'Sosial media marketoloq təfəkkürü ilə: strategiya, kontent, şəxsi brend və satış. Baxış deyil — sorğu və satış.',
};

const HERO = {
  title: 'Sosial media — marketoloq təfəkkürü ilə.',
  accentText: 'marketoloq',
  subtitle: '',
  description: '',
  backgroundImage: '',
  ctaLabel: '',
  ctaHref: '',
  videoUrl: '',
  secondaryBtnText: '',
  secondaryBtnHref: '',
};

const SERVICES = [
  {
    title: 'Strategiya',
    description:
      'Auditoriya araşdırması, mövqeləndirmə və 90 günlük məzmun-satış planı. Hər qərarın arxasında ölçülə bilən məqsəd dayanır.',
    features: [
      'Auditoriya və rəqib auditi',
      'Mövqeləndirmə sənədi',
      'Məzmun sütunları',
      'Satış qıfı xəritəsi',
    ],
    outcome: 'Komandanın icra edə biləcəyi yazılı strateji sənəd.',
  },
  {
    title: 'Kontent',
    description:
      'Reels, karusel və hekayə formatları üçün ssenari, çəkiliş rejissurası və montaj standartı. Həftəlik ritm — trend deyil, sistem.',
    features: [
      'Aylıq kontent planı',
      'Ssenari və storyboard',
      'Çəkiliş rejissurası',
      'Montaj və dizayn şablonları',
    ],
    outcome: 'Ayda 12–20 hazır post, sabit vizual dil.',
  },
  {
    title: 'Şəxsi brend',
    description:
      'Ekspert obrazının qurulması: ton, vizual kimlik və daimi mövzu xətti. İzləyici deyil — etibar qazanırıq.',
    features: [
      'Ton və dəyər xəritəsi',
      'Vizual kimlik',
      'Rubrika sistemi',
      'Şəxsi hekayə çərçivəsi',
    ],
    outcome: 'Tanınan, yadda qalan ekspert mövqeyi.',
  },
  {
    title: 'Satış',
    description:
      'Məzmunu gəlirə bağlayan sistem: lead axını, offer strukturu və konversiya təhlili. Baxış deyil — sorğu və satış.',
    features: [
      'Lead-magnit və offer',
      'DM və qıf skriptləri',
      'Analitika paneli',
      'Aylıq nəticə hesabatı',
    ],
    outcome: 'Ölçülə bilən sorğu axını və konversiya.',
  },
];

const PORTFOLIO = [
  {
    slug: 'nergiz-kosmetika',
    title: 'Nərgiz Kosmetika',
    year: '2024',
    thumbnail: '/work-1.webp',
    tint: 'var(--field-1)',
    tags: ['Şəxsi brend', 'Reels'],
    summary:
      'Sahibkarın öz səsini tapdığı şəxsi brend sistemi. Ton, vizual dil və həftəlik Reels ritmi bir yerə gətirildi.',
    resultHeadline: '3 ayda +48K izləyici',
    results: [
      { label: 'İzləyici artımı', value: '+48K' },
      { label: 'Orta çatım', value: '6.2×' },
      { label: 'Reels / həftə', value: '4' },
    ],
  },
  {
    slug: 'baku-coffee-lab',
    title: 'Baku Coffee Lab',
    year: '2024',
    thumbnail: '/work-2.webp',
    tint: 'var(--field-2)',
    tags: ['Strategiya', 'Kontent'],
    summary:
      'Menyu təqdimatından sifariş axınına qədər tam məzmun strategiyası. 90 günlük plan komanda tərəfindən icra edildi.',
    resultHeadline: 'Sifarişlərdə 2.1× artım',
    results: [
      { label: 'Onlayn sifariş', value: '2.1×' },
      { label: 'Profil ziyarəti', value: '+180%' },
      { label: 'Saxlanma', value: '41%' },
    ],
  },
  {
    slug: 'studio-mas',
    title: 'Studio Mās',
    year: '2023',
    thumbnail: '/work-3.webp',
    tint: 'var(--field-3)',
    tags: ['Vizual dil', 'Satış qıfı'],
    summary:
      'Memarlıq studiyası üçün vizual kimlik və lead qıfı. Hər post bir sorğuya aparan aydın yol ilə quruldu.',
    resultHeadline: 'Ayda 120+ sorğu',
    results: [
      { label: 'Aylıq sorğu', value: '120+' },
      { label: 'Qıf konversiyası', value: '9.4%' },
      { label: 'Cavab vaxtı', value: '< 2 saat' },
    ],
  },
  {
    slug: 'terra-wellness',
    title: 'Terra Wellness',
    year: '2023',
    thumbnail: '/work-4.webp',
    tint: 'var(--field-4)',
    tags: ['Kontent', 'Analitika'],
    summary:
      'Onlayn kurs buraxılışı üçün məzmun və analitika dövrü. Hər həftə rəqəmlərə görə düzəliş edildi.',
    resultHeadline: 'Kursda 340 qeydiyyat',
    results: [
      { label: 'Kurs qeydiyyatı', value: '340' },
      { label: 'Səhifə konversiyası', value: '12%' },
      { label: 'E-poçt siyahısı', value: '+2.6K' },
    ],
  },
  {
    slug: 'lumen-estetika',
    title: 'Lumen Estetika',
    year: '2022',
    thumbnail: '/work-5.webp',
    tint: 'var(--field-5)',
    tags: ['Şəxsi brend', 'Reels'],
    summary:
      'Həkimin ekspert obrazı: izahedici Reels formatı, sabit rubrikalar və etibar quran hekayə xətti.',
    resultHeadline: 'Reels-də 1.4M baxış',
    results: [
      { label: 'Reels baxış', value: '1.4M' },
      { label: 'Yeni izləyici', value: '+31K' },
      { label: 'Konsultasiya', value: '+64%' },
    ],
  },
];

async function main() {
  console.log('Seeding Phase A content (settings / hero / services / portfolio)…');

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: SETTINGS,
    create: { id: 1, ...SETTINGS },
  });

  await prisma.heroSection.upsert({
    where: { id: 1 },
    update: HERO,
    create: { id: 1, ...HERO },
  });

  await prisma.serviceItem.deleteMany();
  for (let i = 0; i < SERVICES.length; i++) {
    await prisma.serviceItem.create({
      data: { icon: '', sortOrder: i, ...SERVICES[i] },
    });
  }

  await prisma.portfolioItem.deleteMany();
  for (let i = 0; i < PORTFOLIO.length; i++) {
    await prisma.portfolioItem.create({
      data: { sortOrder: i, isPublished: true, ...PORTFOLIO[i] },
    });
  }

  console.log(
    `Done: settings, hero, ${SERVICES.length} services, ${PORTFOLIO.length} portfolio items.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
