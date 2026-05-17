DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS portfolio_items;

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(200),
  service VARCHAR(100),
  budget VARCHAR(100),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  excerpt TEXT,
  category VARCHAR(100),
  tags TEXT[],
  read_time INTEGER,
  published_at TIMESTAMPTZ,
  featured BOOLEAN DEFAULT FALSE,
  cover_image VARCHAR(500),
  content TEXT NOT NULL,
  author_name VARCHAR(100),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio_items (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  summary TEXT,
  thumbnail VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  year VARCHAR(10),
  client VARCHAR(200),
  duration VARCHAR(100),
  role VARCHAR(200),
  challenge TEXT,
  solution TEXT,
  results JSONB,
  sections JSONB,
  tools TEXT[],
  cta_label VARCHAR(100),
  cta_href VARCHAR(500),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
