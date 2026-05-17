-- Clear existing data
TRUNCATE blog_posts, portfolio_items RESTART IDENTITY CASCADE;

-- Insert Marketing-Focused Blog Posts
INSERT INTO blog_posts (slug, title, excerpt, category, tags, read_time, published_at, featured, cover_image, content, author_name) VALUES 
(
  'digital-marketing-roi-strategies', 
  'Rəqəmsal Marketinqdə ROI-ni Necə Artırmalı?', 
  'Reklam büdcənizin hər qəpiyinin sizə qazanc gətirməsi üçün tətbiq etməli olduğunuz əsas strategiyalar və analitik yanaşmalar.', 
  'Performans Marketinqi', 
  ARRAY['Google Ads', 'ROI', 'Analitika', 'Satış'], 
  6, 
  '2026-05-09T10:00:00Z', 
  true, 
  '/hero_visual.png',
  '## Giriş
Müasir rəqəmsal dünyada reklam vermək kifayət deyil. Əsas məqsəd reklam büdcəsinin səmərəliliyini (ROI) maksimuma çatdırmaqdır. Bir çox bizneslər reklam büdcəsini "xərcləyir", lakin strateji marketinq büdcəni "investisiya" kimi görür.

## Strategiya və Analitika
İlk növbədə, hədəf auditoriyanın düzgün seqmentasiyası vacibdir. Hamıya reklam göstərmək, heç kimə reklam göstərməməkdir. Biz A/B testləri vasitəsilə ən çox konversiya gətirən auditoriyaları müəyyən edirik.

## Konversiya Optimizasiyası
Reklamın gətirdiyi trafikin satışa çevrilməsi üçün "Landing Page" optimizasiyası şərtdir. Mətnlərin təsirli olması və CTA (hərəkətə çağırış) düymələrinin düzgün yerləşdirilməsi satış ehtimalını 2 dəfə artıra bilər.

> "Marketinq sadəcə kreativlik deyil, həm də rəqəmlərin dilini anlamaqdır."

## Nəticə
Düzgün qurulmuş rəqəmsal strategiya ilə siz nəinki müştəri sayınızı artıra, həm də bir müştərinin cəlb edilməsi xərclərini (CPA) əhəmiyyətli dərəcədə azalda bilərsiniz.', 
  'LeylaDigital'
),
(
  'social-media-branding-2026', 
  '2026-cı ildə Sosial Media Brendinqi', 
  'Brendinizin sosial platformalarda necə yadda qalan olması və sadiq auditoriya toplamasının yolları.', 
  'SMM Strategiyası', 
  ARRAY['Brendinq', 'Instagram', 'Tiktok', 'Kontent'], 
  4, 
  '2026-05-08T15:30:00Z', 
  false, 
  '/about_visual.png',
  '## Sosial Medianın Gücü
Sosial media artıq sadəcə şəkil paylaşmaq yeri deyil, brendin xarakterini göstərdiyi platformadır. İnsanlar brendlərdən səmimiyyət və dəyər gözləyirlər.

## Kontent Strategiyası
Keyfiyyət kəmiyyətdən üstündür. Hər gün maraqsız post paylaşmaqdansa, həftədə 3 dəfə auditoriyanın problemini həll edən və ya onlara ilham verən kontent paylaşmaq daha effektivdir.', 
  'LeylaDigital'
);

