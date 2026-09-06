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
  metaTitle: 'Leyla Məmmədli - SMM & Rəqəmsal Marketinq',
  metaDescription:
    'Sosial media marketoloq təfəkkürü ilə: strategiya, kontent, şəxsi brend və satış. Baxış deyil - sorğu və satış.',
};

const HERO = {
  title: 'Sosial media - marketoloq təfəkkürü ilə.',
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
      'Reels, karusel və hekayə formatları üçün ssenari, çəkiliş rejissurası və montaj standartı. Həftəlik ritm - trend deyil, sistem.',
    features: [
      'Aylıq kontent planı',
      'Ssenari və storyboard',
      'Çəkiliş rejissurası',
      'Montaj və dizayn şablonları',
    ],
    outcome: 'Ayda 12-20 hazır post, sabit vizual dil.',
  },
  {
    title: 'Şəxsi brend',
    description:
      'Ekspert obrazının qurulması: ton, vizual kimlik və daimi mövzu xətti. İzləyici deyil - etibar qazanırıq.',
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
      'Məzmunu gəlirə bağlayan sistem: lead axını, offer strukturu və konversiya təhlili. Baxış deyil - sorğu və satış.',
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

const HOME = {
  introEyebrow: '01 - Yanaşma',
  introStatement:
    'Kontent gözəl görünə bilər - amma satmırsa, işini görmür.',
  introAccent: 'satmırsa',
  introParagraphs: [
    'Mən sosial media hesablarını marketinq sistemi kimi qururam: auditoriya araşdırması, mövqeləndirmə, məzmun xətti və satış qıfı - hamısı bir-birinə bağlı.',
    'Nəticə görünüş deyil, rəqəmdir: daha keyfiyyətli izləyici, daha çox sorğu, daha çox bağlanan satış.',
  ],
  introTags: ['Strategiya', 'Kontent', 'Şəxsi brend', 'Satış qıfı', 'Analitika'],
  numbersEyebrow: '03 - Rəqəmlər',
  stats: [
    { value: 16, suffix: 'K+', label: 'İzləyici auditoriya' },
    { value: 40, suffix: '+', label: 'Tamamlanmış layihə' },
    { value: 6, suffix: ' il', label: 'Sahədə təcrübə' },
    { value: 95, suffix: '%', label: 'Təkrar müraciət' },
  ],
  processEyebrow: '04 - Necə işləyirik',
  processHeadline: 'Kaosdan aydınlığa - üç mərhələ.',
  processSteps: [
    {
      title: 'Kəşf',
      text: 'Biznesin, auditoriyan və rəqiblərin dərin təhlili. Harada olduğunu dəqiq bilmədən hara gedəcəyini planlaya bilmərik.',
      tags: ['Audit', 'Auditoriya', 'Rəqib təhlili'],
    },
    {
      title: 'Sistem',
      text: 'Mövqeləndirmə, məzmun sütunları, vizual dil və satış qıfı - hamısı sənədləşdirilmiş bir plan halında.',
      tags: ['Positioning', 'Rubrikalar', 'Qıf'],
    },
    {
      title: 'İcra',
      text: 'Həftəlik kontent ritmi, çəkiliş rejissurası, montaj standartı və rəqəmlərə görə davamlı düzəliş.',
      tags: ['Ritm', 'Prodakşn', 'Optimizasiya'],
    },
  ],
  coursesEyebrow: '05 - Kurslar',
  coursesHeadline: 'Öyrən, tətbiq et, satışa çevir.',
  courseHow: [
    { t: 'Canlı dərslər', d: 'Hər dərs yazılır, platformada qalır.' },
    { t: 'Praktiki tapşırıq', d: 'Hər dərsdən sonra öz hesabında tətbiq.' },
    { t: 'Fərdi rəy', d: 'Tapşırıqlara birbaşa qeyd və düzəliş.' },
    { t: 'Bağlı icma', d: 'İştirakçılarla ünsiyyət və dəstək.' },
  ],
  courseFaq: [
    { q: 'Dərsləri sonra izləyə bilərəm?', a: 'Bəli. Bütün canlı dərslər yazılır və platformada açıq qalır.' },
    { q: 'Təcrübə lazımdır?', a: 'Yox. Kurslar sıfırdan başlayanlar üçün qurulub, mərhələ-mərhələ gedir.' },
    { q: 'Ödəniş necə olur?', a: 'Qeydiyyatdan sonra sizinlə əlaqə saxlanılır, format və şərtlər razılaşdırılır.' },
    { q: 'Qrup nə qədərdir?', a: 'Fərdi diqqət üçün hər axın məhdud sayda iştirakçı ilə keçir.' },
  ],
  quotesEyebrow: '06 - Rəylər',
};

const COURSES = [
  {
    slug: 'smm-sistemi',
    title: 'SMM Sistemi',
    meta: '6 həftə · canlı',
    format: '6 həftə · həftədə 2 canlı dərs · online',
    description:
      'Sıfırdan bir SMM sistemi qurursan: auditoriya, mövqeləndirmə, məzmun ritmi və satış qıfı. Nəzəriyyə yox - hər dərsdən sonra öz hesabında tətbiq edirsən.',
    program: [
      'Auditoriya və rəqib təhlili',
      'Mövqeləndirmə və offer',
      'Məzmun sütunları və plan',
      'Reels və format sistemi',
      'Satış qıfı və DM',
      'Analitika və düzəliş',
    ],
    audience: 'Öz brendini və ya kiçik biznesini idarə edənlər.',
    outcome: 'Hazır 90 günlük plan + işləyən satış qıfı.',
  },
  {
    slug: 'reels-laboratoriyasi',
    title: 'Reels Laboratoriyası',
    meta: '3 həftə · praktiki',
    format: '3 həftə · praktiki · həftəlik təhvil',
    description:
      'Reels-i sistemə çevirirsən: ssenari, çəkiliş, montaj və trend oxuma. Hər həftə yeni format, hər format üçün şablon.',
    program: [
      'Hook və struktur',
      'Ssenari şablonları',
      'Çəkiliş və işıq',
      'Montaj standartı',
      'Trend oxuma',
      'Yayım və analitika',
    ],
    audience: 'Kontent çəkən, amma nəticə görməyənlər.',
    outcome: 'Həftədə 3-5 hazır Reels, sabit baxış artımı.',
  },
  {
    slug: 'sexsi-brend-intensiv',
    title: 'Şəxsi Brend Intensiv',
    meta: '2 həftə · sprint',
    format: '2 həftə · sprint · fərdi rəy',
    description:
      'İki həftədə ekspert obrazını qurursan: ton, vizual dil və daimi mövzu xətti. İzləyici deyil - etibar qazanırsan.',
    program: [
      'Dəyər və ton xəritəsi',
      'Vizual kimlik',
      'Rubrika sistemi',
      'Şəxsi hekayə çərçivəsi',
      'İlk 30 günün planı',
    ],
    audience: 'Sahəsində tanınmaq istəyən mütəxəssislər.',
    outcome: 'Tanınan mövqe + 30 günlük kontent planı.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'İlk dəfə hesabımın arxasında aydın strategiya olduğunu hiss etdim. Sorğular üç həftəyə ikiqat artdı.',
    author: 'Nərgiz A.',
    role: 'Kosmetika brendi',
  },
  {
    quote:
      'Kontent çəkməyi dayandırıb sistem qurduq. İndi komanda mənsiz də ritmi saxlayır.',
    author: 'Elvin M.',
    role: 'Kofe brendi, kurs iştirakçısı',
  },
];

async function main() {
  console.log('Seeding CMS content (settings / hero / home / services / portfolio / courses / testimonials)...');

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

  await prisma.homeContent.upsert({
    where: { id: 1 },
    update: HOME,
    create: { id: 1, ...HOME },
  });

  await prisma.course.deleteMany();
  for (let i = 0; i < COURSES.length; i++) {
    await prisma.course.create({
      data: { sortOrder: i, isPublished: true, ...COURSES[i] },
    });
  }

  await prisma.testimonial.deleteMany();
  for (let i = 0; i < TESTIMONIALS.length; i++) {
    await prisma.testimonial.create({
      data: { sortOrder: i, isPublished: true, ...TESTIMONIALS[i] },
    });
  }

  console.log(
    `Done: settings, hero, home, ${SERVICES.length} services, ${PORTFOLIO.length} portfolio, ${COURSES.length} courses, ${TESTIMONIALS.length} testimonials.`
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
