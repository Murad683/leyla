// One-off content update: refreshes Hero/About/Services/Portfolio copy to match
// the new "sell trainings" site direction. Run manually — NOT wired into any
// deploy/CI step, so it will not re-run on push and will not touch
// Contact, User, BlogPost, or SiteSettings rows.
//
// Usage: node prisma/update-content.js
require('dotenv').config();
const { PrismaClient } = require('./generated/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Updating Hero section...');
  await prisma.heroSection.upsert({
    where: { id: 1 },
    update: {
      title: 'Bacarıqlarınızı növbəti səviyyəyə aparan təlimlər',
      subtitle: 'Yeni kurs mövsümü açıqdır',
      description: 'Praktik, nəticə yönümlü təlim proqramları ilə marketinq bacarıqlarınızı inkişaf etdirin, real layihələr üzərində işləyin və karyeranızı irəli aparın.',
      ctaLabel: 'Təlimlərə bax',
      ctaHref: '/services',
    },
    create: {
      id: 1,
      title: 'Bacarıqlarınızı növbəti səviyyəyə aparan təlimlər',
      subtitle: 'Yeni kurs mövsümü açıqdır',
      description: 'Praktik, nəticə yönümlü təlim proqramları ilə marketinq bacarıqlarınızı inkişaf etdirin, real layihələr üzərində işləyin və karyeranızı irəli aparın.',
      ctaLabel: 'Təlimlərə bax',
      ctaHref: '/services',
    },
  });

  console.log('Updating About section...');
  await prisma.aboutSection.upsert({
    where: { id: 1 },
    update: {
      story: "Mən marketinq bacarıqlarını öyrətməyə həvəsli bir təlimçi və mentoram. İllər boyu qazandığım praktik təcrübəni struktur təlim proqramlarına çevirərək, iştirakçıların nəzəriyyədən real nəticəyə keçməsinə kömək edirəm. Yanaşmam sadədir: hər mövzu praktik tapşırıqla möhkəmləndirilir və hər məzun real layihə təcrübəsi ilə kursu bitirir.",
      experienceYears: 7,
      skills: ['Google Ads', 'Facebook/Meta Reklamları', 'Data Analitika', 'Kopiraytinq', 'SMM Strategiyası', 'Kurikulum Dizaynı'],
    },
    create: {
      id: 1,
      story: "Mən marketinq bacarıqlarını öyrətməyə həvəsli bir təlimçi və mentoram. İllər boyu qazandığım praktik təcrübəni struktur təlim proqramlarına çevirərək, iştirakçıların nəzəriyyədən real nəticəyə keçməsinə kömək edirəm. Yanaşmam sadədir: hər mövzu praktik tapşırıqla möhkəmləndirilir və hər məzun real layihə təcrübəsi ilə kursu bitirir.",
      experienceYears: 7,
      skills: ['Google Ads', 'Facebook/Meta Reklamları', 'Data Analitika', 'Kopiraytinq', 'SMM Strategiyası', 'Kurikulum Dizaynı'],
    },
  });

  console.log('Replacing About values...');
  await prisma.aboutValue.deleteMany();
  await prisma.aboutValue.createMany({
    data: [
      { icon: 'QualityIcon', title: 'Praktik Yanaşma', description: 'Hər dərs real tapşırıq və nümunələrlə dəstəklənir, sadəcə nəzəriyyə ilə kifayətlənmirik.' },
      { icon: 'InnovationIcon', title: 'Fərdi Diqqət', description: 'Qrup ölçüləri kiçik saxlanılır ki, hər iştirakçıya fərdi rəy vermək mümkün olsun.' },
      { icon: 'CollaborationIcon', title: 'Davamlı Dəstək', description: 'Təlim bitdikdən sonra da suallarınızla yanınızdayıq — məzunlarımızla əlaqə kəsilmir.' },
    ],
  });

  console.log('Replacing About experience...');
  await prisma.aboutExperience.deleteMany();
  await prisma.aboutExperience.createMany({
    data: [
      { year: '2023 - Hazırda', role: 'Təlimçi və Kurikulum Rəhbəri', company: 'LeylaDigital Akademiya' },
      { year: '2020 - 2023', role: 'Baş Marketinq Strateqi', company: 'AdVantage Agency' },
      { year: '2018 - 2020', role: 'Performans Marketoloq', company: 'Growth Hub' },
    ],
  });

  console.log('Replacing Services (Trainings)...');
  await prisma.serviceItem.deleteMany();
  await prisma.serviceItem.createMany({
    data: [
      {
        icon: 'DesignIcon',
        title: 'Sosial Media Marketinq Təlimi',
        description: 'Instagram və TikTok hesablarını strategiyalı şəkildə böyütməyi, məzmun planı qurmağı və auditoriya ilə real əlaqə yaratmağı öyrədən praktik proqram.',
        features: ['Kontent Planlaşdırma', 'Platforma Alqoritmləri', 'İcma İdarəçiliyi'],
        ctaLabel: 'Qeydiyyatdan keç',
        ctaHref: '/contact',
      },
      {
        icon: 'DevIcon',
        title: 'Performans Marketinqi Təlimi',
        description: 'Google Ads və Meta Ads üzərində real büdcə ilə kampaniya qurmağı, ölçməyi və nəticəni artırmağı addım-addım öyrədən tətbiqi kurs.',
        features: ['Google Ads (PPC)', 'Meta (FB/IG) Reklamları', 'Analitika və Optimallaşdırma'],
        ctaLabel: 'Qeydiyyatdan keç',
        ctaHref: '/contact',
      },
      {
        icon: 'StrategyIcon',
        title: 'Brend Strategiyası Təlimi',
        description: 'Bazar analizindən başlayaraq, rəqiblərdən fərqlənən və yadda qalan bir brend kimliyi qurmağın metodologiyasını öyrədən kurs.',
        features: ['Bazar Analizi', 'Brend Mövqeləndirilməsi', 'Kommunikasiya Strategiyası'],
        ctaLabel: 'Qeydiyyatdan keç',
        ctaHref: '/contact',
      },
      {
        icon: 'SeoIcon',
        title: 'SEO və Rəqəmsal Artım Təlimi',
        description: 'Axtarış sistemlərində üzvi trafiki necə artırmağı, texniki SEO əsaslarını və məzmun optimizasiyasını praktiki nümunələrlə öyrədən proqram.',
        features: ['Texniki SEO', 'Açar Söz Araşdırması', 'Məzmun Optimizasiyası'],
        ctaLabel: 'Qeydiyyatdan keç',
        ctaHref: '/contact',
      },
      {
        icon: 'ContentIcon',
        title: 'Kopiraytinq və Satış Mətnləri Təlimi',
        description: 'İnsanları hərəkətə keçirən, satışa yönəlmiş reklam mətnləri və email kampaniyaları yazmağı öyrədən yaradıcı yazı kursu.',
        features: ['Satış Mətnləri', 'Email Marketinq', 'Sosial Media Kopiraytinqi'],
        ctaLabel: 'Qeydiyyatdan keç',
        ctaHref: '/contact',
      },
      {
        icon: 'ConsultIcon',
        title: 'Fərdi Karyera Mentorluğu',
        description: 'Marketinq sahəsində karyeranızı planlaşdırmaq, portfolio qurmaq və iş müsahibələrinə hazırlaşmaq üçün bir-bir mentorluq proqramı.',
        features: ['Fərdi İnkişaf Planı', 'Portfolio Baxışı', 'Müsahibə Hazırlığı'],
        ctaLabel: 'Qeydiyyatdan keç',
        ctaHref: '/contact',
      },
    ],
  });

  console.log('Replacing Portfolio (Nəticələr / success stories)...');
  await prisma.portfolioItem.deleteMany();
  await prisma.portfolioItem.createMany({
    data: [
      {
        slug: 'aynur-sosial-media-telimi',
        title: 'Sosial Media Marketinq Təlimi',
        category: 'Sosial Media',
        tags: ['Instagram', 'Kontent Strategiyası', 'İcma İdarəçiliyi'],
        summary: 'Kiçik bir moda brendinin Instagram hesabını sıfırdan strukturlaşdıraraq izləyici sayını 3 ay ərzində qat-qat artırdı.',
        featured: true,
        year: '2026',
        client: 'Aynur M.',
        duration: '6 həftə',
        role: 'Məzun',
        challenge: 'Aynur brend hesabını idarə edirdi, lakin izləyici sayı 8 aydır yerində sayırdı və satışa çevrilmirdi.',
        solution: 'Təlim ərzində auditoriya analizi, kontent təqvimi qurma və hekayə (storytelling) texnikalarını öyrəndi, öyrəndiklərini real hesab üzərində tətbiq etdi.',
        results: [
          { metric: '3x', value: 'İzləyici Artımı' },
          { metric: '+65%', value: 'Əlaqə (Engagement)' },
          { metric: '4', value: 'Yeni Əməkdaşlıq' },
        ],
        sections: [
          { heading: 'Başlanğıc Nöqtəsi', body: 'Təlimin əvvəlində mövcud hesab auditi aparıldı, zəif tərəflər müəyyən edildi.' },
          { heading: 'Tətbiq', body: 'Hər həftə öyrənilən mövzu real hesab üzərində sınaqdan keçirildi və rəy alındı.' },
        ],
        tools: ['Instagram', 'Canva', 'Meta Business Suite'],
        ctaLabel: 'Bu Təlimə Qeydiyyatdan Keç',
        ctaHref: '/contact',
      },
      {
        slug: 'kamran-performans-marketinqi',
        title: 'Performans Marketinqi Təlimi',
        category: 'Performans Marketinqi',
        tags: ['Google Ads', 'Meta Ads', 'Analitika'],
        summary: 'Kiçik e-ticarət mağazası sahibi ilk dəfə özü reklam kampaniyası qurmağı öyrənərək reklam xərcini optimallaşdırdı.',
        featured: false,
        year: '2026',
        client: 'Kamran S.',
        duration: '8 həftə',
        role: 'Məzun',
        challenge: 'Kamran agentliyə ödədiyi məbləği azaltmaq və kampaniyalarını özü idarə etməyi öyrənmək istəyirdi.',
        solution: 'Təlimdə kampaniya strukturu, hədəfləmə və büdcə idarəetməsini öyrənib, kursu real kampaniya ilə bitirdi.',
        results: [
          { metric: '-30%', value: 'Reklam Xərci' },
          { metric: '+18%', value: 'Konversiya' },
          { metric: '1', value: 'Canlı Kampaniya' },
        ],
        sections: [
          { heading: 'Praktik Tapşırıq', body: 'Kurs boyu kiçik büdcəli test kampaniyaları qurularaq nəticələr analiz edildi.' },
        ],
        tools: ['Google Ads', 'Meta Ads Manager', 'Google Analytics'],
        ctaLabel: 'Bu Təlimə Qeydiyyatdan Keç',
        ctaHref: '/contact',
      },
      {
        slug: 'nigar-kopiraytinq-telimi',
        title: 'Kopiraytinq Təlimi',
        category: 'Kopiraytinq',
        tags: ['Satış Mətnləri', 'Email Marketinq'],
        summary: 'Freelancer kimi fəaliyyətə başlamaq istəyən iştirakçı, təlimdən sonra ilk müştərilərini qazandı.',
        featured: false,
        year: '2025',
        client: 'Nigar Ə.',
        duration: '4 həftə',
        role: 'Məzun',
        challenge: 'Nigarın yazı bacarığı var idi, lakin satış yönümlü mətn strukturunu bilmirdi.',
        solution: 'Formula əsaslı kopiraytinq çərçivələrini öyrənib, kurs bitdikdən sonra öz portfolio-sunu hazırladı.',
        results: [
          { metric: '3', value: 'İlk Müştəri' },
          { metric: '+40%', value: 'Açılma Nisbəti (Email)' },
        ],
        sections: [
          { heading: 'Portfolio Qurma', body: 'Son həftə tamamilə şəxsi portfolio hazırlanmasına həsr olundu.' },
        ],
        tools: ['Google Docs', 'Mailchimp'],
        ctaLabel: 'Bu Təlimə Qeydiyyatdan Keç',
        ctaHref: '/contact',
      },
    ],
  });

  console.log('Content update finished. Contact, User, BlogPost, SiteSettings were not touched.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
