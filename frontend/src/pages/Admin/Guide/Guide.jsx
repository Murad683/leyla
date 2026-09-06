import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Settings/Settings.module.css';

const SECTIONS = [
  {
    to: '/admin/settings',
    title: 'Ümumi Parametrlər',
    where: 'Bütün saytda: navbar loqosu, footer (əlaqə, ünvan, sosial linklər), brauzer başlığı/təsviri (SEO).',
    tips: [
      'Loqo yükləsən, navbar-da "Leyla Məmmədli" mətni əvəzinə şəkil çıxır. Şəffaf PNG və ya SVG tövsiyə olunur.',
      'Instagram linki footer-də və bəzi düymələrdə istifadə olunur.',
    ],
  },
  {
    to: '/admin/hero',
    title: 'Hero Bölməsi',
    where: 'Ana səhifənin ən üstü - böyük başlıq.',
    tips: [
      '"Vurğu sözü" başlıqdakı sözlərdən biri olmalıdır (məs. "marketoloq"). O söz kursiv və terakota rəngdə göstərilir.',
      'Açıqlama mətni v2 dizaynında ana səhifə hero-da göstərilmir - boş qala bilər.',
    ],
  },
  {
    to: '/admin/home',
    title: 'Ana səhifə mətnləri',
    where: 'Ana səhifə: "Yanaşma" bölməsi, "Rəqəmlər", "Necə işləyirik" (proses), və "Kurslar" səhifəsindəki "Necə keçir" + Suallar (FAQ).',
    tips: [
      'Statistika: "Rəqəm" yalnız ədəd olsun (məs. 16), "Şəkilçi" ayrıca (məs. K+). Səhifədə rəqəm sıfırdan yuxarı sayılaraq görünür.',
      'Paraqraflar: hər sətir ayrıca paraqrafdır.',
      '"Etiket" sahələri bölmə nömrələridir (məs. "03 - Rəqəmlər").',
    ],
  },
  {
    to: '/admin/services',
    title: 'Xidmətlər',
    where: 'Ana səhifədəki xidmət diski (ServicesArc) + "Xidmətlər" səhifəsi.',
    tips: [
      '"Nə daxildir" bəndləri vergüllə ayrılır.',
      'Kartları sürükləyərək sırala - nömrə (01, 02...) avtomatik verilir.',
    ],
  },
  {
    to: '/admin/courses',
    title: 'Kurslar',
    where: '"Kurslar" səhifəsi + ana səhifədəki kurs siyahısı.',
    tips: [
      '"Qısa format" ana səhifədə görünür (məs. "6 həftə · canlı"), "Tam format" isə Kurslar səhifəsində.',
      'Proqram: hər sətir ayrıca bənddir.',
      '"Dərc edilsin" söndürülsə, kurs saytda gizlənir amma silinmir.',
    ],
  },
  {
    to: '/admin/portfolio',
    title: 'Portfolio',
    where: '"Portfolio" səhifəsi + ana səhifədəki "Seçilmiş işlər" lenti.',
    tips: [
      'Teqlər həm kartda görünür, həm də Portfolio səhifəsindəki filtr düymələrini yaradır.',
      'Metrikalar: 3 dənə qısa "ad → dəyər" cütü (məs. "İzləyici artımı → +48K").',
      '"Kart rəngi" hər layihəyə fərqli çalar verir.',
      '"Keys-stadi mətnləri" hissəsi v2 kartlarda göstərilmir - boş qala bilər.',
    ],
  },
  {
    to: '/admin/testimonials',
    title: 'Rəylər',
    where: 'Ana səhifədəki "Rəylər" bölməsi.',
    tips: ['Bütün rəylər gizlədilsə, bölmə tamam yox olur.'],
  },
  {
    to: '/admin/dashboard',
    title: 'Əlaqə mesajları',
    where: 'Saytdakı "Əlaqə" formundan gələn mesajlar Məlumat Panelində görünür.',
    tips: ['"Oxundu et" düyməsi ilə mesajları işarələ.'],
  },
];

const Guide = () => (
  <div className={styles.container}>
    <div className={styles.header}>
      <div>
        <h2 className={styles.title}>Təlimat</h2>
        <p className={styles.subtitle}>
          Hər bölmənin nəyi idarə etdiyi və saytda harada göründüyü.
        </p>
      </div>
    </div>

    <div className={styles.card} style={{ borderLeft: '3px solid #4a90d9' }}>
      <h3 className={styles.cardTitle}>Necə işləyir</h3>
      <p className={styles.subtitle} style={{ margin: 0 }}>
        Burada etdiyin dəyişikliklər dərhal yadda saxlanır. Saytda görünməsi
        üçün səhifəni yenilə (bəzən ~1 dəqiqə keşləmə olur). Şəkillər Cloudinary-yə
        yüklənir. Bir sahəni boş qoysan, sayt köhnə/standart mətnə keçmir -
        sadəcə həmin element boş görünə bilər, ona görə vacib sahələri doldur.
      </p>
    </div>

    {SECTIONS.map((s) => (
      <div className={styles.card} key={s.to}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <h3 className={styles.cardTitle}>{s.title}</h3>
          <Link to={s.to} className={styles.label} style={{ color: '#e5544b' }}>
            Bölməyə keç →
          </Link>
        </div>
        <p className={styles.subtitle} style={{ marginTop: 4 }}>
          <strong>Harada görünür:</strong> {s.where}
        </p>
        <ul style={{ margin: '10px 0 0', paddingLeft: 18, color: '#b7b6bd', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {s.tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default Guide;
