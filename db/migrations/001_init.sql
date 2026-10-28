-- Vanzoo CMS — initial schema. All tables InnoDB / utf8mb4.

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(64)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','editor') NOT NULL DEFAULT 'admin',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- One row per page. Content lives in page_revisions; this row points at the
-- revision that is currently published and the one being edited.
CREATE TABLE IF NOT EXISTS pages (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug                  VARCHAR(190) NOT NULL UNIQUE,        -- '/' for the home page, else '/about-us/'
  title                 VARCHAR(255) NOT NULL,
  template              VARCHAR(64)  NOT NULL DEFAULT 'default',
  status                ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_revision_id INT UNSIGNED NULL,
  draft_revision_id     INT UNSIGNED NULL,
  seo                   JSON NULL,                           -- title, description, canonical, noindex, ogImage…
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at          DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS page_revisions (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  page_id    INT UNSIGNED NOT NULL,
  kind       ENUM('draft','published') NOT NULL,
  doc        JSON NOT NULL,                                  -- schema-validated block tree
  seo        JSON NULL,
  note       VARCHAR(255) NULL,
  created_by VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_page (page_id, id),
  CONSTRAINT fk_rev_page FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS media (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  filename   VARCHAR(255) NOT NULL,
  path       VARCHAR(400) NOT NULL UNIQUE,                   -- served at /uploads/<path>
  mime       VARCHAR(100) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL,
  width      INT UNSIGNED NULL,
  height     INT UNSIGNED NULL,
  alt        VARCHAR(255) NULL,
  created_by VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settings (
  k          VARCHAR(100) NOT NULL PRIMARY KEY,
  v          JSON NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_log (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  actor      VARCHAR(64) NULL,
  action     VARCHAR(64) NOT NULL,
  target     VARCHAR(190) NULL,
  detail     JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
