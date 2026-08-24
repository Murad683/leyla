const prisma = require('../config/prisma');

const mapHero = (hero) => ({
  id: hero.id,
  title: hero.title || '',
  description: hero.description || '',

  // Database fields (used by public homepage Hero.jsx)
  subtitle: hero.subtitle || '',
  ctaLabel: hero.ctaLabel || '',
  ctaHref: hero.ctaHref || '',
  backgroundImage: hero.backgroundImage || '',
  videoUrl: hero.videoUrl || '',
  secondaryBtnText: hero.secondaryBtnText || '',
  secondaryBtnHref: hero.secondaryBtnHref || '',

  // Mapped fields (used by Admin Hero.jsx form)
  badge: hero.subtitle || '',
  primaryBtnText: hero.ctaLabel || '',
  primaryBtnUrl: hero.ctaHref || '',
  secondaryBtnUrl: hero.secondaryBtnHref || '',
  bgImage: hero.backgroundImage || '',

  updatedAt: hero.updatedAt
});

const getHero = async (req, res, next) => {
  try {
    const hero = await prisma.heroSection.findUnique({ where: { id: 1 } });
    if (!hero) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: mapHero(hero) });
  } catch (error) {
    next(error);
  }
};

const updateHero = async (req, res, next) => {
  try {
    const { title, badge, description, primaryBtnText, primaryBtnUrl, bgImage, videoUrl, secondaryBtnText, secondaryBtnUrl } = req.body;

    // Map incoming frontend fields to the database fields
    const mappedData = {
      title: title || '',
      subtitle: badge || '',
      description: description || '',
      ctaLabel: primaryBtnText || '',
      ctaHref: primaryBtnUrl || '',
      backgroundImage: bgImage || '',
      videoUrl: videoUrl || '',
      secondaryBtnText: secondaryBtnText || '',
      secondaryBtnHref: secondaryBtnUrl || ''
    };

    const hero = await prisma.heroSection.upsert({
      where: { id: 1 },
      update: mappedData,
      create: { ...mappedData, id: 1 }
    });

    res.json({ success: true, data: mapHero(hero) });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHero, updateHero };
