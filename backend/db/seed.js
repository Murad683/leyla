const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const seedData = async () => {
  try {
    logger.info('Starting database seeding...');
    
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSql);
    logger.info('Schema created.');

    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await pool.query(seedSql);
    logger.info('Data seeded successfully.');

    process.exit(0);
  } catch (err) {
    logger.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
