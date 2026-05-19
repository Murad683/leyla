const prisma = require('../config/prisma');

const getHero = async (req, res, next) => {
  try {
    const hero = await prisma.heroSection.findUnique({ where: { id: 1 } });
    if (!hero) {
      return res.json({ success: true, data: null });
    }

    // Map database fields to the expected frontend fields (return both sets of keys for compatibility)
    const mappedHero = {
      id: hero.id,
      title: hero.title || '',
      description: hero.description || '',
      
      // Database fields (used by public homepage Hero.jsx)
      subtitle: hero.subtitle || '',
      ctaLabel: hero.ctaLabel || '',
      ctaHref: hero.ctaHref || '',
      backgroundImage: hero.backgroundImage || '',
      
      // Mapped fields (used by Admin Hero.jsx form)
      badge: hero.subtitle || '',
      primaryBtnText: hero.ctaLabel || '',
      primaryBtnUrl: hero.ctaHref || '',
      secondaryBtnText: '',
      secondaryBtnUrl: '',
      bgImage: hero.backgroundImage || '',
      videoUrl: '',
      
      updatedAt: hero.updatedAt
    };

    res.json({ success: true, data: mappedHero });
  } catch (error) {
    next(error);
  }
};

const updateHero = async (req, res, next) => {
  try {
    const { title, badge, description, primaryBtnText, primaryBtnUrl, bgImage } = req.body;

    // Map incoming frontend fields to the database fields
    const mappedData = {
      title: title || '',
      subtitle: badge || '',
      description: description || '',
      ctaLabel: primaryBtnText || '',
      ctaHref: primaryBtnUrl || '',
      backgroundImage: bgImage || ''
    };

    const hero = await prisma.heroSection.upsert({
      where: { id: 1 },
      update: mappedData,
      create: { ...mappedData, id: 1 }
    });

    // Map saved database fields back to the expected frontend fields (return both sets of keys for compatibility)
    const mappedHero = {
      id: hero.id,
      title: hero.title || '',
      description: hero.description || '',
      
      // Database fields (used by public homepage Hero.jsx)
      subtitle: hero.subtitle || '',
      ctaLabel: hero.ctaLabel || '',
      ctaHref: hero.ctaHref || '',
      backgroundImage: hero.backgroundImage || '',
      
      // Mapped fields (used by Admin Hero.jsx form)
      badge: hero.subtitle || '',
      primaryBtnText: hero.ctaLabel || '',
      primaryBtnUrl: hero.ctaHref || '',
      secondaryBtnText: '',
      secondaryBtnUrl: '',
      bgImage: hero.backgroundImage || '',
      videoUrl: '',
      
      updatedAt: hero.updatedAt
    };

    res.json({ success: true, data: mappedHero });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHero, updateHero };