-- Insert Marketing-Focused Portfolio Items
INSERT INTO portfolio_items (slug, title, category, tags, summary, featured, year, client, duration, role, challenge, solution, results, sections, tools, cta_label, cta_href, thumbnail) VALUES 
(
  'real-estate-lead-gen', 
  'Daşınmaz Əmlak Satış Kampaniyası', 
  'Performans Marketinqi', 
  ARRAY['Meta Ads', 'Lead Generation', 'Satış Hunisi'], 
  'Yeni yaşayış kompleksi üçün 3 ay ərzində 500+ yüksək keyfiyyətli müştəri sorğusunun (lead) toplanması və satışların 25% artırılması.', 
  true, 
  '2024', 
  'Modern Residence', 
  '3 Ay', 
  'Marketinq Strateqi', 
  'Müştəri reklam büdcəsini xərcləyirdi, lakin gələn zənglər qeyri-ciddi idi. Satış qrupu aşağı keyfiyyətli sorğulardan şikayətçi idi.', 
  'Biz reklam hədəfləməsini gəlir səviyyəsi və maraqlara görə yenidən qurduq. Eyni zamanda, sorğu formasından əvvəl bir "kvalifikasiya" addımı əlavə edərək yalnız ciddi alıcıların bizimlə əlaqə saxlamasını təmin etdik.', 
  '[{"metric": "500+", "value": "Potensial Müştəri"}, {"metric": "25%", "value": "Satış Artımı"}, {"metric": "-40%", "value": "CPL Azalması"}]', 
  '[{"heading": "Bazar Araşdırması", "body": "Rəqiblərin reklam strategiyalarını analiz etdik və müştərinin unikal üstünlüklərini qabartdıq."}, {"heading": "Kreativ İstehsal", "body": "Yüksək keyfiyyətli video-turlar və emosional reklam mətnləri hazırladıq."}]', 
  ARRAY['Meta Ads Manager', 'Google Analytics', 'CRM'], 
  'Kampaniya Detalları', 
  '#',
  '/p1.png'
),
(
  'fashion-brand-growth', 
  'Geyim Brendinin Onlayn Artımı', 
  'E-ticarət Marketinqi', 
  ARRAY['Influencer Marketinq', 'E-ticarət', 'Brendinq'], 
  'Yerli geyim brendinin Instagram satışlarının 2 dəfə artırılması və veb-sayt trafikinin optimallaşdırılması.', 
  false, 
  '2023', 
  'Urban Wear', 
  '6 Ay', 
  'Growth Marketer', 
  'Brendin vizual dili köhnəlmişdi və influencer əməkdaşlıqları xaotik idi.', 
  'Vahid bir vizual dizayn dili (Aesthetic) hazırladıq. Brendə uyğun mikro-influencerlərlə uzunmüddətli tərəfdaşlıqlar quraraq etibarlı bir imic yaratdıq.', 
  '[{"metric": "200%", "value": "Satış Artımı"}, {"metric": "15K+", "value": "Yeni İzləyici"}, {"metric": "3.5", "value": "ROAS"}]', 
  '[{"heading": "Vizual Yenilənmə", "body": "Peşəkar fotosessiyalar və video kontent planı tətbiq edildi."}, {"heading": "Influencer Strategiyası", "body": "Yalnız brendin ruhuna uyğun şəxslərlə effektiv kampaniyalar keçirildi."}]', 
  ARRAY['Instagram Shopping', 'Canva', 'CapCut'], 
  'Layihəni Gör', 
  '#',
  '/p2.png'
),
(
  'luxury-car-rental-ads', 
  'Premium Avtomobil İcarəsi Reklamları', 
  'Performans Marketinqi', 
  ARRAY['Google Ads', 'Premium Branding', 'Lead Gen'], 
  'Lüks avtomobil icarəsi servisi üçün Google Ads vasitəsilə yüksək gəlirli müştərilərin cəlb edilməsi və bron sayının 35% artırılması.', 
  false, 
  '2024', 
  'Elite Drive', 
  '2 Ay', 
  'Reklam Mütəxəssisi', 
  'Yüksək rəqabətli bazarda lüks avtomobil icarəsi üçün aşağı qiymətli və keyfiyyətli trafik əldə etmək çətin idi.', 
  'Hədəf sözləri yalnız "Premium" və "Lüks" seqmentlərinə uyğunlaşdırdıq və xüsusi açılış səhifələri (landing pages) vasitəsilə konversiya dərəcəsini artırdıq.', 
  '[{"metric": "35%", "value": "Bron Artımı"}, {"metric": "18%", "value": "CTR Artımı"}, {"metric": "5.0", "value": "ROAS"}]', 
  '[{"heading": "Google Ads Optimizasiyası", "body": "Axtarış reklamlarında hədəfləmə və mənfi açar sözlər üzərində dəqiq iş aparıldı."}, {"heading": "Landing Page Dizaynı", "body": "Müştəri təcrübəsini lüks səviyyəsinə qaldırmaq üçün səhifə vizualları yeniləndi."}]', 
  ARRAY['Google Ads', 'Google Tag Manager', 'Hotjar'], 
  'Layihəni İncələ', 
  '#',
  '/p3.png'
);
