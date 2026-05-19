const prisma = require('../config/prisma');

const getAbout = async (req, res, next) => {
  try {
    const about = await prisma.aboutSection.findUnique({ where: { id: 1 } });
    const values = await prisma.aboutValue.findMany();
    const experience = await prisma.aboutExperience.findMany();
    
    res.json({ 
      success: true, 
      data: {
        ...about,
        values,
        experience
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateAbout = async (req, res, next) => {
  try {
    const { values, experience, ...aboutData } = req.body;
    
    const about = await prisma.aboutSection.upsert({
      where: { id: 1 },
      update: aboutData,
      create: { ...aboutData, id: 1 }
    });

    res.json({ success: true, data: about });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAbout, updateAbout };
