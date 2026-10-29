-- Reusable sections and page templates saved from the editor (copies, not live links).
CREATE TABLE IF NOT EXISTS cms_saved (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kind       ENUM('section','page') NOT NULL,
  name       VARCHAR(120) NOT NULL,
  doc        JSON NOT NULL,                 -- { version: 1, blocks: [...] }
  created_by VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_kind (kind, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
