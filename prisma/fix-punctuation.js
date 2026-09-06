/**
 * One-off: replace "smart" typography (em/en dash, ellipsis, curly quotes) with
 * plain keyboard characters across every content row already in the DB.
 *
 * In-place and idempotent: only rows that actually contain those characters are
 * rewritten, so it preserves any admin edits. Never touches User or Contact.
 *
 *   docker compose -f deploy/compose.yml exec -T leyla-api node /app/prisma/fix-punctuation.js
 */
const { PrismaClient } = require('./generated/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const fixString = (s) =>
  s
    .replace(/—/g, '-')   // em dash
    .replace(/–/g, '-')   // en dash
    .replace(/…/g, '...') // ellipsis
    .replace(/“/g, '"')   // left double quote
    .replace(/”/g, '"');  // right double quote

// deep-walk any value (string / array / plain object / JSON column)
const fixDeep = (v) => {
  if (typeof v === 'string') return fixString(v);
  if (Array.isArray(v)) return v.map(fixDeep);
  if (v && typeof v === 'object') {
    const out = {};
    for (const k of Object.keys(v)) out[k] = fixDeep(v[k]);
    return out;
  }
  return v;
};

// which columns to scan per model (id is always the where-key = 1 or real id)
const TARGETS = [
  { model: 'siteSettings', singleton: true, cols: ['metaTitle', 'metaDescription', 'address'] },
  { model: 'heroSection', singleton: true, cols: ['title', 'accentText', 'subtitle', 'description', 'ctaLabel'] },
  {
    model: 'homeContent',
    singleton: true,
    cols: [
      'introEyebrow', 'introStatement', 'introAccent', 'introParagraphs', 'introTags',
      'numbersEyebrow', 'stats',
      'processEyebrow', 'processHeadline', 'processSteps',
      'coursesEyebrow', 'coursesHeadline', 'courseHow', 'courseFaq',
      'quotesEyebrow',
    ],
  },
  { model: 'serviceItem', cols: ['title', 'description', 'outcome', 'features'] },
  { model: 'portfolioItem', cols: ['title', 'summary', 'resultHeadline', 'tags', 'results', 'client', 'role', 'challenge', 'solution', 'sections'] },
  { model: 'course', cols: ['title', 'description', 'meta', 'format', 'program', 'audience', 'outcome'] },
  { model: 'testimonial', cols: ['quote', 'author', 'role'] },
];

async function main() {
  let touched = 0;

  // Earlier admin test saved the hero title with the dash dropped entirely;
  // restore the canonical wording (plain dash).
  const hero = await prisma.heroSection.findUnique({ where: { id: 1 } });
  if (hero && hero.title === 'Sosial media marketoloq təfəkkürü ilə.') {
    await prisma.heroSection.update({
      where: { id: 1 },
      data: { title: 'Sosial media - marketoloq təfəkkürü ilə.' },
    });
    touched++;
    console.log('  heroSection#1: title');
  }

  for (const t of TARGETS) {
    const rows = await prisma[t.model].findMany();
    for (const row of rows) {
      const patch = {};
      for (const col of t.cols) {
        if (row[col] == null) continue;
        const fixed = fixDeep(row[col]);
        if (JSON.stringify(fixed) !== JSON.stringify(row[col])) patch[col] = fixed;
      }
      if (Object.keys(patch).length) {
        await prisma[t.model].update({ where: { id: row.id }, data: patch });
        touched++;
        console.log(`  ${t.model}#${row.id}: ${Object.keys(patch).join(', ')}`);
      }
    }
  }

  console.log(touched ? `\nDone. ${touched} row(s) cleaned.` : '\nNothing to clean.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => pool.end());
