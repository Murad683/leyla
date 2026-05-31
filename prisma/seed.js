const { PrismaClient } = require('./generated/client');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log('Clearing existing data...');
  
  // Clear all data (order matters due to foreign keys if there were any, but here no relations)
  await prisma.aboutValue.deleteMany();
  await prisma.aboutExperience.deleteMany();
  await prisma.serviceItem.deleteMany();
  await prisma.aboutSection.deleteMany();
  await prisma.heroSection.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding new data...');

  // 1. Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@leyladigital.com',
      passwordHash,
      name: 'Admin',
    },
  });

  // 2. Site Settings
  await prisma.siteSettings.create({
    data: {
      id: 1,
      logoUrl: '/logo.svg',
      phone: '+994 50 123 45 67',
      email: 'info@leyladigital.com',
      address: 'Baku, Azerbaijan',
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      linkedinUrl: 'https://linkedin.com',
      twitterUrl: 'https://twitter.com',
      metaTitle: 'LeylaDigital - Rəqəmsal Marketinq Agentliyi',
      metaDescription: 'Biznesinizi onlayn dünyada böyüdən peşəkar rəqəmsal marketinq və inkişaf agentliyi.',
    },
  });

  // 3. Hero Section
  await prisma.heroSection.create({
    data: {
      id: 1,
      title: 'Biznesinizi Rəqəmsal Dünyada Böyüdürük',
      subtitle: 'Nəticəyə Yönümlü Marketinq Strategiyaları',
      description: 'Brendinizin səsini duyurmaq və satışlarınızı artırmaq üçün data-əsaslı və yaradıcı rəqəmsal həllər təklif edirik. Sizin uğurunuz, bizim məqsədimizdir.',
      backgroundImage: '/hero_visual.png',
      ctaLabel: 'Bizimlə Əlaqə',
      ctaHref: '/contact',
    },
  });

  // 4. About Section
  await prisma.aboutSection.create({
    data: {
      id: 1,
      story: "Mən brendləri ucaldan və biznesləri böyüdən strateji kampaniyalar yaratmağa həvəsli rəqəmsal marketoloq və reklam strateqiyəm. Yaradıcı yanaşma və analitik təhlil ehtirası ilə mən yaradıcı baxış və effektiv satış nəticələri arasındakı boşluğu doldururam. Yanaşmam hər bir müştərinin unikal dəyər təklifini başa düşmək və onu gəlir gətirən rəqəmsal reklam kampaniyalarına çevirmək üzərində qurulub.",
      experienceYears: 5,
      mainImage: '/about_visual.png',
      skills: ['Google Ads', 'Facebook/Meta Reklamları', 'Data Analitika', 'Kopiraytinq', 'SMM Strategiyası', 'Brendinq'],
    },
  });

  // 5. About Values
  await prisma.aboutValue.createMany({
    data: [
      { icon: 'QualityIcon', title: 'Nəticəyə Yönümlülük', description: 'Təqdim olunan hər bir kampaniyanın real satış və artım gətirməsini təmin etmək.' },
      { icon: 'InnovationIcon', title: 'Data-Driven Yanaşma', description: 'Həmişə rəqəmlərə və analitikaya əsaslanan qərarlar qəbul etmək.' },
      { icon: 'CollaborationIcon', title: 'Strateji Tərəfdaşlıq', description: 'Müştərilərimizi sadəcə sifarişçi deyil, ortaq hədəflərə qaçan tərəfdaş kimi görmək.' }
    ],
  });

  // 6. About Experiences
  await prisma.aboutExperience.createMany({
    data: [
      { year: '2023 - Hazırda', role: 'Baş Marketinq Strateqi', company: 'AdVantage Agency' },
      { year: '2020 - 2023', role: 'Performans Marketoloq', company: 'Growth Hub' },
      { year: '2018 - 2020', role: 'SMM Menecer', company: 'Digital Pulse' }
    ],
  });

  // 7. Services
  await prisma.serviceItem.createMany({
    data: [
      {
        icon: 'StrategyIcon',
        title: 'Brend Strategiyası',
        description: 'Sizin üçün rəqiblərinizdən fərqlənən, yadda qalan və hədəf auditoriyanıza birbaşa toxunan brend kimliyi hazırlayırıq.',
        features: ['Bazar Analizi', 'Brendin Mövqeləndirilməsi', 'Kommunikasiya Strategiyası'],
        ctaLabel: 'Daha Ətraflı',
        ctaHref: '/contact'
      },
      {
        icon: 'DevIcon',
        title: 'Performans Marketinqi',
        description: 'Satışlarınızı və konversiyanızı artırmaq üçün nəticəyə yönümlü, rəqəmlərə əsaslanan reklam kampaniyaları.',
        features: ['Google Ads (PPC)', 'Meta (FB/IG) Reklamları', 'Retargetinq Strategiyaları'],
        ctaLabel: 'Daha Ətraflı',
        ctaHref: '/contact'
      },
      {
        icon: 'DesignIcon',
        title: 'Sosial Media İdarəçiliyi',
        description: 'Brendinizin sosial platformalarda vizual görünüşünü və auditoriya ilə olan bağını peşəkar şəkildə idarə edirik.',
        features: ['SMM Strategiyası', 'Kreativ Kontent Yaradılması', 'İcma (Community) İdarəçiliyi'],
        ctaLabel: 'Daha Ətraflı',
        ctaHref: '/contact'
      },
      {
        icon: 'SeoIcon',
        title: 'SEO və Artım (Growth)',
        description: 'Axtarış sistemlərində ön sıralara çıxmaq və üzvi trafikinizi davamlı şəkildə artırmaq üçün optimizasiya.',
        features: ['Texniki SEO', 'Məzmun Optimizasiyası', 'Link Building'],
        ctaLabel: 'Daha Ətraflı',
        ctaHref: '/contact'
      },
      {
        icon: 'ContentIcon',
        title: 'Kopiraytinq və Reklam Mətni',
        description: 'İnsanları hərəkətə keçirən, satışa yönəlmiş və emosional bağ quran təsirli reklam mətnlərinin yazılması.',
        features: ['Satış Mətnləri', 'Email Marketinq', 'Blog və Məqalə Yazımı'],
        ctaLabel: 'Daha Ətraflı',
        ctaHref: '/contact'
      },
      {
        icon: 'ConsultIcon',
        title: 'Marketinq Konsaltinq',
        description: 'Biznesinizi miqyaslandırmaq üçün ekspert rəyi və addım-addım strateji fəaliyyət planları.',
        features: ['Auditoriya Seqmentasiyası', 'Satış Hunisi (Sales Funnel)', 'ROI Analizi'],
        ctaLabel: 'Daha Ətraflı',
        ctaHref: '/contact'
      }
    ],
  });

  // 8. Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        slug: 'digital-marketing-roi-strategies', 
        title: 'Rəqəmsal Marketinqdə ROI-ni Necə Artırmalı?', 
        excerpt: 'Reklam büdcənizin hər qəpiyinin sizə qazanc gətirməsi üçün tətbiq etməli olduğunuz əsas strategiyalar və analitik yanaşmalar.', 
        category: 'Performans Marketinqi', 
        tags: ['Google Ads', 'ROI', 'Analitika', 'Satış'], 
        readTime: 6, 
        publishedAt: new Date('2026-05-09T10:00:00Z'), 
        featured: true, 
        coverImage: '/hero_visual.png',
        content: `## Giriş\nMüasir rəqəmsal dünyada reklam vermək kifayət deyil. Əsas məqsəd reklam büdcəsinin səmərəliliyini (ROI) maksimuma çatdırmaqdır. Bir çox bizneslər reklam büdcəsini "xərcləyir", lakin strateji marketinq büdcəni "investisiya" kimi görür.\n\n## Strategiya və Analitika\nİlk növbədə, hədəf auditoriyanın düzgün seqmentasiyası vacibdir. Hamıya reklam göstərmək, heç kimə reklam göstərməməkdir. Biz A/B testləri vasitəsilə ən çox konversiya gətirən auditoriyaları müəyyən edirik.\n\n## Konversiya Optimizasiyası\nReklamın gətirdiyi trafikin satışa çevrilməsi üçün "Landing Page" optimizasiyası şərtdir. Mətnlərin təsirli olması və CTA (hərəkətə çağırış) düymələrinin düzgün yerləşdirilməsi satış ehtimalını 2 dəfə artıra bilər.\n\n> "Marketinq sadəcə kreativlik deyil, həm də rəqəmlərin dilini anlamaqdır."\n\n## Nəticə\nDüzgün qurulmuş rəqəmsal strategiya ilə siz nəinki müştəri sayınızı artıra, həm də bir müştərinin cəlb edilməsi xərclərini (CPA) əhəmiyyətli dərəcədə azalda bilərsiniz.`, 
        authorName: 'LeylaDigital'
      },
      {
        slug: 'social-media-branding-2026', 
        title: '2026-cı ildə Sosial Media Brendinqi', 
        excerpt: 'Brendinizin sosial platformalarda necə yadda qalan olması və sadiq auditoriya toplamasının yolları.', 
        category: 'SMM Strategiyası', 
        tags: ['Brendinq', 'Instagram', 'Tiktok', 'Kontent'], 
        readTime: 4, 
        publishedAt: new Date('2026-05-08T15:30:00Z'), 
        featured: false, 
        coverImage: '/about_visual.png',
        content: `## Sosial Medianın Gücü\nSosial media artıq sadəcə şəkil paylaşmaq yeri deyil, brendin xarakterini göstərdiyi platformadır. İnsanlar brendlərdən səmimiyyət və dəyər gözləyirlər.\n\n## Kontent Strategiyası\nKeyfiyyət kəmiyyətdən üstündür. Hər gün maraqsız post paylaşmaqdansa, həftədə 3 dəfə auditoriyanın problemini həll edən və ya onlara ilham verən kontent paylaşmaq daha effektivdir.`, 
        authorName: 'LeylaDigital'
      }
    ]
  });

  // 9. Portfolio Items
  await prisma.portfolioItem.createMany({
    data: [
      {
        slug: 'real-estate-lead-gen', 
        title: 'Daşınmaz Əmlak Satış Kampaniyası', 
        category: 'Performans Marketinqi', 
        tags: ['Meta Ads', 'Lead Generation', 'Satış Hunisi'], 
        summary: 'Yeni yaşayış kompleksi üçün 3 ay ərzində 500+ yüksək keyfiyyətli müştəri sorğusunun (lead) toplanması və satışların 25% artırılması.', 
        featured: true, 
        year: '2024', 
        client: 'Modern Residence', 
        duration: '3 Ay', 
        role: 'Marketinq Strateqi', 
        challenge: 'Müştəri reklam büdcəsini xərcləyirdi, lakin gələn zənglər qeyri-ciddi idi. Satış qrupu aşağı keyfiyyətli sorğulardan şikayətçi idi.', 
        solution: 'Biz reklam hədəfləməsini gəlir səviyyəsi və maraqlara görə yenidən qurduq. Eyni zamanda, sorğu formasından əvvəl bir "kvalifikasiya" addımı əlavə edərək yalnız ciddi alıcıların bizimlə əlaqə saxlamasını təmin etdik.', 
        results: [{"metric": "500+", "value": "Potensial Müştəri"}, {"metric": "25%", "value": "Satış Artımı"}, {"metric": "-40%", "value": "CPL Azalması"}], 
        sections: [{"heading": "Bazar Araşdırması", "body": "Rəqiblərin reklam strategiyalarını analiz etdik və müştərinin unikal üstünlüklərini qabartdıq."}, {"heading": "Kreativ İstehsal", "body": "Yüksək keyfiyyətli video-turlar və emosional reklam mətnləri hazırladıq."}], 
        tools: ['Meta Ads Manager', 'Google Analytics', 'CRM'], 
        ctaLabel: 'Kampaniya Detalları', 
        ctaHref: '#',
        thumbnail: '/p1.png'
      },
      {
        slug: 'fashion-brand-growth', 
        title: 'Geyim Brendinin Onlayn Artımı', 
        category: 'E-ticarət Marketinqi', 
        tags: ['Influencer Marketinq', 'E-ticarət', 'Brendinq'], 
        summary: 'Yerli geyim brendinin Instagram satışlarının 2 dəfə artırılması və veb-sayt trafikinin optimallaşdırılması.', 
        featured: false, 
        year: '2023', 
        client: 'Urban Wear', 
        duration: '6 Ay', 
        role: 'Growth Marketer', 
        challenge: 'Brendin vizual dili köhnəlmişdi və influencer əməkdaşlıqları xaotik idi.', 
        solution: 'Vahid bir vizual dizayn dili (Aesthetic) hazırladıq. Brendə uyğun mikro-influencerlərlə uzunmüddətli tərəfdaşlıqlar quraraq etibarlı bir imic yaratdıq.', 
        results: [{"metric": "200%", "value": "Satış Artımı"}, {"metric": "15K+", "value": "Yeni İzləyici"}, {"metric": "3.5", "value": "ROAS"}], 
        sections: [{"heading": "Vizual Yenilənmə", "body": "Peşəkar fotosessiyalar və video kontent planı tətbiq edildi."}, {"heading": "Influencer Strategiyası", "body": "Yalnız brendin ruhuna uyğun şəxslərlə effektiv kampaniyalar keçirildi."}], 
        tools: ['Instagram Shopping', 'Canva', 'CapCut'], 
        ctaLabel: 'Layihəni Gör', 
        ctaHref: '#',
        thumbnail: '/p2.png'
      },
      {
        slug: 'luxury-car-rental-ads', 
        title: 'Premium Avtomobil İcarəsi Reklamları', 
        category: 'Performans Marketinqi', 
        tags: ['Google Ads', 'Premium Branding', 'Lead Gen'], 
        summary: 'Lüks avtomobil icarəsi servisi üçün Google Ads vasitəsilə yüksək gəlirli müştərilərin cəlb edilməsi və bron sayının 35% artırılması.', 
        featured: false, 
        year: '2024', 
        client: 'Elite Drive', 
        duration: '2 Ay', 
        role: 'Reklam Mütəxəssisi', 
        challenge: 'Yüksək rəqabətli bazarda lüks avtomobil icarəsi üçün aşağı qiymətli və keyfiyyətli trafik əldə etmək çətin idi.', 
        solution: 'Hədəf sözləri yalnız "Premium" və "Lüks" seqmentlərinə uyğunlaşdırdıq və xüsusi açılış səhifələri (landing pages) vasitəsilə konversiya dərəcəsini artırdıq.', 
        results: [{"metric": "35%", "value": "Bron Artımı"}, {"metric": "18%", "value": "CTR Artımı"}, {"metric": "5.0", "value": "ROAS"}], 
        sections: [{"heading": "Google Ads Optimizasiyası", "body": "Axtarış reklamlarında hədəfləmə və mənfi açar sözlər üzərində dəqiq iş aparıldı."}, {"heading": "Landing Page Dizaynı", "body": "Müştəri təcrübəsini lüks səviyyəsinə qaldırmaq üçün səhifə vizualları yeniləndi."}], 
        tools: ['Google Ads', 'Google Tag Manager', 'Hotjar'], 
        ctaLabel: 'Layihəni İncələ', 
        ctaHref: '#',
        thumbnail: '/p3.png'
      }
    ]
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
