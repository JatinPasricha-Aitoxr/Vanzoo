-- Blog posts authored in the CMS. A row whose slug matches a built-in post
-- overrides it; `hidden` removes a built-in post from the site without deleting it.
CREATE TABLE IF NOT EXISTS cms_posts (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug             VARCHAR(190) NOT NULL UNIQUE,
  title            VARCHAR(255) NOT NULL,
  excerpt          VARCHAR(500) NOT NULL DEFAULT '',
  body             MEDIUMTEXT NOT NULL,                  -- sanitised HTML (whitelist), see src/cms/sanitize.ts
  image            VARCHAR(400) NULL,
  image_alt        VARCHAR(255) NOT NULL DEFAULT '',
  categories       JSON NOT NULL,
  tags             JSON NOT NULL,
  reading_minutes  SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  status           ENUM('draft','published') NOT NULL DEFAULT 'draft',
  hidden           TINYINT(1) NOT NULL DEFAULT 0,
  published_at     DATETIME NULL,
  created_by       VARCHAR(64) NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_status (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
